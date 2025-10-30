import React from 'react';

// --- Función de Ayuda 1: Para parsear las fechas ---
const parseDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12); 
};

// --- Función de Ayuda 2: Para calcular la diferencia de días ---
const diffDays = (date1, date2) => {
    if (!date1 || !date2) return 0;
    const oneDay = 1000 * 60 * 60 * 24;
    
    const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    const diffTime = normalizedDate2.getTime() - normalizedDate1.getTime();
    
    return Math.round(diffTime / oneDay);
};

// --- Función de Ayuda 3: Para obtener el valor Hex del color (Diferenciación de Estados) ---
const getActivityColorHex = (status) => {
    switch (status) {
        case 'COMPLETADA':
            return '#10B981'; // Verde Oscuro
        case 'EN_PROGRESO':
            return '#F5C242'; // AMARILLO/DORADO
        case 'PENDIENTE':
            return '#F97316'; // Naranja Fuerte
        default:
            return '#6b7280'; // Gris
    }
};

// Función para formatear fechas a string para la UI
const formatDate = (date) => date.toISOString().split('T')[0];

function Cronograma({ project }) {
    // 1. Filtramos actividades sin fechas válidas (CRUCIAL)
    const validActivities = project.activities.filter(a => a.start_date && a.end_date);

    // Validación de seguridad para la carga inicial
    if (!project || !project.start_date || !project.end_date || validActivities.length === 0) {
        return (
            <div className="text-center text-red-500 py-10">
                <p>Error: El proyecto no tiene fechas (Inicio/Fin) o no hay actividades válidas para el cronograma.</p>
            </div>
        );
    }

    // 2. CÁLCULO DINÁMICO DEL RANGO DE FECHAS DEL PROYECTO
    let projectStartDate = null;
    let projectEndDate = null;
    let parsedActivities = [];

    // Encontramos las fechas mínimas y máximas de todas las actividades
    validActivities.forEach(activity => {
        const start = parseDate(activity.start_date);
        const end = parseDate(activity.end_date);

        if (start && end) {
            parsedActivities.push({ ...activity, parsedStart: start, parsedEnd: end });

            if (!projectStartDate || start.getTime() < projectStartDate.getTime()) {
                projectStartDate = start;
            }
            if (!projectEndDate || end.getTime() > projectEndDate.getTime()) {
                projectEndDate = end;
            }
        }
    });
    
    if (!projectStartDate || !projectEndDate) {
        return <div className="text-center text-red-500 py-10">Error: No se pudieron calcular las fechas del proyecto a partir de las actividades.</div>;
    }

    const totalProjectDuration = diffDays(projectStartDate, projectEndDate) + 1; 

    if (totalProjectDuration <= 0 || isNaN(totalProjectDuration)) {
        return <div className="text-center text-red-500 py-10">Error: La duración total del proyecto es inválida o cero.</div>;
    }

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Cronograma del Proyecto</h3>
            
            <div className="space-y-4 min-w-[700px]">
                {/* --- Mapeamos cada actividad para crear una fila --- */}
                {parsedActivities.map(activity => {
                    // CÁLCULOS
                    let offsetDays = diffDays(projectStartDate, activity.parsedStart); 
                    let activityDuration = diffDays(activity.parsedStart, activity.parsedEnd) + 1; 

                    // Clipping (Recorte)
                    if (offsetDays < 0) {
                        activityDuration += offsetDays; 
                        offsetDays = 0; 
                    }
                    if (activityDuration <= 0) {
                        if (activityDuration < 0) return null;
                        activityDuration = 1; 
                    }

                    const daysAfterProjectStart = diffDays(projectStartDate, activity.parsedEnd) + 1;
                    activityDuration = Math.min(activityDuration, daysAfterProjectStart - offsetDays);


                    // CÁLCULO FINAL DE PORCENTAJES
                    const leftPercentage = (offsetDays / totalProjectDuration) * 100;
                    const widthPercentage = (activityDuration / totalProjectDuration) * 100;
                    
                    const colorHex = getActivityColorHex(activity.status);
                    
                    const isPotentiallyCritical = activity.status !== 'COMPLETADA'; 
                    const criticalClass = isPotentiallyCritical ? 'border-2 border-red-500 shadow-xl' : '';

                    // Filtro de seguridad
                    if (widthPercentage < 0.1 || leftPercentage >= 100) return null; 

                    return (
                        <div key={activity.id} className="flex items-start gap-4"> 
                            
                            {/* --- COLUMNA 1: ETIQUETA Y FECHAS (25% del ancho) --- */}
                            <div className="w-1/4 pr-4 flex-shrink-0">
                                <div className="text-sm font-medium truncate text-slate-800 dark:text-slate-200" title={activity.name}>
                                    {activity.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {activity.start_date} al {activity.end_date}
                                </div>
                            </div>
                            
                            {/* --- COLUMNA 2: BARRA (75% del ancho total) --- */}
                            <div className="w-3/4 bg-slate-300 dark:bg-slate-700 rounded-full h-6 relative flex-shrink-0">
                                <div
                                    // Z-index y Altura forzada para visibilidad
                                    className={`absolute top-0 z-20 h-6 rounded-full ${criticalClass}`}
                                    style={{
                                        height: '24px', 
                                        backgroundColor: colorHex, 
                                        left: `${leftPercentage}%`,
                                        width: `${widthPercentage}%`,
                                    }}
                                    title={`${activity.name} (${activity.status})`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda de fechas del proyecto */}
            <div className="flex justify-between text-xs text-slate-500 mt-4 border-t pt-2">
                <span>**Inicio:** {formatDate(projectStartDate)}</span>
                <span>**Fin:** {formatDate(projectEndDate)}</span>
            </div>
            
            {/* Leyenda de colores de la Ruta Crítica (Texto Final) */}
            <div className="text-xs mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600">
                <span className="font-bold block mb-1 text-slate-800 dark:text-white">Leyenda de Estados:</span>
                
                <div className="grid grid-cols-2 gap-y-1">
                    {/* Fila 1: Pendiente (Naranja) */}
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full border-2 border-red-500" style={{backgroundColor: '#F97316'}} ></span>
                        <span className="ml-2 font-semibold text-orange-600">Pendiente: naranja</span>
                    </div>
                    {/* Fila 2: En Progreso (Amarillo) */}
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full border-2 border-red-500" style={{backgroundColor: '#F5C242'}} ></span>
                        <span className="ml-2 font-semibold text-yellow-600">En Progreso: amarillo</span>
                    </div>
                    {/* Fila 3: Completada (Verde) */}
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full" style={{backgroundColor: '#10B981'}} ></span>
                        <span className="ml-2 text-green-600">Completada: verde</span>
                    </div>
                </div>

                <p className="mt-3 text-slate-700 dark:text-slate-300">
                    *El borde **rojo** indica que la actividad **PERTENECE A LA RUTA CRITICA** y requiere especial atención.
                </p>
            </div>
        </div>
    );
}

export default Cronograma;