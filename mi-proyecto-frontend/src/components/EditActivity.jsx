import React, { useState } from 'react';
// Cambiamos la importación para usar nuestra instancia de Axios configurada
import axios from '../api/axiosInstance'; 

function EditActivity({ activity, projectId, onClose, onActivityUpdated }) {
    // Inicializamos los estados. Usar '' en lugar de null asegura que los campos de fecha funcionen correctamente.
    const [name, setName] = useState(activity.name);
    const [description, setDescription] = useState(activity.description || '');
    const [entregables, setEntregables] = useState(activity.entregables || '');
    const [startDate, setStartDate] = useState(activity.start_date || '');
    const [endDate, setEndDate] = useState(activity.end_date || '');
    const [status, setStatus] = useState(activity.status);
    
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpia cualquier error anterior
        
        const updatedActivityData = { 
            name, 
            description, 
            entregables, 
            start_date: startDate, 
            end_date: endDate,
            status: status
        };

        // NOTA: Ya no necesitamos el token ni los headers aquí,
        // porque axiosInstance lo añade automáticamente.
        const url = `projects/${projectId}/activities/${activity.id}/`; 
        
        try {
            // Usamos PUT para actualizar
            await axios.put(url, updatedActivityData); 
            
            // Si la actualización fue exitosa, refrescamos y cerramos
            onActivityUpdated(); 
        } catch (err) {
            // --- CÓDIGO ROBUSTO PARA CAPTURAR ERRORES DE DJANGO (400) ---
            if (err.response && err.response.data) {
                const apiErrors = err.response.data;
                let errorMessage = 'Error de Validación: ';
                
                // Iteramos sobre el objeto de errores de Django (ej. {'name': ['ya existe']})
                if (typeof apiErrors === 'string') {
                    errorMessage = apiErrors; // Captura errores de texto simple
                } else if (apiErrors.detail) {
                    errorMessage = apiErrors.detail; // Captura errores de detalle (como 403 Forbidden)
                } else {
                    for (const field in apiErrors) {
                        const errorArray = Array.isArray(apiErrors[field]) ? apiErrors[field] : [apiErrors[field]];
                        errorMessage += `${field.toUpperCase()}: ${errorArray[0]} `;
                    }
                }
                
                setError(errorMessage.trim());
            } else {
                setError('Error de Conexión: No se pudo contactar al servidor.');
            }
            console.error("Error al actualizar la actividad:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md mx-4">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Editando Actividad</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos de Nombre, Descripción y Entregables */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/90">Nombre</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/90">Descripción</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white/90">Entregables</label>
                        <textarea value={entregables} onChange={(e) => setEntregables(e.target.value)} rows="2" className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"></textarea>
                    </div>

                    {/* Selector de Estado */}
                    <div>
                        <label htmlFor="activity-status" className="block text-sm font-medium mb-1 dark:text-white/90">Estado</label>
                        <select
                            id="activity-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"
                        >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROGRESO">En Progreso</option>
                            <option value="COMPLETADA">Completada</option>
                        </select>
                    </div>

                    {/* Campos de Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white/90">Fecha de Inicio</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white/90">Fecha de Fin</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                    
                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Cancelar</button>
                        <button type="submit" className="bg-primary py-2 px-4 rounded-lg text-white font-bold">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditActivity;