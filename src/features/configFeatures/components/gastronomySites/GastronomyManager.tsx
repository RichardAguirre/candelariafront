import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Gastronomia,
  GastronomiaFormData,
  fetchGastronomias,
  createGastronomia,
  updateGastronomia,
  cambiarEstadoGastronomia,
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

  const formMethods = useForm<GastronomiaFormData>();
  const { reset } = formMethods;

  const loadGastronomias = async () => {
    setLoading(true);
    setError(null);
    try {
      const gastronomiasData = await fetchGastronomias(null);
      setGastronomias(gastronomiasData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los datos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGastronomias();
  }, []);

  const handleCreate = async (data: GastronomiaFormData) => {
    try {
      setLoading(true);
      setError(null);
      await createGastronomia(data, imageUrls);
      setSuccess("Gastronomía creada con éxito");
      setMode("list");
      reset();
      setImageUrls([""]);
      await loadGastronomias();
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
      setSelectedGastronomia(null);
      reset();
      setImageUrls([""]);
      await loadGastronomias();
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

  const handleToggleStatus = async (gastcodi: number, activate: boolean) => {
    try {
      const action = activate ? "activar" : "inactivar";
      if (!confirm(`¿Estás seguro de que deseas ${action} esta gastronomía?`)) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      await cambiarEstadoGastronomia(gastcodi, activate ? 1 : 0);
      setSuccess(`Gastronomía ${action}ada con éxito`);
      
      await loadGastronomias();
    } catch (err) {
      const action = activate ? "activar" : "inactivar";
      setError(
        err instanceof Error ? err.message : `Error al ${action} la gastronomía`
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
      
      <div className="bg-white rounded-lg shadow-lg p-6">
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
                  formMethods.reset({});
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
                onToggleStatus={handleToggleStatus}
              />
            )}
          </>
        )}

        {mode !== "list" && (
          <GastronomyForm
            formMethods={formMethods}
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
    </div>
  );
};

export default GastronomyManager;