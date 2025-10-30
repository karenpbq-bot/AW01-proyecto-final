import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- Sub-componente de Navegación de la Cabecera (Implementa la regla de diseño) ---
const FullPageHeader = ({ onLogout }) => {
    const navigate = useNavigate();
    
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
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Crear Nuevo Proyecto</h1>
            </div>
        </header>
    );
};


// --- COMPONENTE PRINCIPAL CreateProject ---
function CreateProject({ handleLogout }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!title || !startDate || !endDate) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const token = localStorage.getItem('authToken');
        
        try {
            await axios.post('http://127.0.0.1:8000/api/projects/', {
                title: title,
                description: description,
                start_date: startDate,
                end_date: endDate,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/projects'); // Redirigir a la lista de proyectos
        } catch (err) {
            console.error("Error creating project:", err);
            // Lógica para mostrar errores específicos de Django
            let errorMessage = 'Error al crear el proyecto. ';
            if (err.response && err.response.data) {
                const apiErrors = err.response.data;
                for (const field in apiErrors) {
                    errorMessage += `${field.toUpperCase()}: ${apiErrors[field][0]} `;
                }
            }
            setError(errorMessage);
        }
    };
    
    // Función de Logout que se pasa al Header
    const handleLogoutPage = () => {
        handleLogout(); 
    };


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* INCLUIMOS EL HEADER COMPLETO AQUÍ */}
            <FullPageHeader onLogout={handleLogoutPage} /> 
            
            <main className="p-4 md:p-6 max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl mt-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Detalles</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Nombre del Proyecto */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Nombre del Proyecto</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
                            className="w-full mt-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md" required />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Descripción</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                            className="w-full mt-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    </div>

                    {/* Fechas (CORREGIDO EL TEXTO DE LAS ETIQUETAS) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Fecha de Inicio Proyectada</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                                className="w-full mt-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Fecha de Fin Proyectada</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                                className="w-full mt-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md" required />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="py-2 px-4 rounded-lg bg-slate-400 dark:bg-slate-600 text-white">Cancelar</button>
                        <button type="submit" className="py-2 px-4 rounded-lg bg-primary text-white font-bold">Guardar Proyecto</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CreateProject;