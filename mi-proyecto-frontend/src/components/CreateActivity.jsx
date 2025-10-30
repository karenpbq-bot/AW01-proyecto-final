import React, { useState } from 'react';

function CreateActivity({ projectId, onClose, onActivityCreated }) {
  // 1. Cambiamos el estado 'title' a 'name' para que coincida con el backend.
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [entregables, setEntregables] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !startDate || !endDate) {
      setError('Por favor, completa el nombre y las fechas.');
      return;
    }

    const token = localStorage.getItem('authToken');
    const url = `http://127.0.0.1:8000/api/projects/${projectId}/activities/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // 2. ¡LA CORRECCIÓN CLAVE! Enviamos 'name' en lugar de 'title'.
        //    También nos aseguramos de que el backend esté listo para recibir 'entregables'.
        body: JSON.stringify({
          name: name,
          description: description,
          entregables: entregables,
          start_date: startDate,
          end_date: endDate
        }),
      });

      if (response.ok) {
        onActivityCreated();
        onClose();
      } else {
        const data = await response.json();
        // Hacemos el mensaje de error más útil mostrando la respuesta del backend
        const errorMessages = Object.values(data).flat().join(' ');
        setError(errorMessages || 'Ocurrió un error al guardar la actividad.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-background-dark p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-6 text-white">Nueva Actividad</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="activity-name" className="block text-sm font-medium mb-2 text-white/90">Nombre de la actividad</label>
            <input
              id="activity-name"
              type="text"
              // 3. Actualizamos el valor y el onChange para usar 'name' y 'setName'.
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength="50"
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3"
            />
            <p className="text-right text-xs text-slate-400 mt-1">
              {name.length} / 50
            </p>
          </div>

          <div>
            <label htmlFor="activity-description" className="block text-sm font-medium mb-2 text-white/90">Descripción</label>
            <textarea
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              maxLength="200"
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3"
            ></textarea>
            <p className="text-right text-xs text-slate-400 mt-1">
              {description.length} / 200
            </p>
          </div>

          <div>
            <label htmlFor="activity-entregables" className="block text-sm font-medium mb-2 text-white/90">Entregables</label>
            <textarea
              id="activity-entregables"
              value={entregables}
              onChange={(e) => setEntregables(e.target.value)}
              rows="2"
              maxLength="50"
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3"
            ></textarea>
            <p className="text-right text-xs text-slate-400 mt-1">
              {entregables.length} / 50
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/90">Fecha de Inicio</label>
              <input
                type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white/90">Fecha de Fin</label>
              <input
                type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg text-white/70 hover:bg-slate-700">
              Cancelar
            </button>
            <button type="submit" className="bg-primary py-2 px-4 rounded-lg text-white font-bold hover:bg-primary/90">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;