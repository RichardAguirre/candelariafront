import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

interface User {
  documento: number;
  nombreuno: string;
  nombredos: string;
  apellidouno: string;
  apellidodos: string;
  email: string;
  celular: number;
  fechasys: string;
  fechanac: string;
  estado: number | null;
  perfil?: string;
  username?: string;
}

export const UserManagement = () => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const { register: registerEditUser, handleSubmit: handleSubmitEditUser, reset } = useForm<User>();
  const { register: registerCredentials, handleSubmit: handleSubmitCredentials, reset: resetCredentials } = useForm<{
    username?: string;
    password: string;
  }>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/api/v1/usuario/consultaAllUsuario');
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data: User[] = await response.json();
      const usersWithAccess = await Promise.all(
        data.map(async (user) => {
          try {
            const accessResponse = await fetch('/api/api/v1/acceso/datosAcceso', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ documento: user.documento }),
            });
            
            const accessData = accessResponse.ok ? await accessResponse.json() : {};
            return { ...user, perfil: accessData.perfil || 'N/A', username: accessData.username || 'N/A' };
          } catch (error) {
            return { ...user, perfil: 'N/A', username: 'N/A' };
          }
        })
      );
      setUsers(usersWithAccess);
    } catch (error) {
      console.error(error);
      alert('Error cargando usuarios');
    }
  };

  const handleEditUser = async (data: User) => {
    try {
      const response = await fetch('/api/api/v1/usuario/modificarUsuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          documento: selectedUser?.documento,
        }),
      });
      
      if (!response.ok) throw new Error('Error actualizando usuario');
      await fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert('Error actualizando usuario');
    }
  };

  const handleEditCredentials = async (data: { username?: string; password: string }) => {
    try {
      const response = await fetch('/api/api/v1/acceso/modificaAcceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documento: { documento: selectedUser?.documento },
          username: data.username,
          password: data.password,
        }),
      });
      
      if (!response.ok) throw new Error('Error actualizando credenciales');
      await fetchUsers();
      setShowCredentialsModal(false);
    } catch (error) {
      console.error(error);
      alert('Error actualizando credenciales');
    }
  };

  const toggleUserStatus = async (user: User) => {
    const isActive = user.estado === 1;
    const confirmation = window.confirm(
      `¿Estás seguro de ${isActive ? 'desactivar' : 'activar'} este usuario?`
    );

    if (confirmation) {
      try {
        const url = isActive ? '/api/api/v1/acceso/eliminarAcceso' : '/api/api/v1/usuario/activarUsuario';
        const body = isActive
          ? JSON.stringify({ documento: { documento: user.documento }, username: user.username })
          : JSON.stringify({ documento: user.documento });

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        if (!response.ok) throw new Error(`Error ${isActive ? 'desactivando' : 'activando'} usuario`);
        await fetchUsers();
      } catch (error) {
        console.error(error);
        alert(`Error ${isActive ? 'desactivando' : 'activando'} usuario`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 text-black">
      <form onSubmit={handleSubmit(() => navigate('/register'))} className="text-center">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Crear Usuario
        </Button>
      </form>

      <div className="mt-8 w-full max-w-6xl overflow-x-auto">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">Documento</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Fecha Creación</th>
              <th>Estado</th>
              <th>Perfil</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.documento} className="hover:bg-gray-50 border-t">
                <td className="p-3">{user.documento}</td>
                <td>{`${user.nombreuno} ${user.nombredos} ${user.apellidouno} ${user.apellidodos}`}</td>
                <td>{user.email}</td>
                <td>{user.celular}</td>
                <td>{user.fechasys}</td>
                <td className={user.estado === 1 ? 'text-green-500' : 'text-red-500'}>
                  {user.estado === 1 ? 'Activo' : 'Inactivo'}
                </td>
                <td>{user.perfil}</td>
                <td>{user.username}</td>
                <td>
                  <div className="flex space-x-2 justify-center">
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => {
                        setSelectedUser(user);
                        reset(user);
                        setShowEditModal(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => {
                        setSelectedUser(user);
                        resetCredentials({ username: user.username, password: '' });
                        setShowCredentialsModal(true);
                      }}
                    >
                      Credenciales
                    </Button>
                    <Button
                      className={user.estado === 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                      onClick={() => toggleUserStatus(user)}
                    >
                      {user.estado === 1 ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Editar Usuario</h2>
            <form onSubmit={handleSubmitEditUser(handleEditUser)}>
              <div className="space-y-4">
                <input {...registerEditUser('nombreuno')} placeholder="Primer nombre" className={inputFieldStyle} />
                <input {...registerEditUser('nombredos')} placeholder="Segundo nombre" className={inputFieldStyle} />
                <input {...registerEditUser('apellidouno')} placeholder="Primer apellido" className={inputFieldStyle} />
                <input {...registerEditUser('apellidodos')} placeholder="Segundo apellido" className={inputFieldStyle} />
                <input {...registerEditUser('email')} type="email" placeholder="Email" className={inputFieldStyle} />
                <input {...registerEditUser('celular')} type="number" placeholder="Celular" className={inputFieldStyle} />
                <input {...registerEditUser('fechanac')} type="date" className={inputFieldStyle} />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button type="button" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-500">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCredentialsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Editar Credenciales</h2>
            <form onSubmit={handleSubmitCredentials(handleEditCredentials)}>
              <div className="space-y-4">
                <input {...registerCredentials('username')} placeholder="Usuario" className={inputFieldStyle} />
                <input
                  {...registerCredentials('password')}
                  type="password"
                  placeholder="Nueva contraseña"
                  className={inputFieldStyle}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button type="button" onClick={() => setShowCredentialsModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-500">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputFieldStyle = "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";