import { defineConfig } from 'vite';

import path from 'path';

import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';

import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls
      }
    }),
    jsx(),
    quasar({
      sassVariables: '@/quasar-variables.sass'
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
});
