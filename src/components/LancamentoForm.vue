<template>
  <ion-modal :is-open="aberto" @didDismiss="emit('fechar')">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ lancamento ? 'Editar' : 'Nova' }} {{ rotulo }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('fechar')">Cancelar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
        v-model="descricao"
        label="Descrição"
        label-placement="floating"
        :maxlength="100"
        />
      </ion-item>
      <ion-note v-if="erros.descricao" color="danger" class="erro">{{ erros.descricao }}</ion-note>

      <ion-item>
        <ion-input
          v-model="valor"
          type="number"
          inputmode="decimal"
          step="0.01"
          label="Valor (R$)"
          label-placement="floating"
        />
      </ion-item>
      <ion-note v-if="erros.valor" color="danger" class="erro">{{ erros.valor }}</ion-note>

      <ion-item>
        <ion-select
          v-model="categoria"
          label="Categoria"
          label-placement="floating"
          interface="popover"
        >
          <ion-select-option v-for="c in categorias" :key="c" :value="c">{{ c }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-note v-if="erros.categoria" color="danger" class="erro">{{ erros.categoria }}</ion-note>

      <ion-item>
        <ion-input v-model="data" type="date" label="Data" label-placement="floating" />
      </ion-item>
      <ion-note v-if="erros.data" color="danger" class="erro">{{ erros.data }}</ion-note>

      <ion-button expand="block" class="botao" :disabled="salvando" @click="enviar">
        <ion-spinner v-if="salvando" name="crescent" />
        <span v-else>Salvar</span>
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonItem, IonInput, IonSelect, IonSelectOption, IonNote, IonSpinner,
} from '@ionic/vue'
import type { Lancamento, NovoLancamento } from '@/types'

const props = defineProps<{
  aberto: boolean
  categorias: string[]
  rotulo: string // "receita" ou "despesa"
  lancamento?: Lancamento | null // se vier preenchido, é edição
  salvando?: boolean
}>()

const emit = defineEmits<{
  (e: 'salvar', lancamento: NovoLancamento): void
  (e: 'fechar'): void
}>()

const descricao = ref('')
const valor = ref<string | number>('')
const categoria = ref('')
const data = ref('')
const erros = reactive({ descricao: '', valor: '', categoria: '', data: '' })

function hoje() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

// Toda vez que o modal abre, preenche com os dados da edição ou limpa para um novo
watch(
  () => props.aberto,
  (aberto) => {
    if (!aberto) return
    Object.assign(erros, { descricao: '', valor: '', categoria: '', data: '' })
    if (props.lancamento) {
      descricao.value = props.lancamento.descricao
      valor.value = props.lancamento.valor
      categoria.value = props.lancamento.categoria
      data.value = props.lancamento.data
    } else {
      descricao.value = ''
      valor.value = ''
      categoria.value = ''
      data.value = hoje()
    }
  }
)

function validar() {
  erros.descricao = descricao.value.trim() ? '' : 'Informe a descrição.'

  const numero = Number(String(valor.value).replace(',', '.'))
  erros.valor = numero > 0 ? '' : 'Informe um valor maior que zero.'

  erros.categoria = categoria.value ? '' : 'Escolha uma categoria.'
  erros.data = data.value ? '' : 'Informe a data.'

  return !erros.descricao && !erros.valor && !erros.categoria && !erros.data
}

function enviar() {
  if (!validar()) return
  emit('salvar', {
    descricao: descricao.value.trim(),
    valor: Number(String(valor.value).replace(',', '.')),
    categoria: categoria.value,
    data: data.value,
  })
}
</script>

<style scoped>
.botao {
  margin-top: 24px;
}
.erro {
  display: block;
  padding: 4px 16px 0;
}
</style>