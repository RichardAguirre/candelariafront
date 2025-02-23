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
  estado: number | null;
  perfil?: string;
  username?: string;
}

export const UserManagement = () => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/api/v1/usuario/consultaAllUsuario');
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error("La respuesta está vacía");
      }

      const data: User[] = JSON.parse(text);

      const usersWithAccess = await Promise.all(
        data.map(async (user) => {
          try {
            const accessResponse = await fetch('/api/api/v1/acceso/datosAcceso', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ documento: user.documento }),
            });

            if (!accessResponse.ok) {
              console.warn(`Error al obtener acceso para el usuario ${user.documento}`);
              return { ...user, perfil: 'Desconocido', username: 'N/A' };
            }

            const accessText = await accessResponse.text();
            if (!accessText) {
              return { ...user, perfil: 'Desconocido', username: 'N/A' };
            }

            const accessData = JSON.parse(accessText);
            return { ...user, perfil: accessData.perfil, username: accessData.username };
          } catch (error) {
            console.error(`Error procesando usuario ${user.documento}:`, error);
            return { ...user, perfil: 'Desconocido', username: 'N/A' };
          }
        })
      );

      setUsers(usersWithAccess);
    } catch (error) {
      console.error(error);
      alert('Error al cargar usuarios');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100 text-black">
      <form onSubmit={handleSubmit(() => navigate('/register'))} className="space-y-4 text-center w-full max-w-sm">
        <Button type="submit" className="py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Crear Usuario
        </Button>
      </form>
      <hr className="my-4" />
      {users.length > 0 && (
        <div className="overflow-x-auto mt-6 w-full max-w-4xl">
          <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg text-center text-black">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th>Documento</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Celular</th>
                <th>Fecha Creación</th>
                <th>Estado</th>
                <th>Perfil</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.documento} className="hover:bg-gray-200">
                  <td>{user.documento}</td>
                  <td>{`${user.nombreuno} ${user.nombredos} ${user.apellidouno} ${user.apellidodos}`}</td>
                  <td>{user.email}</td>
                  <td>{user.celular}</td>
                  <td>{user.fechasys}</td>
                  <td className={user.estado === 1 ? 'text-green-500' : 'text-red-500'}>{user.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                  <td>{user.perfil}</td>
                  <td>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};