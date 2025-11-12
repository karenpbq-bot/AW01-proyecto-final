import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './Login';
import Layout from './Layout';
import Home from './Home';
import Dashboard from './pages/Dashboard';
import ProjectList from './ProjectList';
import CreateProject from './CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import UserList from './UserList';
import CreateUser from './CreateUser';
import CronogramaPage from './pages/CronogramaPage'; 
import './index.css';

// --- CORRECCIÓN CLAVE: NO HAY IMPORTACIÓN DE AXIOS AQUÍ ---

function useAuth() {
    const [token, setToken] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    // Esta función es llamada por Login.jsx para guardar el token
    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        window.location.href = '/login'; 
    };

    return { token, isLoading, handleLoginSuccess, handleLogout };
}

function App() {
    const { token, isLoading, handleLoginSuccess, handleLogout } = useAuth();

    // Bloquea la renderización mientras se verifica el token para evitar parpadeos
    if (isLoading) {
        return null; 
    }

    return (
        <BrowserRouter>
            <Routes>
                {token ? (
                    // --- RUTAS PROTEGIDAS (USUARIO LOGUEADO) ---
                    <>
                        <Route element={<Layout handleLogout={handleLogout} />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<ProjectList />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<div>Página de Perfil</div>} />
                            <Route path="/help" element={<div>Página de Ayuda</div>} />
                            <Route path="/users" element={<UserList />} />
                            <Route path="/login" element={<Navigate to="/" replace />} /> 
                        </Route>

                        {/* --- RUTAS DE PÁGINA COMPLETA --- */}
                        <Route path="/create" element={<CreateProject />} />
                        <Route path="/projects/:projectId" element={<ProjectDetail handleLogout={handleLogout} />} />
                        <Route path="/users/create" element={<CreateUser handleLogout={handleLogout} />} /> 
                        <Route path="/projects/:projectId/cronograma" element={<CronogramaPage handleLogout={handleLogout} />} /> 
                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                ) : (
                    // --- Rutas NO PROTEGIDAS (USUARIO SIN LOGUEAR) ---
                    <>
                        {/* El Login llama a onLoginSuccess después de guardar y antes de recargar */}
                        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;