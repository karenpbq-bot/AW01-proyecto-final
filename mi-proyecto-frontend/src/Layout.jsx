import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';

// Componente para los iconos de navegación del footer
const NavItem = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <NavLink to={to} className={`flex flex-col items-center p-2 text-xs rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'text-primary bg-slate-300 dark:bg-slate-800' 
                : 'text-slate-600 dark:text-slate-400 hover:text-primary'
        }`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="mt-0.5">{label}</span>
        </NavLink>
    );
};

// --- Componente de Cabecera (Implementa la Regla de Diseño Final) ---
function Header({ handleLogout: parentHandleLogout }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Función que se llama al hacer clic en el botón de Logout
    const handleLogoutAndRedirect = () => {
        parentHandleLogout(); // 1. Llama a la función de App.jsx para borrar el token
        // 2. Usamos window.location.href para asegurar la redirección forzada (necesaria por el hook useAuth)
        window.location.href = '/login'; 
    };

    // Lógica para el título dinámico
    let title = 'Página Principal'; 
    if (location.pathname === '/projects') {
        title = 'Mis Proyectos';
    } else if (location.pathname === '/dashboard') {
        title = 'Dashboard';
    } else if (location.pathname.startsWith('/projects/')) { 
        title = 'Detalle del Proyecto';
    } else if (location.pathname.startsWith('/users')) { 
        title = 'Usuarios';
    }

    return (
        <header className="flex flex-col p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-30">
            <div className="flex justify-between items-center w-full">
                
                {/* --- GRUPO IZQUIERDO: VOLVER y HOME (REQUERIDO EN TODAS LAS PANTALLAS) --- */}
                <div className="flex items-center gap-2">
                    
                    {/* 1. BOTÓN VOLVER (Siempre visible en Header) */}
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Volver"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>

                    {/* 2. BOTÓN HOME (Siempre visible en Header) */}
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Inicio"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-sky-400">home</span>
                    </button>
                </div>
                
                {/* 3. Botón de Logout (Derecha, Siempre visible) */}
                <button
                    onClick={handleLogoutAndRedirect} 
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Cerrar Sesión"
                >
                    <span className="material-symbols-outlined text-red-500">logout</span>
                </button>
            </div>

            {/* Título de la página */}
            <div className="text-center mt-2">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
            </div>
        </header>
    );
}

// El componente Layout principal
function Layout({ handleLogout }) {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display flex flex-col h-screen text-slate-800 dark:text-white">
            <Header handleLogout={handleLogout} /> 

            <main className="flex-1 overflow-y-auto">
                <Outlet /> {/* Aquí se renderiza la página activa */}
            </main>

            {/* --- FOOTER: Mantiene la navegación esencial --- */}
            <footer className="sticky bottom-0 bg-slate-200/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-300 dark:border-slate-700">
                <nav className="flex justify-around p-2">
                    <NavItem to="/" icon="home" label="Inicio" /> 
                    <NavItem to="/projects" icon="business_center" label="Proyectos" />
                    <NavItem to="/dashboard" icon="monitoring" label="Dashboard" />
                </nav>
            </footer>
        </div>
    );
}

export default Layout;