import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 5173,
    https: true,
    host: '127.0.0.1', // Force IPv4
    strictPort: true   // Don't try other ports if 5173 is taken
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})