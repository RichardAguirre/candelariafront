import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Actividad,
  ActividadFormData,
  fetchActividades,
  fetchEventos,
  fetchUbicaciones,
  createActividad,
  updateActividad,
  inactivateActividad,
  Evento,
  Ubicacion
} from "./services/ActivityService";
import EventList from "./ActivityList";
import EventForm from "./ActivityForm";

const EventManager: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ActividadFormData>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [actividadesData, eventosData, ubicacionesData] = await Promise.all([
          fetchActividades(),
          fetchEventos(),
          fetchUbicaciones()
        ]);
        
        setActividades(actividadesData);
        setEventos(eventosData);
        setUbicaciones(ubicacionesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleCreate = async (data: ActividadFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const fechaInicio = new Date(data.actifein);
      const fechaFin = new Date(data.actifefi);
      
      if (fechaFin < fechaInicio) {
        throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
      }
      
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      const validUrls = imageUrls.filter(url => url.trim() !== "");
      
      for (const url of validUrls) {
        if (!urlPattern.test(url)) {
          throw new Error(`La URL no es válida: ${url}`);
        }
      }
      
      await createActividad(data, imageUrls);
      setSuccess("Actividad creada con éxito");
      setMode("list");
      
      const actividadesData = await fetchActividades();
      setActividades(actividadesData);
      
      reset();
      setImageUrls([""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la actividad");
      console.error("Error al crear actividad:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: ActividadFormData) => {
    try {
      if (!selectedActividad) {
        throw new Error("No se ha seleccionado una actividad para editar");
      }
      
      setLoading(true);
      setError(null);
      
      const fechaInicio = new Date(data.actifein);
      const fechaFin = new Date(data.actifefi);
      
      if (fechaFin < fechaInicio) {
        throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
      }
      
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      const validUrls = imageUrls.filter(url => url.trim() !== "");
      
      for (const url of validUrls) {
        if (!urlPattern.test(url)) {
          throw new Error(`La URL no es válida: ${url}`);
        }
      }
      
      await updateActividad(data, selectedActividad, imageUrls);
      setSuccess("Actividad actualizada con éxito");
      setMode("list");
      
      const actividadesData = await fetchActividades();
      setActividades(actividadesData);
      
      setSelectedActividad(null);
      reset();
      setImageUrls([""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la actividad");
      console.error("Error al actualizar actividad:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    reset({
      actinomb: actividad.actinomb,
      actidesc: actividad.actidesc,
      evencodiValue: actividad.evencodi.evencodi,
      ubiccodiValue: actividad.ubiccodi.ubiccodi,
      actifein: actividad.actifein,
      actifefi: actividad.actifefi,
      actiface: actividad.actiface || "",
      actiurlx: actividad.actiurlx || "",
      actiinst: actividad.actiinst || "",
    });
    
    if (actividad.actiimag) {
      const urls = actividad.actiimag.split(",");
      setImageUrls(urls.length > 0 ? urls : [""]);
    } else {
      setImageUrls([""]);
    }
    
    setMode("edit");
  };

  const handleInactivate = async (acticodi: number) => {
    try {
      if (!confirm("¿Estás seguro de que deseas inactivar esta actividad?")) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      await inactivateActividad(acticodi);
      setSuccess("Actividad inactivada con éxito");
      
      const actividadesData = await fetchActividades();
      setActividades(actividadesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al inactivar la actividad");
      console.error("Error al inactivar actividad:", err);
    } finally {
      setLoading(false);
    }
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 relative"
          role="alert"
        >
          <p>{success}</p>
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-green-700 font-bold"
            onClick={() => setSuccess(null)}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 relative"
          role="alert"
        >
          <p>{error}</p>
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-red-700 font-bold"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-black font-semibold">Actividades</h2>
            <button
              onClick={() => {
                setMode("create");
                reset();
                setImageUrls([""]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Nueva Actividad
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <EventList
              actividades={actividades}
              loading={loading}
              onEdit={handleEdit}
              onInactivate={handleInactivate}
            />
          )}
        </>
      )}

      {mode !== "list" && (
        <EventForm
          formMethods={{ register, handleSubmit, formState: { errors }, reset }}
          mode={mode}
          eventos={eventos}
          ubicaciones={ubicaciones}
          imageUrls={imageUrls}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          onAddImageUrlField={addImageUrlField}
          onUpdateImageUrl={updateImageUrl}
          onRemoveImageUrl={removeImageUrl}
          onCancel={() => {
            setMode("list");
            setSelectedActividad(null);
            reset();
            setImageUrls([""]);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EventManager;