/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/rsvp_viewer',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/rsvp': {
        target: 'http://localhost:3000/rsvp',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/rsvp/, ''),
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
 
  build: {
    outDir: '../../dist/apps/rsvp_viewer',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
