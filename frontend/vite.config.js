import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { // for dev convenience. not using this improves performance locally
      '/api': {
        target: 'http://localhost:8000', // wherever your backend runs
        changeOrigin: true,
      },
    },
  },
})
