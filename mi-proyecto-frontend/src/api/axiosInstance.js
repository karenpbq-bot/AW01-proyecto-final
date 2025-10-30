// mi-proyecto-frontend/src/api/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
    // Definimos la URL base para simplificar futuras peticiones
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

// --- Interceptor de Respuestas (Manejo del 401 Expirado) ---
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Si el token expira o es inválido, redirige al login
        if (error.response && error.response.status === 401 && !error.config.url.includes('token')) {
            console.error("Token expirado o no autorizado. Redirigiendo a Login.");
            localStorage.removeItem('authToken');
            // Forzamos la redirección ya que no podemos usar useNavigate aquí
            window.location.href = '/login'; 
            return new Promise(() => {}); 
        }
        return Promise.reject(error); 
    }
);

export default axiosInstance;