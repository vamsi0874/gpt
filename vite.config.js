import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
  proxy: {
    '/api':
    'https://gpt-back-w58g.onrender.com',
  }
},
  plugins: [
    react()
    ],
})
