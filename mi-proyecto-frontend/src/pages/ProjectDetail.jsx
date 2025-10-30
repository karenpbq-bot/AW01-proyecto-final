import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Importa tus componentes de formulario (asegúrate de que las rutas sean correctas)
import CreateActivity from '../components/CreateActivity';
import EditActivity from '../components/EditActivity';

// --- Sub-componente: Cabecera Unificada ---
function ProjectDetailHeader({ projectTitle, onLogout }) {
    const navigate = useNavigate();
    
    // Asumimos que onLogout en App.jsx ya usa window.location.href = '/login'
    const handleLogoutAndRedirect = () => {
        onLogout(); 
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
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{projectTitle}</h1>
            </div>
        </header>
    );
}

// --- Sub-componente: Tarjeta de Actividad (Se mantiene) ---
function ActivityCard({ activity, onEdit, onDelete }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETADA': return 'bg-green-500';
            case 'EN_PROGRESO': return 'bg-yellow-500';
            default: return 'bg-slate-500';
        }
    };
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-md text-slate-800 dark:text-white">{activity.name}</h3>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => onEdit(activity)} title="Editar actividad" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                        <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button onClick={() => onDelete(activity.id)} title="Eliminar actividad" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                        <span className="material-symbols-outlined text-base text-red-500">delete</span>
                    </button>
                </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{activity.description}</p>
            <div className="text-xs mt-4">
                <p><strong>Entregables:</strong> {activity.entregables || 'N/A'}</p>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                    <p>Inicio: {activity.start_date}</p>
                    <p>Fin: {activity.end_date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${getStatusClass(activity.status)}`}>
                    {activity.status}
                </span>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingActivityId, setEditingActivityId] = useState(null);
    
    // Función de Logout que llama a la función principal de App.jsx
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        // Redirección manejada por el Header al llamar a onLogout prop.
    };

    const fetchData = useCallback(async () => {
        // ... (Tu lógica de fetch se mantiene igual)
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const projectUrl = `http://127.0.0.1:8000/api/projects/${projectId}/`;
            const activitiesUrl = `http://127.0.0.1:8000/api/projects/${projectId}/activities/`;
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [projectResponse, activitiesResponse] = await Promise.all([
                axios.get(projectUrl, config),
                axios.get(activitiesUrl, config)
            ]);
            
            setProject(projectResponse.data);
            setActivities(activitiesResponse.data);

        } catch (err) {
            console.error("Error al cargar los datos:", err);
            setError('No se pudo cargar la información. Revisa la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) return;
        
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}/activities/${activityId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData(); // Vuelve a cargar todos los datos
        } catch (err) {
            alert('Error al eliminar la actividad.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
            {/* Cabecera, con los 3 botones */}
            {project && <ProjectDetailHeader projectTitle={project.title} onLogout={handleLogout} />}
            
            <main className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Botón Gantt */}
                {project && (
                    <div className="mb-6 flex justify-end">
                        <Link 
                            to={`/projects/${projectId}/cronograma`}
                            className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">timeline</span>
                            Ver Cronograma
                        </Link>
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Actividades</h2>
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Añadir
                    </button>
                </div>

                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map(activity => (
                            <div key={activity.id}>
                                {editingActivityId === activity.id ? (
                                    <EditActivity
                                        activity={activity}
                                        projectId={projectId}
                                        onClose={() => setEditingActivityId(null)}
                                        onActivityUpdated={() => {
                                            setEditingActivityId(null);
                                            fetchData();
                                        }}
                                    />
                                ) : (
                                    <ActivityCard 
                                        activity={activity} 
                                        onEdit={() => setEditingActivityId(activity.id)} 
                                        onDelete={handleDeleteActivity}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg">
                            <p className="text-slate-600 dark:text-slate-300">Este proyecto no tiene actividades.</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">¡Añade la primera!</p>
                        </div>
                    )}
                </div>
            </main>

            {isCreating && (
                <CreateActivity 
                    projectId={projectId}
                    onClose={() => setIsCreating(false)}
                    onActivityCreated={() => {
                        setIsCreating(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

export default ProjectDetails;