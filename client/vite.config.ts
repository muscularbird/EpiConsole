import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  console.log(`Vite mode: ${mode}`);
  return (defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
    host: "0.0.0.0",
    port: process.env.HOST_PORT ? parseInt(process.env.HOST_PORT) : 3000,
  },
  }))
})
