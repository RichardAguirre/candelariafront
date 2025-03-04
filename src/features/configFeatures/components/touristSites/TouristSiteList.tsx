import React from 'react';
import { SitioTuristico } from './services/TouristSiteService';

interface TouristSiteListProps {
  sitios: SitioTuristico[];
  loading: boolean;
  onEdit: (sitio: SitioTuristico) => void;
  onInactivate: (turicodi: number) => void;
}

const TouristSiteList: React.FC<TouristSiteListProps> = ({ sitios, loading, onEdit, onInactivate }) => {
  if (sitios.length === 0 && !loading) {
    return <p className="text-gray-500 text-center py-4">No hay sitios turísticos registrados</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sitios.map((sitio) => (
            <tr key={sitio.turicodi} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-black whitespace-nowrap">{sitio.turinomb}</td>
              <td className="px-6 py-4 text-black truncate max-w-xs">{sitio.turidire}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">{sitio.ubiccodi.ubicnomb}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sitio.turiesta === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {sitio.turiesta === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => onEdit(sitio)} 
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Está seguro de que desea inactivar este sitio turístico?')) {
                      onInactivate(sitio.turicodi);
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

export default TouristSiteList;