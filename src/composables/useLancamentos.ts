import { ref } from 'vue'

import { supabase } from '@/lib/supabase'
import type { Lancamento, NovoLancamento, Tabela } from '@/types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLancamentos(tabela: Tabela) {
  const itens = ref<Lancamento[]>([])
  const carregando = ref(false)

  async function listar() {
    carregando.value = true
    try {
      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .order('data', { ascending: false })
      if (error) throw error
      itens.value = data as Lancamento[]
    } finally {
      carregando.value = false
    }
  }

  async function inserir(lancamento: NovoLancamento) {
    const { error } = await supabase.from(tabela).insert(lancamento)
    if (error) throw error
    await listar()
  }

  async function atualizar(id: string, lancamento: NovoLancamento) {
    const { error } = await supabase.from(tabela).update(lancamento).eq('id', id)
    if (error) throw error
    await listar()
  }

  async function excluir(id: string) {
    const { error } = await supabase.from(tabela).delete().eq('id', id)
    if (error) throw error
    await listar()
  }

  return { itens, carregando, listar, inserir, atualizar, excluir }
}