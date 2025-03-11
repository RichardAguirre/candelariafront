import React from "react";
import { Actividad } from "./services/ActivityService";

interface EventListProps {
  actividades: Actividad[];
  loading: boolean;
  onEdit: (actividad: Actividad) => void;
  onToggleStatus: (acticodi: number, activate: boolean) => void;
}

const EventList: React.FC<EventListProps> = ({
  actividades,
  loading,
  onEdit,
  onToggleStatus,
}) => {
  if (actividades.length === 0 && !loading) {
    return (
      <p className="text-gray-500 text-center py-4">
        No hay eventos y actividades registrados
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo de evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {actividades.map((actividad) => (
            <tr key={actividad.acticodi} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-black whitespace-nowrap">
                {actividad.actinomb}
              </td>
              <td className="px-6 py-4 text-black truncate max-w-xs">
                {actividad.actidesc}
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                {actividad.evencodi.evennomb}
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                {actividad.ubiccodi.ubicnomb}
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    actividad.actiesta === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {actividad.actiesta === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <button
                  onClick={() => onEdit(actividad)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onToggleStatus(actividad.acticodi, actividad.actiesta !== 1)}
                  className={`${
                    actividad.actiesta === 1
                      ? "text-red-600 hover:text-red-800"
                      : "text-green-600 hover:text-green-800"
                  }`}
                >
                  {actividad.actiesta === 1 ? "Inactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;