import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest : {
        icons : [ {
          src : "src\assets\brand.svg",
          sizes : "512x512",
          type :  "image/svg+xml",
          purpose : "any maskable"
        }]
      }
    })
  ],
})
