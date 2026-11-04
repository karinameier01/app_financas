export type Tabela = 'receitas' | 'despesas'

export interface Lancamento {
  id: string
  descricao: string
  valor: number
  categoria: string
  data: string // formato YYYY-MM-DD
  user_id: string
}

export type NovoLancamento = Omit<Lancamento, 'id' | 'user_id'>

export const CATEGORIAS_RECEITA = ['Salário', 'Freelance', 'Investimentos', 'Outros']
export const CATEGORIAS_DESPESA = [
  'Alimentação', 'Transporte', 'Moradia', 'Educação', 'Lazer', 'Saúde', 'Outros'
]