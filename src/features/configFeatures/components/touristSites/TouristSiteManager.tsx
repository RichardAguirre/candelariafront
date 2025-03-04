import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import TouristSiteList from "./TouristSiteList";
import TouristSiteForm from "./TouristSiteForm";
import {
  SitioTuristico,
  SitioTuristicoFormData,
  fetchSitiosTuristicos,
  createSitioTuristico,
  updateSitioTuristico,
  inactivateSitioTuristico,
} from "./services/TouristSiteService";

const TouristSiteManager: React.FC = () => {
  const [sitios, setSitios] = useState<SitioTuristico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedSitio, setSelectedSitio] = useState<SitioTuristico | null>(
    null
  );
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const formMethods = useForm<SitioTuristicoFormData>();

  useEffect(() => {
    loadSitiosTuristicos();
  }, []);

  const loadSitiosTuristicos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSitiosTuristicos();
      setSitios(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los datos"
      );
      console.error("Error al cargar sitios turísticos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: SitioTuristicoFormData) => {
    try {
      setLoading(true);
      setError(null);
      const imageUrlsString = imageUrls
        .filter((url) => url.trim() !== "")
        .join(",");

      if (mode === "create") {
        await createSitioTuristico(data, imageUrlsString);
        setSuccess("Sitio turístico creado con éxito");
      } else if (selectedSitio) {
        await updateSitioTuristico(data, selectedSitio, imageUrlsString);
        setSuccess("Sitio turístico actualizado con éxito");
        setSelectedSitio(null);
      }
      setMode("list");
      formMethods.reset();
      setImageUrls([""]);
      loadSitiosTuristicos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al guardar el sitio turístico"
      );
      console.error("Error al guardar sitio turístico:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sitio: SitioTuristico) => {
    setSelectedSitio(sitio);
    formMethods.reset({
      turinomb: sitio.turinomb,
      turidire: sitio.turidire,
      ubiccodiValue: sitio.ubiccodi.ubiccodi,
      turiface: sitio.turiface || "",
      turiurlx: sitio.turiurlx || "",
      turiinst: sitio.turiinst || "",
    });

    if (sitio.turiimag) {
      const urls = sitio.turiimag.split(",");
      setImageUrls(urls.length > 0 ? urls : [""]);
    } else {
      setImageUrls([""]);
    }

    setMode("edit");
  };

  const handleInactivate = async (turicodi: number) => {
    try {
      setLoading(true);
      setError(null);
      await inactivateSitioTuristico(turicodi);
      setSuccess("Sitio turístico inactivado con éxito");
      loadSitiosTuristicos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al inactivar el sitio turístico"
      );
      console.error("Error al inactivar sitio turístico:", err);
    } finally {
      setLoading(false);
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
            <h2 className="text-2xl text-black font-semibold">
              Sitios Turísticos
            </h2>
            <button
              onClick={() => {
                setMode("create");
                formMethods.reset();
                setImageUrls([""]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Nuevo Sitio Turístico
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <TouristSiteList
              sitios={sitios}
              loading={loading}
              onEdit={handleEdit}
              onInactivate={handleInactivate}
            />
          )}
        </>
      )}

      {mode !== "list" && (
        <TouristSiteForm
          formMethods={formMethods}
          mode={mode}
          sitios={sitios}
          imageUrls={imageUrls}
          onSubmit={handleCreateOrUpdate}
          onAddImageUrlField={() => setImageUrls([...imageUrls, ""])}
          onUpdateImageUrl={(index, value) => {
            const newUrls = [...imageUrls];
            newUrls[index] = value;
            setImageUrls(newUrls);
          }}
          onRemoveImageUrl={(index) => {
            if (imageUrls.length > 1) {
              const newUrls = imageUrls.filter((_, i) => i !== index);
              setImageUrls(newUrls);
            }
          }}
          onCancel={() => {
            setMode("list");
            setSelectedSitio(null);
            formMethods.reset();
            setImageUrls([""]);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TouristSiteManager;
