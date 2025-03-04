import { useForm } from "react-hook-form";
import { Button } from "../../features/common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface RegisterFormData {
  nombreuno: string;
  nombredos: string;
  apellidouno: string;
  apellidodos: string;
  email: string;
  fechanac: string;
  celular: string;
  documento: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface CreateUserFormProps {
  onSuccessfulRegister?: () => void;
  onCancel?: () => void;
  showTitle?: boolean;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSuccessfulRegister,
  onCancel,
  showTitle = true,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setFormError(null);

      const userData = {
        nombreuno: data.nombreuno,
        nombredos: data.nombredos,
        apellidouno: data.apellidouno,
        apellidodos: data.apellidodos,
        email: data.email,
        fechanac: data.fechanac,
        celular: parseInt(data.celular, 10),
        documento: parseInt(data.documento, 10),
        fechasys: new Date().toISOString().split(".")[0],
      };

      const userResponse = await fetch("/api/api/v1/usuario/crearUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || "Error al crear el usuario");
      }

      const accessData = {
        documento: {
          documento: parseInt(data.documento, 10),
        },
        username: data.username,
        password: data.password,
      };

      const accessResponse = await fetch(
        "/api/api/v1/acceso/crearAccesoUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accessData),
        }
      );

      if (!accessResponse.ok) {
        const errorData = await accessResponse.json();
        throw new Error(errorData.message || "Error al crear las credenciales");
      }

      if (onSuccessfulRegister) {
        onSuccessfulRegister();
      } else {
        alert("¡Registro exitoso!");
        navigate("/login");
      }
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message || "Error en el registro");
      } else {
        setFormError("Error en el registro");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Registro
        </h2>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Primer Nombre*</label>
            <input
              {...register("nombreuno", { required: "Campo requerido" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.nombreuno && (
              <span className="text-red-500 text-sm">
                {errors.nombreuno.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Segundo Nombre</label>
            <input
              {...register("nombredos")}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Primer Apellido*</label>
            <input
              {...register("apellidouno", { required: "Campo requerido" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.apellidouno && (
              <span className="text-red-500 text-sm">
                {errors.apellidouno.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Segundo Apellido</label>
            <input
              {...register("apellidodos")}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email*</label>
            <input
              {...register("email", {
                required: "Campo requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              type="email"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Fecha de Nacimiento*
            </label>
            <input
              {...register("fechanac", { required: "Campo requerido" })}
              type="date"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 [&::-webkit-calendar-picker-indicator]:invert-0"
            />
            {errors.fechanac && (
              <span className="text-red-500 text-sm">
                {errors.fechanac.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Celular*</label>
            <input
              {...register("celular", {
                required: "Campo requerido",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Debe tener 10 dígitos",
                },
              })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.celular && (
              <span className="text-red-500 text-sm">
                {errors.celular.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Documento*</label>
            <input
              {...register("documento", {
                required: "Campo requerido",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Debe tener 10 dígitos",
                },
              })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.documento && (
              <span className="text-red-500 text-sm">
                {errors.documento.message}
              </span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Nombre de Usuario*
            </label>
            <input
              {...register("username", { required: "Campo requerido" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Contraseña*</label>
            <input
              {...register("password", {
                required: "Campo requerido",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Debe contener mayúscula, minúscula, número y carácter especial",
                },
              })}
              type="password"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Confirmar Contraseña*
            </label>
            <input
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
              type="password"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        {(error || formError) && (
          <div className="text-red-500 text-sm mt-4">{error || formError}</div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
          <Button
            type="submit"
            isLoading={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};
