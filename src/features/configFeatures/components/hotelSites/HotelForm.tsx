import React from "react";
import { UseFormReturn } from "react-hook-form";
import { HotelFormData } from "./services/HotelService";

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

interface HotelFormProps {
  formMethods: UseFormReturn<HotelFormData>;
  mode: "create" | "edit";
  onSubmit: (data: HotelFormData) => void;
  onCancel: () => void;
  loading: boolean;
  Ubicaciones: Ubicacion[];
}

const HotelForm: React.FC<HotelFormProps> = ({
  formMethods,
  mode,
  onSubmit,
  onCancel,
  loading,
  Ubicaciones,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl text-black font-semibold mb-4">
        {mode === "create" ? "Crear Nuevo Hotel" : "Editar Hotel"}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nombre del Hotel</label>
        <input
          type="text"
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...register("hotenomb", { required: "Campo requerido" })}
          placeholder="Nombre del hotel"
        />
        {errors.hotenomb && (
          <p className="text-red-600">{errors.hotenomb.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Descripción</label>
        <textarea
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...register("hotedesc")}
          placeholder="Escriba una breve descripción"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Ubicación *</label>
        <select
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...register("ubiccodiValue", {
            required: "La ubicación es requerida",
            valueAsNumber: true,
          })}
        >
          <option value="">Seleccione una ubicación</option>
          {Ubicaciones.map((ubic) => (
            <option key={ubic.ubiccodi} value={ubic.ubiccodi}>
              {ubic.ubicnomb}
            </option>
          ))}
        </select>
        {errors.ubiccodiValue && (
          <p className="text-red-600 text-sm">{errors.ubiccodiValue.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {mode === "create" ? "Crear" : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
