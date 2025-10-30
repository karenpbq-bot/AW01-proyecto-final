import React from 'react';
import { Link } from 'react-router-dom';

// Componente reutilizable para cada botón del menú
const MenuItem = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-4 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
    <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
    <div>
      <p className="font-bold">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </Link>
);

function Home() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <MenuItem 
          to="/projects" 
          icon="business_center" 
          title="Ver mis proyectos" 
          description="Revisa todos tus proyectos asignados" 
        />
        <MenuItem 
          to="/create" 
          icon="add_circle" 
          title="Crear un nuevo proyecto" 
          description="Inicia un proyecto desde cero" 
        />
        <MenuItem 
          to="/dashboard" 
          icon="monitoring" 
          title="Ver el dashboard" 
          description="Obtén un resumen de tus métricas" 
        />
        {/* --- ENLACE CORREGIDO AQUÍ --- */}
        <MenuItem 
          to="/users" 
          icon="person" 
          title="Administrar mis datos" 
          description="Consulta la lista de usuarios del sistema" 
        />
        <MenuItem 
          to="/help" 
          icon="help" 
          title="Pedir ayuda" 
          description="Contacta a soporte o lee la documentación" 
        />
      </div>
    </div>
  );
}

export default Home;