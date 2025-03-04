import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Gastronomia,
  GastronomiaFormData,
  fetchGastronomias,
  createGastronomia,
  updateGastronomia,
  inactivateGastronomia,
} from "./services/GastronomyService";
import GastronomyList from "./GastronomyList";
import GastronomyForm from "./GastronomyForm";

const GastronomyManager: React.FC = () => {
  const [gastronomias, setGastronomias] = useState<Gastronomia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedGastronomia, setSelectedGastronomia] =
    useState<Gastronomia | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GastronomiaFormData>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const gastronomiasData = await fetchGastronomias(1);
        setGastronomias(gastronomiasData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los datos"
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreate = async (data: GastronomiaFormData) => {
    try {
      setLoading(true);
      setError(null);
      await createGastronomia(data, imageUrls);
      setSuccess("Gastronomía creada con éxito");
      setMode("list");
      const gastronomiasData = await fetchGastronomias(1);
      setGastronomias(gastronomiasData);
      reset();
      setImageUrls([""]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la gastronomía"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: GastronomiaFormData) => {
    try {
      if (!selectedGastronomia) {
        throw new Error("No se ha seleccionado una gastronomía para editar");
      }
      setLoading(true);
      setError(null);
      await updateGastronomia(data, selectedGastronomia, imageUrls);
      setSuccess("Gastronomía actualizada con éxito");
      setMode("list");
      const gastronomiasData = await fetchGastronomias(1);
      setGastronomias(gastronomiasData);
      setSelectedGastronomia(null);
      reset();
      setImageUrls([""]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la gastronomía"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gastronomia: Gastronomia) => {
    setSelectedGastronomia(gastronomia);
    reset({
      gastnomb: gastronomia.gastnomb,
      gastdesc: gastronomia.gastdesc,
      gastface: gastronomia.gastface,
      gasturlx: gastronomia.gasturlx,
      gastinst: gastronomia.gastinst,
    });
    if (gastronomia.gastimag) {
      const urls = gastronomia.gastimag.split(",");
      setImageUrls(urls.length > 0 ? urls : [""]);
    } else {
      setImageUrls([""]);
    }
    setMode("edit");
  };

  const handleInactivate = async (gastcodi: number) => {
    try {
      if (!confirm("¿Estás seguro de que deseas inactivar esta gastronomía?")) {
        return;
      }
      setLoading(true);
      setError(null);
      await inactivateGastronomia(gastcodi);
      setSuccess("Gastronomía inactivada con éxito");
      const gastronomiasData = await fetchGastronomias(1);
      setGastronomias(gastronomiasData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al inactivar la gastronomía"
      );
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
            <h2 className="text-2xl text-black font-semibold">Gastronomías</h2>
            <button
              onClick={() => {
                setMode("create");
                reset();
                setImageUrls([""]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Nueva Gastronomía
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <GastronomyList
              gastronomias={gastronomias}
              loading={loading}
              onEdit={handleEdit}
              onInactivate={handleInactivate}
            />
          )}
        </>
      )}

      {mode !== "list" && (
        <GastronomyForm
          formMethods={{ register, handleSubmit, formState: { errors }, reset }}
          mode={mode}
          imageUrls={imageUrls}
          onSubmit={mode === "create" ? handleCreate : handleUpdate}
          onAddImageUrlField={addImageUrlField}
          onUpdateImageUrl={updateImageUrl}
          onRemoveImageUrl={removeImageUrl}
          onCancel={() => {
            setMode("list");
            setSelectedGastronomia(null);
            reset();
            setImageUrls([""]);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GastronomyManager;
