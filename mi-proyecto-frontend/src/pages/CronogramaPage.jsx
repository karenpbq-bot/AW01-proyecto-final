import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cronograma from '../Cronograma'; 

// --- Sub-componente: Cabecera Unificada (Necesario para que aparezca la barra) ---
const FullPageHeader = ({ projectTitle, handleLogout }) => {
    const navigate = useNavigate();
    
    const handleLogoutAndRedirect = () => {
        handleLogout();
    };

    return (
        <header className="flex flex-col p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-30">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    {/* Botón Volver */}
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Volver">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    {/* Botón Home */}
                    <Link to="/" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Inicio">
                        <span className="material-symbols-outlined text-primary dark:text-sky-400">home</span>
                    </Link>
                </div>
                {/* Botón Logout */}
                <button onClick={handleLogoutAndRedirect} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Cerrar Sesión">
                    <span className="material-symbols-outlined text-red-500">logout</span>
                </button>
            </div>
            <div className="text-center mt-2">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cronograma: {projectTitle}</h1>
            </div>
        </header>
    );
};

// --- COMPONENTE PRINCIPAL CRONOGRAMA ---
function CronogramaPage({ handleLogout }) {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) { navigate('/login'); return; }

        try {
            const projectResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/`, { headers: { 'Authorization': `Bearer ${token}` } });
            const activitiesResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/activities/`, { headers: { 'Authorization': `Bearer ${token}` } });

            // Combinar los datos del proyecto con sus actividades
            const fullProjectData = {
                ...projectResponse.data,
                activities: activitiesResponse.data 
            };

            setProject(projectResponse.data);
            setActivities(activitiesResponse.data);

        } catch (err) {
            console.error("Error al cargar los datos del cronograma:", err);
            setError('No se pudo cargar el cronograma. Revisa la consola para detalles.');
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) { return <div className="flex justify-center items-center h-screen">Cargando cronograma...</div>; }
    if (error) { return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>; }

    // Objeto consolidado que se pasa al componente Cronograma para el dibujo
    const projectDataWithActivities = {
        ...project,
        activities: activities 
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
            {/* Solo llamamos a la cabecera UNA vez */}
            <FullPageHeader 
                projectTitle={project ? project.title : 'Cargando...'} 
                handleLogout={handleLogout}
            /> 
            
            <main className="p-4 md:p-6 max-w-6xl mx-auto">
                {/* --- Renderizamos solo el componente Cronograma que contiene TODO el gráfico --- */}
                {project && <Cronograma project={projectDataWithActivities} />}
            </main>
        </div>
    );
}

export default CronogramaPage;