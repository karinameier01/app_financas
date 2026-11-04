import { computed, ref } from 'vue'

import { supabase } from '../lib/supabase'
import type { Lancamento, Tabela } from '../types'

export type Periodo = 'tudo' | 'mes' | '3meses' | 'ano'

function paraISO(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Devolve a data inicial do período escolhido (ou null para "tudo")
function inicioDoPeriodo(periodo: Periodo): string | null {
  const hoje = new Date()
  if (periodo === 'tudo') return null
  if (periodo === 'mes') return paraISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1))
  if (periodo === '3meses') return paraISO(new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1))
  return paraISO(new Date(hoje.getFullYear(), 0, 1))
}

async function buscar(tabela: Tabela, inicio: string | null): Promise<Lancamento[]> {
  let consulta = supabase.from(tabela).select('*')
  if (inicio) consulta = consulta.gte('data', inicio)
  const { data, error } = await consulta
  if (error) throw error
  return data as Lancamento[]
}

const somar = (lista: Lancamento[]) => lista.reduce((t, i) => t + Number(i.valor), 0)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useDashboard() {
  const receitas = ref<Lancamento[]>([])
  const despesas = ref<Lancamento[]>([])
  const carregando = ref(false)

  async function carregar(periodo: Periodo) {
    carregando.value = true
    try {
      const inicio = inicioDoPeriodo(periodo)
      const [r, d] = await Promise.all([
        buscar('receitas', inicio),
        buscar('despesas', inicio),
      ])
      receitas.value = r
      despesas.value = d
    } finally {
      carregando.value = false
    }
  }

  // Cards resumo
  const totalReceitas = computed(() => somar(receitas.value))
  const totalDespesas = computed(() => somar(despesas.value))
  const saldo = computed(() => totalReceitas.value - totalDespesas.value)

  // Indicadores
  const quantidade = computed(() => receitas.value.length + despesas.value.length)
  const percentual = computed(() =>
    totalReceitas.value > 0 ? (totalDespesas.value / totalReceitas.value) * 100 : null
  )

  // Despesas por categoria (ordenadas da maior para a menor)
  const despesasPorCategoria = computed(() => {
    const mapa: Record<string, number> = {}
    for (const d of despesas.value) {
      mapa[d.categoria] = (mapa[d.categoria] ?? 0) + Number(d.valor)
    }
    return Object.entries(mapa).sort((a, b) => b[1] - a[1])
  })
  const categorias = computed(() => despesasPorCategoria.value.map(([nome]) => nome))
  const valoresCategorias = computed(() => despesasPorCategoria.value.map(([, valor]) => valor))
  const maiorCategoria = computed(() => {
    const primeira = despesasPorCategoria.value[0]
    return primeira ? { nome: primeira[0], valor: primeira[1] } : null
  })

  // Receitas e despesas agrupadas por mês
  const porMes = computed(() => {
    const mapa: Record<string, { receitas: number; despesas: number }> = {}
    const garantir = (chave: string) => {
      if (!mapa[chave]) mapa[chave] = { receitas: 0, despesas: 0 }
      return mapa[chave]
    }
    for (const r of receitas.value) garantir(r.data.slice(0, 7)).receitas += Number(r.valor)
    for (const d of despesas.value) garantir(d.data.slice(0, 7)).despesas += Number(d.valor)

    const chaves = Object.keys(mapa).sort()
    return {
      meses: chaves.map((k) => {
        const [ano, mes] = k.split('-')
        return `${mes}/${ano}`
      }),
      receitas: chaves.map((k) => mapa[k].receitas),
      despesas: chaves.map((k) => mapa[k].despesas),
    }
  })

  return {
    carregando, carregar,
    totalReceitas, totalDespesas, saldo,
    quantidade, percentual,
    categorias, valoresCategorias, maiorCategoria,
    porMes,
  }
}