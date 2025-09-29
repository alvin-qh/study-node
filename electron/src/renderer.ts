/* eslint-disable import/no-unresolved */
import '@/main.scss';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import 'quasar/src/css/index.sass';

import { Quasar } from 'quasar';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from '@/App.vue';
import QuasarConfig from '@/quasar-conf';
import { routes } from '@/routes';

const router = createRouter({
  history: createWebHistory(),
  routes
});

createApp(App).use(router).use(Quasar, QuasarConfig).mount('#app');
