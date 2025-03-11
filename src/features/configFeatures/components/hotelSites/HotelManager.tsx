import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import HotelList from "./HotelList";
import HotelForm from "./HotelForm";
import {
  Hotel,
  HotelFormData,
  fetchHoteles,
  createHotel,
  updateHotel,
  cambiarEstadoHotel,
} from "./services/HotelService";

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

const HotelManager: React.FC = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const formMethods = useForm<HotelFormData>();

  useEffect(() => {
    loadHoteles();
    loadUbicaciones();
  }, []);

  const loadHoteles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHoteles(null);
      setHoteles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar hoteles"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUbicaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/api/v1/ubicacion/consultaAllUbicacion");
      if (!response.ok) {
        throw new Error(`Error al cargar ubicaciones: ${response.status}`);
      }
      const data = await response.json();
      setUbicaciones(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar ubicaciones"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: HotelFormData) => {
    try {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        await createHotel(data);
        setSuccess("Hotel creado con éxito");
      } else if (selectedHotel) {
        await updateHotel(data, selectedHotel);
        setSuccess("Hotel actualizado con éxito");
        setSelectedHotel(null);
      }
      setMode("list");
      formMethods.reset();
      loadHoteles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el hotel"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    formMethods.reset({
      hotenomb: hotel.hotenomb,
      hotedesc: hotel.hotedesc,
      ubiccodiValue: hotel.ubiccodi?.ubiccodi || 0,
    });
    setMode("edit");
  };

  const handleToggleStatus = async (hotecodi: number, activate: boolean) => {
    try {
      const action = activate ? "activar" : "inactivar";
      if (!confirm(`¿Deseas ${action} este hotel?`)) {
        return;
      }
      setLoading(true);
      setError(null);
      await cambiarEstadoHotel(hotecodi, activate ? 1 : 0);
      setSuccess(`Hotel ${action}ado con éxito`);
      loadHoteles();
    } catch (err) {
      const action = activate ? "activar" : "inactivar";
      setError(
        err instanceof Error ? err.message : `Error al ${action} el hotel`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 relative">
            <p>{success}</p>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 font-bold"
              onClick={() => setSuccess(null)}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 relative">
            <p>{error}</p>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 font-bold"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {mode === "list" && (
          <>
            <div className="flex justify-between text-black items-center mb-4">
              <h2 className="text-2xl font-semibold">Hoteles</h2>
              <button
                onClick={() => {
                  setMode("create");
                  formMethods.reset({});
                  setSelectedHotel(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                + Nuevo Hotel
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <HotelList
                hoteles={hoteles}
                loading={loading}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </>
        )}

        {mode !== "list" && (
          <HotelForm
            formMethods={formMethods}
            mode={mode}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setMode("list");
              setSelectedHotel(null);
              formMethods.reset();
            }}
            loading={loading}
            Ubicaciones={ubicaciones}
          />
        )}
      </div>
    </div>
  );
};

export default HotelManager;