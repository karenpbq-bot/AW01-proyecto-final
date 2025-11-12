// mi-proyecto-frontend/src/api/axiosInstance.js

import axios from 'axios'; // <-- CORRECCIÓN: Importa la librería base 'axios' directamente

const axiosInstance = axios.create({
    // URL base de tu API Django
    baseURL: 'http://127.0.0.1:8000/api/', 
    timeout: 5000, 
});

// --- Interceptor de Peticiones: Añade el token Bearer automáticamente ---
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        // Asegura que el token se añade a la cabecera 'Authorization' si existe
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// --- Interceptor de Respuestas: Manejo del 401 (CRÍTICO) ---
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Chequea si el error es 401 (Unauthorized) y que NO estemos en la ruta de token
        if (error.response && error.response.status === 401 && !error.config.url.includes('token')) {
            
            console.error("Token expirado o no autorizado. Redirigiendo a Login.");
            
            // Acción: Borrar token corrupto y forzar la redirección
            localStorage.removeItem('authToken');
            window.location.href = '/login'; 
            
            // Rechazamos la promesa para evitar que el error siga a los componentes
            return new Promise(() => {}); 
        }
        return Promise.reject(error); 
    }
);

export default axiosInstance;