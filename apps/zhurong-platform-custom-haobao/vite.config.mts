import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {
      archiverPluginOptions: {
        name: 'html',
        outputDir: '.',
      },
    },
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://lantekha:9000/',
            ws: true,
          },
        },
      },
    },
  };
});
