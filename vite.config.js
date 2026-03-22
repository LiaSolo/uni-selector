import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '/src/scss/globals' as *;`,
      }
    }
  },
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:3003', 
        changeOrigin: true,              
        secure: false,
        ws: true,                         
      },
      '/ws': {
          target: 'ws://localhost:3003',
          ws: true,
          changeOrigin: true,
        },
    },
  },
  preview: {
      host: true,
      port: 4173,
      allowedHosts: [
        'localhost',
        'pupupu.loca.lt',
        '.loca.lt' 
      ],
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/ws': {
          target: 'ws://localhost:3003',
          ws: true,
          changeOrigin: true,
        },
      }
    }

})
