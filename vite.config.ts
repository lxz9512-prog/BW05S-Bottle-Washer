import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client',
  base: './',
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, 'client'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  define: { 'process.env.CLIENT_BASE_PATH': JSON.stringify(''), 'process.env': '{}' },
  build: { outDir: '../dist', emptyOutDir: true },
  server: { port: 5173, host: '127.0.0.1' },
});
