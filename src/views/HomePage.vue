<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Início</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="alternarTema">
            <ion-icon slot="icon-only" :icon="escuro ? sunnyOutline : moonOutline" />
          </ion-button>
          <ion-button router-link="/logout">Sair</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Olá!</h2>
      <p v-if="user">Logada como {{ user.email }}</p>

      <ion-list>
        <ion-item button router-link="/dashboard">
          <ion-icon slot="start" :icon="pieChartOutline" />
          <ion-label>Dashboard</ion-label>
        </ion-item>
        <ion-item button router-link="/receitas">
          <ion-icon slot="start" :icon="trendingUpOutline" />
          <ion-label>Receitas</ion-label>
        </ion-item>
        <ion-item button router-link="/despesas">
          <ion-icon slot="start" :icon="trendingDownOutline" />
          <ion-label>Despesas</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon,
} from '@ionic/vue'
import {
  moonOutline, sunnyOutline, pieChartOutline, trendingUpOutline, trendingDownOutline,
} from 'ionicons/icons'
import { useAuth } from '../composables/useAuth'
import { useTema } from '../composables/useTema'

const { user } = useAuth()
const { escuro, alternarTema } = useTema()
</script>