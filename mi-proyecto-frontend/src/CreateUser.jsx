import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || !email || !firstName || !lastName) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName
        })
      });

      if (response.ok) {
        setSuccess('¡Usuario creado con éxito!');
        setTimeout(() => navigate('/users'), 1500); // Redirige a la lista después de 1.5s
      } else {
        const data = await response.json();
        // Une los errores en un solo mensaje
        const errorMessages = Object.values(data).flat().join(' ');
        setError(errorMessages || 'Ocurrió un error al crear el usuario.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="bg-background-dark font-display flex flex-col h-screen text-white">
      <header className="flex items-center justify-between p-4 border-b border-slate-700">
        <Link to="/users" className="p-2 rounded-full hover:bg-slate-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold">Crear Nuevo Usuario</h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Nombre de Usuario (username)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-4 py-3"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-4 py-3"
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-4 py-3"
          />
          <input
            type="text"
            placeholder="Nombres"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-4 py-3"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-slate-800 rounded-lg px-4 py-3"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary py-3 rounded-lg text-white font-bold hover:bg-primary/90"
            >
              Guardar Usuario
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateUser;