import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- NUEVO COMPONENTE: EditUserForm (CORREGIDO) ---
function EditUserForm({ user, onUserUpdated, onCancel }) {
    const [username, setUsername] = useState(user.username);
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [error, setError] = useState('');
    
    // NOTA: No incluimos el campo de contraseña aquí, ya que el serializador la hace opcional.

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpia cualquier error anterior
        const token = localStorage.getItem('authToken');
        
        // Datos a enviar (solo los que están en el formulario)
        const updatedData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            await axios.put(`http://127.0.0.1:8000/api/users/${user.id}/`, updatedData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onUserUpdated(); // Éxito: refresca la lista
        } catch (err) {
            // --- CÓDIGO MEJORADO PARA CAPTURAR ERRORES DE VALIDACIÓN ---
            if (err.response && err.response.data) {
                const apiErrors = err.response.data;
                let errorMessage = 'Error de Validación: ';
                
                // Itera sobre los errores de Django (ej. {'username': ['ya existe']})
                for (const field in apiErrors) {
                    // Muestra el nombre del campo (en mayúsculas) y el mensaje de error
                    errorMessage += `${field.toUpperCase()}: ${apiErrors[field][0]} `;
                }
                
                setError(errorMessage.trim());
            } else {
                // Muestra el mensaje genérico si no hay detalles de la API
                setError('Error al actualizar. El servidor no respondió o la conexión falló.');
            }
            console.error("Error al actualizar:", err);
        }
    };

    return (
        <div className="bg-slate-300 dark:bg-slate-700 p-4 rounded-lg border-2 border-primary">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white/90">Usuario</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-600 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white/90">Nombre</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-600 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white/90">Apellido</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-200 dark:bg-slate-600 rounded-lg px-3 py-2 text-slate-800 dark:text-white"/>
                </div>
                {error && <p className="text-red-600 text-sm font-bold mt-2">{error}</p>} 
                
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onCancel} className="py-2 px-4 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600">Cancelar</button>
                    <button type="submit" className="bg-primary py-2 px-4 rounded-lg text-white font-bold">Guardar</button>
                </div>
            </form>
        </div>
    );
}


// --- Sub-componente: UserCard (sin cambios) ---
function UserCard({ user, onEdit }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="font-bold text-slate-800 dark:text-white">{user.username}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.first_name || 'Sin nombre'}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(user)} title="Editar usuario" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <span className="material-symbols-outlined text-slate-400" title={user.is_superuser ? 'Superusuario' : 'Usuario estándar'}>
                    {user.is_superuser ? 'verified_user' : 'person'}
                </span>
            </div>
        </div>
    );
}

// --- Componente Principal (UserList) (sin cambios) ---
function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        if (!loading) setLoading(true); 
        const token = localStorage.getItem('authToken');
        if (!token) { navigate('/login'); return; }
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data.results || response.data || []);
        } catch (err) {
            setError('No se pudo cargar la lista de usuarios.');
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="text-center p-10">Cargando usuarios...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Usuarios</h1>
                <Link to="/users/create" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Usuario
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id}>
                        {editingUser && editingUser.id === user.id ? (
                            <EditUserForm
                                user={editingUser}
                                onUserUpdated={() => {
                                    setEditingUser(null);
                                    fetchUsers();
                                }}
                                onCancel={() => setEditingUser(null)}
                            />
                        ) : (
                            <UserCard 
                                user={user} 
                                onEdit={setEditingUser}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserList;