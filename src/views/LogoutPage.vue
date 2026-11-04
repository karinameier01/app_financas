<template>
  <ion-page>
    <ion-content class="ion-padding centro">
      <div class="ion-text-center">
        <ion-spinner name="crescent" />
        <p>A terminar sessão...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonSpinner } from '@ionic/vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

onMounted(async () => {
  try {
    await logout()
  } catch (err) {
    console.error('Erro ao terminar sessão:', err)
  } finally {
    router.replace('/login')
  }
})
</script>

<style scoped>
.centro {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>