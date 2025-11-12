// mi-proyecto-frontend/src/Login.jsx

import React, { useState } from 'react';
// CORRECCIÓN FINAL: Importar la instancia de Axios con los Interceptores.
import axiosInstance from './api/axiosInstance'; 
import { useNavigate, Link } from 'react-router-dom'; 

// Usamos el path relativo al baseURL configurado en axiosInstance.js
const API_PATH = 'token/'; 

// El componente debe recibir onLoginSuccess para actualizar el estado en App.jsx
function Login({ onLoginSuccess }) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');

    if (!username || !password) {
        setError('Por favor, ingresa tu usuario y contraseña.');
        return;
    }

    try {
      // Usamos axiosInstance para la petición.
      const response = await axiosInstance.post(API_PATH, {
        username: username,
        password: password,
      });

      const token = response.data.access; 

      // PASO 1 CRÍTICO: Guardar el token en el Local Storage
      localStorage.setItem('authToken', token); 
      
      // PASO 2: Notificar a App.jsx (si existe)
      if (onLoginSuccess) {
        onLoginSuccess(token);
      }
      
      // PASO 3: SOLUCIÓN FINAL AL PROBLEMA DE SINCRONIZACIÓN
      // Forzar la recarga obliga al navegador a leer el Local Storage
      // antes de que App.jsx intente renderizar rutas protegidas.
      window.location.reload(); 

    } catch (err) {
      // Manejo de error de credenciales
      setError('Usuario o contraseña incorrectos. Verifique sus credenciales.'); 
      console.error("Login failed:", err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Usuario</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 mt-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Contraseña</label>
                    <div className="relative mt-1">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleTogglePassword}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400"
                            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            <span className="material-symbols-outlined">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                
                <button type="submit" className="w-full py-2 px-4 font-bold text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Entrar
                </button>
            </form>
        </div>
    </div>
  );
}

export default Login;