import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Ensure base path is correct for Firebase Hosting
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist', // Ensure output directory is 'dist' for Firebase Hosting
  },
});
