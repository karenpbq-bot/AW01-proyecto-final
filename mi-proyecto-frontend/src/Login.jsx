import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Dejamos useNavigate por si lo necesitas en el futuro, pero no lo usaremos aquí.
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, ingresa tu usuario y contraseña.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password,
            });

            const token = response.data.access;
            
            // 1. Llama a la función de App.jsx para guardar el token.
            onLoginSuccess(token);
            
            // 2. ¡CRUCIAL! ELIMINAMOS 'navigate("/")'
            // Dejamos que App.jsx renderice el Layout automáticamente.

        } catch (err) {
            setError('Usuario o contraseña incorrectos.');
            console.error("Error en el login:", err);
        }
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
                                onClick={() => setShowPassword(!showPassword)}
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