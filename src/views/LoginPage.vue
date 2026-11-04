<template>
  <ion-page>
    <ion-content class="ion-padding centro">
      <div class="container">
        <h2>Controle Financeiro</h2>
        <p class="sub">Faça login para continuar</p>

        <form @submit.prevent="entrar">
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
              label="Senha"
              label-placement="floating"
              required
            />
          </ion-item>

          <ion-button expand="block" type="submit" class="ion-margin-top" :disabled="carregando">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </ion-button>
        </form>

        <p class="registro ion-text-center ion-margin-top">
          Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  toastController,
} from '@ionic/vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const senha = ref('')
const carregando = ref(false)

async function entrar() {
  carregando.value = true
  try {
    await login(email.value, senha.value)
    router.replace('/home')
  } catch (err: any) {
    const toast = await toastController.create({
      message: err.message || 'Erro ao fazer login. Verifique seus dados.',
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
.registro {
  font-size: 14px;
}
</style>