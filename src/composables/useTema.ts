import { readonly, ref } from 'vue'

const escuro = ref(false)

function aplicar() {
  document.documentElement.classList.toggle('ion-palette-dark', escuro.value)
}

// Lê a preferência salva; se não houver, segue o tema do aparelho
function iniciarTema() {
  let salvo: string | null = null
  try {
    salvo = localStorage.getItem('tema')
  } catch {
    // sem acesso ao armazenamento: segue o tema do sistema
  }
  escuro.value = salvo
    ? salvo === 'escuro'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
  aplicar()
}

function alternarTema() {
  escuro.value = !escuro.value
  aplicar()
  try {
    localStorage.setItem('tema', escuro.value ? 'escuro' : 'claro')
  } catch {
    // ignora
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useTema() {
  return { escuro: readonly(escuro), iniciarTema, alternarTema }
}