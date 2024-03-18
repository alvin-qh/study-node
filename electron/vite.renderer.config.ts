import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { pluginExposeRenderer } from './vite.base.config';

/**
 * @type {import('vite').UserConfig}
 *
 * https://vitejs.dev/config
 */
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [
      pluginExposeRenderer(name),
      vue({
        template: {
          transformAssetUrls
        }
      }),
      jsx(),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      }),
      eslint({
        include: [
          'src/**/*.ts',
          'src/**/*.vue'
        ]
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    clearScreen: false,
  } as UserConfig;
});
