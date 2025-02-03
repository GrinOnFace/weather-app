import { defineConfig } from 'vite';

export default defineConfig({
  base: '/weather-app/',
  server: {
    port: 3000,
    open: true
  }
}); 