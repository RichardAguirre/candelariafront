import React, { useState, useEffect } from "react";
import HotelsComponent from "./components/HotelsComponent";

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

interface HotelResponse {
  hotecodi: number;
  hotenomb: string;
  hotedesc: string;
  ubiccodi: Ubicacion;
  hoteesta: number;
  estado: string;
}

interface HotelData {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
}

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/api/v1/hotel/consultaHotelByEstado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hoteesta: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Error al obtener hoteles: ${response.status}`);
      }

      const data: HotelResponse[] = await response.json();
      const transformed: HotelData[] = data.map((hotel) => ({
        id: hotel.hotecodi,
        nombre: hotel.hotenomb,
        descripcion: hotel.hotedesc,
        ubicacion: hotel.ubiccodi?.ubicnomb || "Sin ubicación",
      }));

      setHotels(transformed);
    } catch (err) {
      console.error("Error al cargar hoteles:", err);
      setError(err instanceof Error ? err.message : "Error al cargar hoteles");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-24 p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Hoteles en Candelaria
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && hotels.length === 0 && (
        <div className="text-white">No hay hoteles disponibles.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isLoading && !error && hotels.length > 0 &&
          hotels.map((hotel) => (
            <HotelsComponent
              key={hotel.id}
              nombre={hotel.nombre}
              descripcion={hotel.descripcion}
              ubicacion={hotel.ubicacion}
            />
          ))
        }
      </div>
    </div>
  );
};

export default HotelsPage;