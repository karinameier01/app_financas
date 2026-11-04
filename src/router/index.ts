import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useAuth } from '../composables/useAuth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    component: () => import('../views/LoginPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/cadastro',
    component: () => import('../views/CadastrarUsuarioPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/logout',
    component: () => import('../views/LogoutPage.vue'),
  },
  {
    path: '/receitas',
    component: () => import('../views/CadastrarReceitasPage.vue'),
  },
  {
    path: '/despesas',
    component: () => import('../views/CadastrarDespesasPage.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashboardFinanceiroPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const { user } = useAuth();
  const logado = !!user.value;

  if (!to.meta.publica && !logado) return '/login';
  if (to.meta.publica && logado) return '/home';
});

export default router;