import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  server: {
    proxy: { // for dev convenience. not using this improves performance locally
      '/api': {
        target: 'http://localhost:8000', // wherever your backend runs
        changeOrigin: true,
      },
    },
  },
})
