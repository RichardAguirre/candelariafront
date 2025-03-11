import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import EventForm from "./ActivityForm";
import EventList from "./ActivityList";
import {
  Actividad,
  ActividadFormData,
  fetchActividades,
  fetchEventos,
  fetchUbicaciones,
  createActividad,
  updateActividad,
  cambiarEstadoActividad,
  Evento,
  Ubicacion,
} from "./services/ActivityService";
import ActivityReport from "./ActivityReport";

const EventManager: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(
    null
  );
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [showReport, setShowReport] = useState(false);

  const formMethods = useForm<ActividadFormData>();
  const { reset } = formMethods;

  const loadActividades = async () => {
    try {
      setLoading(true);
      const actividadesData = await fetchActividades(null);
      setActividades(actividadesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar actividades"
      );
      console.error("Error al cargar actividades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [eventosData, ubicacionesData] = await Promise.all([
          fetchEventos(),
          fetchUbicaciones(),
        ]);

        setEventos(eventosData);
        setUbicaciones(ubicacionesData);

        await loadActividades();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar datos iniciales"
        );
        console.error("Error al cargar datos iniciales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCreateSubmit = async (data: ActividadFormData) => {
    try {
      setLoading(true);
      setError(null);

      await createActividad(data, imageUrls);
      setSuccess("Actividad creada con éxito");

      setMode("list");
      reset();
      setImageUrls([""]);

      await loadActividades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear actividad");
      console.error("Error al crear actividad:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);

    const imageUrlsList = actividad.actiimag
      ? actividad.actiimag.split(",")
      : [""];
    setImageUrls(imageUrlsList);

    reset({
      actinomb: actividad.actinomb,
      actidesc: actividad.actidesc,
      evencodiValue: actividad.evencodi.evencodi,
      ubiccodiValue: actividad.ubiccodi.ubiccodi,
      actifein: actividad.actifein.slice(0, 16),
      actifefi: actividad.actifefi.slice(0, 16),
      actiface: actividad.actiface,
      actiurlx: actividad.actiurlx,
      actiinst: actividad.actiinst,
    });

    setMode("edit");
  };

  const handleEditSubmit = async (data: ActividadFormData) => {
    try {
      if (!selectedActividad) return;

      setLoading(true);
      setError(null);

      await updateActividad(data, selectedActividad, imageUrls);
      setSuccess("Actividad actualizada con éxito");

      setMode("list");
      setSelectedActividad(null);
      reset();
      setImageUrls([""]);

      await loadActividades();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar actividad"
      );
      console.error("Error al actualizar actividad:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivityStatus = async (
    acticodi: number,
    activate: boolean
  ) => {
    try {
      const action = activate ? "activar" : "inactivar";
      if (!confirm(`¿Estás seguro de que deseas ${action} esta actividad?`)) {
        return;
      }

      setLoading(true);
      setError(null);

      await cambiarEstadoActividad(acticodi, activate ? 1 : 0);
      setSuccess(`Actividad ${action}ada con éxito`);

      await loadActividades();
    } catch (err) {
      const action = activate ? "activar" : "inactivar";
      setError(
        err instanceof Error ? err.message : `Error al ${action} la actividad`
      );
      console.error(`Error al ${action} actividad:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleUpdateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length <= 1) return;
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const handleCancel = () => {
    setMode("list");
    setSelectedActividad(null);
    setImageUrls([""]);
    reset();
  };

  const dismissAlert = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 relative">
            <p>{success}</p>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-green-700 font-bold"
              onClick={dismissAlert}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 relative">
            <p>{error}</p>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-red-700 font-bold"
              onClick={dismissAlert}
            >
              ✕
            </button>
          </div>
        )}

        {mode === "list" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-black">
                Eventos y Actividades
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowReport(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Generar Reporte
                </button>
                <button
                  onClick={() => {
                    setMode("create");
                    formMethods.reset({});
                    setImageUrls([""]);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  + Nueva Actividad
                </button>
              </div>
            </div>

            <EventList
              actividades={actividades}
              loading={loading}
              onEdit={handleEdit}
              onToggleStatus={handleToggleActivityStatus}
            />
          </>
        )}

        {mode === "create" && (
          <EventForm
            formMethods={formMethods}
            mode="create"
            eventos={eventos}
            ubicaciones={ubicaciones}
            imageUrls={imageUrls}
            onSubmit={handleCreateSubmit}
            onAddImageUrlField={handleAddImageUrlField}
            onUpdateImageUrl={handleUpdateImageUrl}
            onRemoveImageUrl={handleRemoveImageUrl}
            onCancel={handleCancel}
            loading={loading}
          />
        )}

        {mode === "edit" && selectedActividad && (
          <EventForm
            formMethods={formMethods}
            mode="edit"
            eventos={eventos}
            ubicaciones={ubicaciones}
            imageUrls={imageUrls}
            onSubmit={handleEditSubmit}
            onAddImageUrlField={handleAddImageUrlField}
            onUpdateImageUrl={handleUpdateImageUrl}
            onRemoveImageUrl={handleRemoveImageUrl}
            onCancel={handleCancel}
            loading={loading}
          />
        )}
      </div>

      {showReport && (
        <ActivityReport 
          actividades={actividades} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
};

export default EventManager;