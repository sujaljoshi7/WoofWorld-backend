import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      host: true, // Exposes the server
      port: 3000, // Change to another port
    },
})
