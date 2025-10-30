import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Se necesita esta línea para que funcione el atajo

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ESTA ES LA NUEVA SECCIÓN ---
  // Crea un "atajo" o "alias" para que '@/' apunte siempre a la carpeta 'src/'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
