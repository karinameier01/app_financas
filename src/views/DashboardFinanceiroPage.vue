<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-select v-model="periodo" label="Período" label-placement="floating" interface="popover">
          <ion-select-option value="tudo">Todo o período</ion-select-option>
          <ion-select-option value="mes">Este mês</ion-select-option>
          <ion-select-option value="3meses">Últimos 3 meses</ion-select-option>
          <ion-select-option value="ano">Este ano</ion-select-option>
        </ion-select>
      </ion-item>

      <div v-if="carregando" class="centro"><ion-spinner name="crescent" /></div>

      <template v-else>
        <!-- Cards resumo -->
        <div class="grade">
          <SummaryCard titulo="Total de receitas" :valor="formatarValor(totalReceitas)" cor="success" />
          <SummaryCard titulo="Total de despesas" :valor="formatarValor(totalDespesas)" cor="danger" />
          <SummaryCard
            titulo="Saldo atual"
            :valor="formatarValor(saldo)"
            :cor="saldo >= 0 ? 'primary' : 'danger'"
          />
        </div>

        <!-- Indicadores visuais -->
        <div class="grade">
          <SummaryCard
            titulo="Maior categoria de gasto"
            :valor="maiorCategoria ? maiorCategoria.nome : '—'"
            :detalhe="maiorCategoria ? formatarValor(maiorCategoria.valor) : 'Sem despesas'"
          />
          <SummaryCard titulo="Quantidade de lançamentos" :valor="String(quantidade)" />
          <SummaryCard
            titulo="Despesas sobre receitas"
            :valor="percentualTexto"
            :cor="percentual !== null && percentual > 100 ? 'danger' : undefined"
          />
        </div>

        <!-- Gráfico de pizza -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Despesas por categoria</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <VueApexCharts
              v-if="categorias.length"
              :key="'pizza-' + escuro"
              type="pie"
              height="340"
              :options="opcoesPizza"
              :series="valoresCategorias"
            />
            <p v-else class="vazio">Nenhuma despesa no período.</p>
          </ion-card-content>
        </ion-card>

        <!-- Gráfico de barras -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Receitas e despesas por mês</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <VueApexCharts
              v-if="porMes.meses.length"
              :key="'barras-' + escuro"
              type="bar"
              height="320"
              :options="opcoesBarras"
              :series="seriesBarras"
            />
            <p v-else class="vazio">Nenhum lançamento no período.</p>
          </ion-card-content>
        </ion-card>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonItem, IonSelect, IonSelectOption, IonSpinner,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  toastController, onIonViewWillEnter,
} from '@ionic/vue'
import VueApexCharts from 'vue3-apexcharts'
import SummaryCard from '../components/SummaryCard.vue'
import { useDashboard } from '../composables/useDashboard'
import type { Periodo } from '../composables/useDashboard'
import { useTema } from '../composables/useTema'
import { formatarValor } from '../utils/formatar'

const { escuro } = useTema()
const {
  carregando, carregar,
  totalReceitas, totalDespesas, saldo,
  quantidade, percentual,
  categorias, valoresCategorias, maiorCategoria,
  porMes,
} = useDashboard()

const periodo = ref<Periodo>('tudo')

async function atualizar() {
  try {
    await carregar(periodo.value)
  } catch {
    const toast = await toastController.create({
      message: 'Erro ao carregar o dashboard.',
      duration: 2500,
      color: 'danger',
    })
    await toast.present()
  }
}

onIonViewWillEnter(atualizar)
watch(periodo, atualizar)

const percentualTexto = computed(() =>
  percentual.value === null
    ? '—'
    : percentual.value.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'
)

// Opções comuns que acompanham o modo escuro
const base = computed(() => ({
  chart: {
    background: 'transparent',
    foreColor: escuro.value ? '#e0e0e0' : '#373d3f',
    toolbar: { show: false },
  },
  theme: { mode: escuro.value ? 'dark' : 'light' },
}))

const opcoesPizza = computed(() => ({
  ...base.value,
  labels: categorias.value,
  legend: { position: 'bottom' },
  tooltip: { y: { formatter: (v: number) => formatarValor(v) } },
}))

const seriesBarras = computed(() => [
  { name: 'Receitas', data: porMes.value.receitas },
  { name: 'Despesas', data: porMes.value.despesas },
])

const opcoesBarras = computed(() => ({
  ...base.value,
  colors: ['#2dd36f', '#eb445a'],
  plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: { categories: porMes.value.meses },
  yaxis: { labels: { formatter: (v: number) => 'R$ ' + Math.round(v) } },
  legend: { position: 'top' },
  tooltip: { y: { formatter: (v: number) => formatarValor(v) } },
}))
</script>

<style scoped>
.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.centro {
  display: flex;
  justify-content: center;
  padding: 32px;
}
.vazio {
  text-align: center;
  color: var(--ion-color-medium);
  padding: 24px 0;
}
</style>