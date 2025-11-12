import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from './api/axiosInstance';

// --- Componente: Project Card (se mantiene la lógica correcta) ---
function ProjectCard({ project }) {
    // Aseguramos valores por defecto si las fechas son nulas
    const startDate = project.start_date || 'N/A';
    const endDate = project.end_date || 'N/A';

    return (
        <Link 
            to={`/projects/${project.id}`} 
            className="block p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
        >
            {/* Título del PROYECTO */}
            <h3 className="font-bold text-xl mb-2 text-primary dark:text-sky-400">{project.title}</h3>
            
            {/* Fechas del PROYECTO */}
            <div className="text-xs text-slate-500 dark:text-slate-500">
                <p>Inicia: {startDate} | Termina: {endDate}</p>
            </div>
        </Link>
    );
}

// --- Componente Principal ProjectList (MODIFICADO) ---
function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/projects/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProjects(response.data.results || response.data || []); 

        } catch (err) {
            console.error("Error fetching projects:", err);
            setError('No se pudo cargar la lista de proyectos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [navigate]);

    if (loading) {
        return <div className="text-center p-10">Cargando proyectos...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 md:p-6">
            {/* --- CABECERA DE LA PÁGINA (SOLO BOTONES, TÍTULO LO PONE EL LAYOUT) --- */}
            <div className="flex justify-end items-center mb-6">
                
                {/* Se elimina el <h1> duplicado. El título "Mis Proyectos" lo pone el Layout. */}
                {/* Usamos un div invisible para forzar el espaciado si no hay otro elemento a la izquierda */}
                <div className="flex-1"></div> 

                <Link 
                    to="/users/create" 
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Usuario
                </Link>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} /> 
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg">
                    <h3 className="text-xl font-semibold">No tienes proyectos todavía</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Haz clic en "Nuevo Proyecto" para empezar.</p>
                </div>
            )}
        </div>
    );
}

export default ProjectList;