import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Ensure base path is correct for Firebase Hosting
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      src: 'src/service-worker.ts',
      registerType: 'prompt',
    }),
  ],
  build: {
    outDir: 'dist', // Ensure output directory is 'dist' for Firebase Hosting
  },
});
