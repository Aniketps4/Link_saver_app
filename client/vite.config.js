
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Explicitly set the root to the client directory
  build: {
    outDir: 'dist', // Output directory for build
    rollupOptions: {
      input: './index.html', // Explicitly specify the entry point
    },
  },
});