// mi-proyecto-frontend/src/tailwind.config.js

module.exports = {
  content: [
    // --- RUTA CORREGIDA: Sale de 'src' para buscar index.html en la raíz (..) ---
    // Esto asegura que Tailwind escanee el index.html y los archivos en src.
    "../index.html",
    "./**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos dentro de la propia carpeta src/
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
      }
    },
  },
  // --- SAFELIST: VITAL PARA LOS COLORES DEL CRONOGRAMA ---
  safelist: [
    'bg-green-600',
    'bg-yellow-500',
    'bg-blue-500',
    'border-red-500',
    'bg-slate-700',
    'bg-slate-800'
  ],
  plugins: [],
}