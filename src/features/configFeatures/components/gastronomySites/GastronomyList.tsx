import React from "react";
import { Gastronomia } from "./services/GastronomyService";

interface GastronomyListProps {
  gastronomias: Gastronomia[];
  loading: boolean;
  onEdit: (gastronomia: Gastronomia) => void;
  onInactivate: (gastcodi: number) => void;
}

const GastronomyList: React.FC<GastronomyListProps> = ({
  gastronomias,
  loading,
  onEdit,
  onInactivate,
}) => {
  if (gastronomias.length === 0 && !loading) {
    return <p className="text-gray-500 text-center py-4">No hay gastronomías registradas</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {gastronomias.map((gastronomia) => (
            <tr key={gastronomia.gastcodi} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-black whitespace-nowrap">{gastronomia.gastnomb}</td>
              <td className="px-6 py-4 text-black truncate max-w-xs">{gastronomia.gastdesc}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    gastronomia.gastesta === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {gastronomia.gastesta === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => onEdit(gastronomia)} 
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Está seguro de que desea inactivar esta gastronomía?')) {
                      onInactivate(gastronomia.gastcodi);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Inactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GastronomyList;