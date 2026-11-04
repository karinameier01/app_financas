<template>
  <ion-list v-if="itens.length">
    <ion-item v-for="item in itens" :key="item.id">
      <ion-label>
        <h2>{{ item.descricao }}</h2>
        <p>{{ item.categoria }} · {{ formatarData(item.data) }}</p>
      </ion-label>

      <ion-note slot="end" :color="cor">{{ formatarValor(item.valor) }}</ion-note>

      <ion-button slot="end" fill="clear" @click="emit('editar', item)">
        <ion-icon slot="icon-only" :icon="createOutline" />
      </ion-button>
      <ion-button slot="end" fill="clear" color="danger" @click="emit('excluir', item)">
        <ion-icon slot="icon-only" :icon="trashOutline" />
      </ion-button>
    </ion-item>
  </ion-list>

  <p v-else class="vazio">{{ vazio }}</p>
</template>

<script setup lang="ts">
import { IonList, IonItem, IonLabel, IonNote, IonButton, IonIcon } from '@ionic/vue'
import { createOutline, trashOutline } from 'ionicons/icons'
import type { Lancamento } from '@/types'
import { formatarData, formatarValor } from '@/utils/formatar'

defineProps<{
  itens: Lancamento[]
  cor: 'success' | 'danger'
  vazio: string
}>()

const emit = defineEmits<{
  (e: 'editar', item: Lancamento): void
  (e: 'excluir', item: Lancamento): void
}>()
</script>

<style scoped>
.vazio {
  text-align: center;
  color: var(--ion-color-medium);
  padding: 32px 16px;
}
</style>