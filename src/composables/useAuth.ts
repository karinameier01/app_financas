import type { Session, User } from '@supabase/supabase-js'
import { ref, readonly } from 'vue'

import { supabase } from '@/lib/supabase'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const carregando = ref(true)

let iniciado = false

// Chamado uma vez, antes do app montar (veja main.ts)
async function iniciarAuth() {
  if (iniciado) return
  iniciado = true

  const { data } = await supabase.auth.getSession()
  session.value = data.session
  user.value = data.session?.user ?? null
  carregando.value = false

  supabase.auth.onAuthStateChange((_evento, novaSessao) => {
    session.value = novaSessao
    user.value = novaSessao?.user ?? null
  })
}

async function login(email: string, senha: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
}

async function cadastrar(email: string, senha: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  })

  if (error) {
    console.error('Erro no cadastro:', error.message)
    throw error
  }

  console.log('Resultado do cadastro:', data)

  return data
}

async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAuth() {
  return {
    user: readonly(user),
    session: readonly(session),
    carregando: readonly(carregando),
    iniciarAuth,
    login,
    cadastrar,
    logout,
  }
}