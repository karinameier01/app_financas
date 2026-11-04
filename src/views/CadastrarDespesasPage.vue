<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Despesas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-content>
          <small>Total de despesas</small>
          <h1 class="total">{{ formatarValor(total) }}</h1>
        </ion-card-content>
      </ion-card>

      <div v-if="carregando" class="centro"><ion-spinner name="crescent" /></div>
      <LancamentoList
        v-else
        :itens="itens"
        cor="danger"
        vazio="Nenhuma despesa cadastrada. Toque no + para adicionar."
        @editar="abrirEdicao"
        @excluir="confirmarExclusao"
      />

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="abrirNovo">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <LancamentoForm
        :aberto="modalAberto"
        :categorias="CATEGORIAS_DESPESA"
        :lancamento="editando"
        :salvando="salvando"
        rotulo="despesa"
        @salvar="salvar"
        @fechar="modalAberto = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, IonSpinner,
  alertController, toastController, onIonViewWillEnter,
} from '@ionic/vue'
import { add } from 'ionicons/icons'
import LancamentoForm from '../components/LancamentoForm.vue'
import LancamentoList from '../components/LancamentoList.vue'
import { useLancamentos } from '../composables/useLancamentos'
import { CATEGORIAS_DESPESA } from '../types'
import type { Lancamento, NovoLancamento } from '../types'
import { formatarValor } from '../utils/formatar'

const { itens, carregando, listar, inserir, atualizar, excluir } = useLancamentos('despesas')

const modalAberto = ref(false)
const editando = ref<Lancamento | null>(null)
const salvando = ref(false)

const total = computed(() => itens.value.reduce((soma, i) => soma + i.valor, 0))

onIonViewWillEnter(() => {
  listar().catch(() => mensagem('Erro ao carregar as despesas.'))
})

async function mensagem(texto: string, cor: 'danger' | 'success' = 'danger') {
  const toast = await toastController.create({ message: texto, duration: 2500, color: cor })
  await toast.present()
}

function abrirNovo() {
  editando.value = null
  modalAberto.value = true
}

function abrirEdicao(item: Lancamento) {
  editando.value = item
  modalAberto.value = true
}

async function salvar(dados: NovoLancamento) {
  salvando.value = true
  try {
    if (editando.value) {
      await atualizar(editando.value.id, dados)
      mensagem('Despesa atualizada!', 'success')
    } else {
      await inserir(dados)
      mensagem('Despesa adicionada!', 'success')
    }
    modalAberto.value = false
  } catch {
    mensagem('Não foi possível salvar. Tente novamente.')
  } finally {
    salvando.value = false
  }
}

async function confirmarExclusao(item: Lancamento) {
  const alerta = await alertController.create({
    header: 'Excluir despesa',
    message: `Deseja excluir "${item.descricao}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          try {
            await excluir(item.id)
            mensagem('Despesa excluída.', 'success')
          } catch {
            mensagem('Não foi possível excluir.')
          }
        },
      },
    ],
  })