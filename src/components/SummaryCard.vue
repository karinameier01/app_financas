<template>
  <ion-card class="resumo">
    <ion-card-content>
      <small>{{ titulo }}</small>
      <h2 :style="{ color: cor ? `var(--ion-color-${cor})` : undefined }">{{ valor }}</h2>
      <small v-if="detalhe">{{ detalhe }}</small>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent } from '@ionic/vue'

defineProps<{
  titulo: string
  valor: string
  cor?: 'success' | 'danger' | 'primary'
  detalhe?: string
}>()
</script>

<style scoped>
.resumo {
  margin: 0;
}
h2 {
  margin: 4px 0;
  font-weight: 700;
}
</style>