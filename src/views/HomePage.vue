<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Início</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/logout">Sair</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Olá!</h2>
      <p v-if="user">Logada como {{ user.email }}</p>

      <ion-list>
        <ion-item button router-link="/receitas">
          <ion-label>Receitas</ion-label>
        </ion-item>
                <ion-item button router-link="/despesas">
          <ion-label>Despesas</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonLabel,
} from '@ionic/vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
</script>