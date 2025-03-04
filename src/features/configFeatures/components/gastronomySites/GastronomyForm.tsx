import React from "react";
import { UseFormReturn } from "react-hook-form";
import { GastronomiaFormData } from "./services/GastronomyService";

interface GastronomyFormProps {
  formMethods: UseFormReturn<GastronomiaFormData>;
  mode: "create" | "edit";
  imageUrls: string[];
  onSubmit: (data: GastronomiaFormData) => void;
  onAddImageUrlField: () => void;
  onUpdateImageUrl: (index: number, value: string) => void;
  onRemoveImageUrl: (index: number) => void;
  onCancel: () => void;
  loading: boolean;
}

const GastronomyForm: React.FC<GastronomyFormProps> = ({
  formMethods,
  mode,
  imageUrls,
  onSubmit,
  onAddImageUrlField,
  onUpdateImageUrl,
  onRemoveImageUrl,
  onCancel,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "create" ? "Crear Nueva Gastronomía" : "Editar Gastronomía"}
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          {...register("gastnomb", { required: "El nombre es requerido" })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nombre de la gastronomía"
        />
        {errors.gastnomb && (
          <p className="text-red-500 text-sm">{errors.gastnomb.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-gray-700 mb-1">Descripción *</label>
        <textarea
          {...register("gastdesc", { required: "La descripción es requerida" })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Descripción de la gastronomía"
        />
        {errors.gastdesc && (
          <p className="text-red-500 text-sm">{errors.gastdesc.message}</p>
        )}
      </div>

      {/* URLs de imágenes */}
      <div>
        <label className="block text-gray-700 mb-1">URLs de Imágenes</label>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => onUpdateImageUrl(index, e.target.value)}
              className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="URL de la imagen"
            />
            <button
              type="button"
              onClick={() => onRemoveImageUrl(index)}
              className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
              disabled={imageUrls.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddImageUrlField}
          className="mt-1 text-purple-600 hover:text-purple-800 text-sm"
        >
          + Agregar otra imagen
        </button>
      </div>

      {/* Redes Sociales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Facebook URL</label>
          <input
            type="text"
            {...register("gastface")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="URL de Facebook"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Twitter/X URL</label>
          <input
            type="text"
            {...register("gasturlx")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="URL de Twitter/X"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Instagram URL</label>
          <input
            type="text"
            {...register("gastinst")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="URL de Instagram"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : mode === "create"
            ? "Crear"
            : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};

export default GastronomyForm;