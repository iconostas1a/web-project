import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'public/spa-redirect.html'),
          resolve(__dirname, 'dist/404.html')
        )
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
  },
  base: process.env.NODE_ENV === 'production' ? '/web-project/' : '/',
})
