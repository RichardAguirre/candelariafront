import React from "react";
import { Hotel } from "./services/HotelService";

interface HotelListProps {
  hoteles: Hotel[];
  loading: boolean;
  onEdit: (hotel: Hotel) => void;
  onToggleStatus: (hotecodi: number, activate: boolean) => void;
}

const HotelList: React.FC<HotelListProps> = ({
  hoteles,
  loading,
  onEdit,
  onToggleStatus,
}) => {
  if (!loading && hoteles.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No hay hoteles registrados
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {hoteles.map((hotel) => (
            <tr key={hotel.hotecodi} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-black whitespace-nowrap">{hotel.hotenomb}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">{hotel.hotedesc}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">{hotel.ubiccodi?.ubicnomb}</td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    hotel.hoteesta === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {hotel.hoteesta === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                <button
                  onClick={() => onEdit(hotel)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onToggleStatus(hotel.hotecodi, hotel.hoteesta !== 1)}
                  className={`${
                    hotel.hoteesta === 1
                      ? "text-red-600 hover:text-red-800"
                      : "text-green-600 hover:text-green-800"
                  }`}
                >
                  {hotel.hoteesta === 1 ? "Inactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelList;