import { build } from 'vite';

const entries = [
  {
    entry: 'src/home/index.ts',
    name: 'home',
    fileName: 'home',
  },
  {
    entry: 'src/routing/index.ts',
    name: 'routing',
    fileName: 'routing',
  },
];

entries.forEach(async (entry) => {
  await build({
    configFile: false,
    sourcemap: true,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      lib: entry,
      assetsDir: '',
      emptyOutDir: false,
      rollupOptions: {
      },
    },
  });
});
