import React from "react";
import { User } from "./services/UserManagementService";

interface UserManagementListProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserManagementList: React.FC<UserManagementListProps> = ({
  users,
  loading,
  onEdit,
  onToggleStatus,
}) => {
  if (users.length === 0 && !loading) {
    return (
      <p className="text-gray-500 text-center py-4">
        No hay usuarios registrados
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
{/*             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Celular
            </th> */}
{/*             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perfil
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={9} className="px-6 py-4">
                <div className="flex justify-center my-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.documento} className="hover:bg-gray-50">
{/*                 <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.documento}
                </td> */}
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.nombreuno} {user.nombredos} {user.apellidouno}{" "}
                  {user.apellidodos}
                </td>
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.email}
                </td>
                {/* <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.celular}
                </td> */}
{/*                 <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.fechasys}
                </td> */}
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.estado === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.estado === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.perfil}
                </td>
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => onEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className={
                      user.estado === 1
                        ? "text-red-600 hover:text-red-900"
                        : "text-green-600 hover:text-green-900"
                    }
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Está seguro de que desea ${
                            user.estado === 1 ? "desactivar" : "activar"
                          } este usuario?`
                        )
                      ) {
                        onToggleStatus(user);
                      }
                    }}
                  >
                    {user.estado === 1 ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementList;
