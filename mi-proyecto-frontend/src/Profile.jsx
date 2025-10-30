import React, { useState, useEffect } from 'react';

function Profile({ onSessionExpired }) {
  const [userData, setUserData] = useState({ username: '', email: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) return onSessionExpired();
        if (!response.ok) throw new Error('No se pudieron cargar los datos.');

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, [onSessionExpired]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/me/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      if (response.status === 401) return onSessionExpired();
      if (!response.ok) throw new Error('Error al actualizar. Revisa los datos.');

      setSuccess('¡Perfil actualizado con éxito!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-slate-500 mb-2" htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} className="w-full p-2 border rounded bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" required />
            </div>
            <div className="mb-4">
              <label className="block text-slate-500 mb-2" htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} className="w-full p-2 border rounded bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" required />
            </div>
            <div className="mb-4">
              <label className="block text-slate-500 mb-2" htmlFor="first_name">Nombre</label>
              <input type="text" id="first_name" name="first_name" value={userData.first_name} onChange={handleChange} className="w-full p-2 border rounded bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
            </div>
            <div className="mb-4">
              <label className="block text-slate-500 mb-2" htmlFor="last_name">Apellido</label>
              <input type="text" id="last_name" name="last_name" value={userData.last_name} onChange={handleChange} className="w-full p-2 border rounded bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
            </div>
          </div>

          {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg my-4 text-sm">{error}</p>}
          {success && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-lg my-4 text-sm">{success}</p>}

          <div className="flex items-center justify-end mt-6">
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">
              Actualizar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;