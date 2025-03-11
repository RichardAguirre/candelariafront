import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ActividadFormData, Evento, Ubicacion } from "./services/ActivityService";

interface EventFormProps {
  formMethods: UseFormReturn<ActividadFormData>;
  mode: "create" | "edit";
  eventos: Evento[];
  ubicaciones: Ubicacion[];
  imageUrls: string[];
  onSubmit: (data: ActividadFormData) => void;
  onAddImageUrlField: () => void;
  onUpdateImageUrl: (index: number, value: string) => void;
  onRemoveImageUrl: (index: number) => void;
  onCancel: () => void;
  loading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  formMethods,
  mode,
  eventos,
  ubicaciones,
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
      <h2 className="text-xl text-black font-semibold mb-4">
        {mode === "create" ? "Crear Nueva Actividad" : "Editar Actividad"}
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          {...register("actinomb", { required: "El nombre es requerido" })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Nombre de la actividad"
        />
        {errors.actinomb && (
          <p className="text-red-500 text-sm">{errors.actinomb.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-gray-700 mb-1">Descripción *</label>
        <textarea
          {...register("actidesc", { required: "La descripción es requerida" })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Descripción de la actividad"
        />
        {errors.actidesc && (
          <p className="text-red-500 text-sm">{errors.actidesc.message}</p>
        )}
      </div>

      {/* Evento */}
      <div>
        <label className="block text-gray-700 mb-1">Tipo de evento *</label>
        <select
          {...register("evencodiValue", {
            required: "El evento es requerido",
            valueAsNumber: true,
          })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seleccione un evento</option>
          {eventos.map((evento) => (
            <option
              key={evento.evencodi}
              value={evento.evencodi}
            >
              {evento.evennomb}
            </option>
          ))}
        </select>
        {errors.evencodiValue && (
          <p className="text-red-500 text-sm">{errors.evencodiValue.message}</p>
        )}
      </div>

      {/* Ubicación */}
      <div>
        <label className="block text-gray-700 mb-1">Ubicación *</label>
        <select
          {...register("ubiccodiValue", {
            required: "La ubicación es requerida",
            valueAsNumber: true,
          })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seleccione una ubicación</option>
          {ubicaciones.map((ubicacion) => (
            <option
              key={ubicacion.ubiccodi}
              value={ubicacion.ubiccodi}
            >
              {ubicacion.ubicnomb}
            </option>
          ))}
        </select>
        {errors.ubiccodiValue && (
          <p className="text-red-500 text-sm">{errors.ubiccodiValue.message}</p>
        )}
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Fecha de Inicio *</label>
          <input
            type="datetime-local"
            {...register("actifein", {
              required: "La fecha de inicio es requerida",
            })}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.actifein && (
            <p className="text-red-500 text-sm">{errors.actifein.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Fecha de Fin *</label>
          <input
            type="datetime-local"
            {...register("actifefi", {
              required: "La fecha de fin es requerida",
            })}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.actifefi && (
            <p className="text-red-500 text-sm">{errors.actifefi.message}</p>
          )}
        </div>
      </div>

      {/* URLs de imágenes */}
      <div>
        <label className="block text-gray-700 mb-1">URLs de Imágenes</label>
        <div className="text-sm text-gray-500 mb-2">
          Ingresa URLs de imágenes (ejemplo: https://example.com/imagen.jpg)
        </div>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => onUpdateImageUrl(index, e.target.value)}
              className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/imagen.jpg"
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
            {...register("actiface")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://facebook.com/pagina"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Twitter/X URL</label>
          <input
            type="text"
            {...register("actiurlx")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://twitter.com/usuario"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Instagram URL</label>
          <input
            type="text"
            {...register("actiinst")}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://instagram.com/usuario"
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

export default EventForm;