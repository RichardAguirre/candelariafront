import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { User } from './services/UserManagementService';

interface UserManagementFormProps {
  formMethods: UseFormReturn<User>;
  onSubmit: (data: User) => void;
  onCancel: () => void;
  loading: boolean;
  mode: 'edit' | 'create';
}

const UserManagementForm: React.FC<UserManagementFormProps> = ({
  formMethods,
  onSubmit,
  onCancel,
  loading,
  mode,
}) => {
  const { register, handleSubmit, formState: { errors } } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'edit' ? 'Editar Usuario' : 'Crear Usuario'}
      </h2>

      {/* Primer nombre */}
      <div>
        <label className="block text-gray-700 mb-1">Primer nombre *</label>
        <input
          type="text"
          {...register('nombreuno', { required: 'El primer nombre es requerido' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Primer nombre"
        />
        {errors.nombreuno && <p className="text-red-500 text-sm">{errors.nombreuno.message}</p>}
      </div>

      {/* Segundo nombre */}
      <div>
        <label className="block text-gray-700 mb-1">Segundo nombre</label>
        <input
          type="text"
          {...register('nombredos')}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Segundo nombre"
        />
      </div>

      {/* Primer apellido */}
      <div>
        <label className="block text-gray-700 mb-1">Primer apellido *</label>
        <input
          type="text"
          {...register('apellidouno', { required: 'El primer apellido es requerido' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Primer apellido"
        />
        {errors.apellidouno && <p className="text-red-500 text-sm">{errors.apellidouno.message}</p>}
      </div>

      {/* Segundo apellido */}
      <div>
        <label className="block text-gray-700 mb-1">Segundo apellido</label>
        <input
          type="text"
          {...register('apellidodos')}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Segundo apellido"
        />
      </div>

      {/* Correo */}
      <div>
        <label className="block text-gray-700 mb-1">Correo *</label>
        <input
          type="email"
          {...register('correo', { required: 'El correo es requerido' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Correo"
        />
        {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
      </div>

      {/* Celular */}
      <div>
        <label className="block text-gray-700 mb-1">Celular *</label>
        <input
          type="number"
          {...register('celular', { required: 'El celular es requerido' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Celular"
        />
        {errors.celular && <p className="text-red-500 text-sm">{errors.celular.message}</p>}
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label className="block text-gray-700 mb-1">Fecha de nacimiento</label>
        <input
          {...register('fechanac')}
          type="date"
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Usuario */}
      <div>
        <label className="block text-gray-700 mb-1">Usuario *</label>
        <input
          type="text"
          {...register('usuario', { required: 'El usuario es requerido' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Usuario"
        />
        {errors.usuario && <p className="text-red-500 text-sm">{errors.usuario.message}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-gray-700 mb-1">Contraseña *</label>
        <input
          type="password"
          {...register('contrasena', { required: 'La contraseña es requerida' })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Contraseña"
        />
        {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena.message}</p>}
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
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

export default UserManagementForm;