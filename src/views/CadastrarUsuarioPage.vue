<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/login" />
        </ion-buttons>
        <ion-title>Criar Conta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding centro">
      <div class="container">
        <h2>Cadastrar-se</h2>
        <p class="sub">Preencha os dados para criar sua conta</p>

        <form @submit.prevent="cadastrar">
          <ion-item>
            <ion-input
              v-model="email"
              type="email"
              label="E-mail"
              label-placement="floating"
              required
            />
          </ion-item>

          <ion-item>
            <ion-input
              v-model="senha"
              type="password"
              label="Senha (mínimo 6 caracteres)"
              label-placement="floating"
              required
            />
          </ion-item>

          <ion-button expand="block" type="submit" class="ion-margin-top" :disabled="carregando">
            {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  toastController,
} from '@ionic/vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { cadastrar: cadastrarUsuario } = useAuth()

const email = ref('')
const senha = ref('')
const carregando = ref(false)

async function cadastrar() {
  if (senha.value.length < 6) {
    const toast = await toastController.create({
      message: 'A senha precisa ter pelo menos 6 caracteres.',
      duration: 3000,
      color: 'warning',
    })
    await toast.present()
    return
  }

  carregando.value = true
  try {
    await cadastrarUsuario(email.value, senha.value)
    const toast = await toastController.create({
      message: 'Conta criada com sucesso! Faça login.',
      duration: 3000,
      color: 'success',
    })
    await toast.present()
    router.replace('/login')
  } catch (err: any) {
    const toast = await toastController.create({
      message: err.message || 'Erro ao cadastrar. Tente novamente.',
      duration: 3000,
      color: 'danger',
    })
    await toast.present()
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.centro {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: 100%;
  max-width: 360px;
}
h2 {
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
}
.sub {
  text-align: center;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}
</style>