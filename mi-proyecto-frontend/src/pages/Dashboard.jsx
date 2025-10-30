import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StatCard({ title, value, icon, colorClass = 'text-primary' }) {
    return (
        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className={`bg-opacity-20 p-3 rounded-full ${colorClass.replace('text-', 'bg-')}`}>
                <span className={`material-symbols-outlined text-3xl ${colorClass}`}>
                    {icon}
                </span>
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                // La URL no cambia, sigue siendo la misma
                const response = await axios.get('http://127.0.0.1:8000/api/projects/dashboard/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                setError('No se pudieron cargar los datos del dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <p className="text-center p-10">Cargando dashboard...</p>;
    if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats && (
                    <>
                        {/* Tarjeta de Proyectos (sin cambios) */}
                        <StatCard 
                            title="Total de Proyectos" 
                            value={stats.total_projects} 
                            icon="business_center"
                        />

                        {/* --- ¡NUEVAS TARJETAS AQUÍ! --- */}
                        <StatCard 
                            title="Total de Actividades" 
                            value={stats.total_activities} 
                            icon="checklist"
                        />
                        
                        <StatCard 
                            title="Actividades Pendientes" 
                            value={stats.pending_activities} 
                            icon="pending_actions"
                            colorClass="text-yellow-500" // Le damos un color diferente
                        />
                        
                        <StatCard 
                            title="Actividades Completadas" 
                            value={stats.completed_activities} 
                            icon="task_alt"
                            colorClass="text-green-500" // Y a esta también
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;