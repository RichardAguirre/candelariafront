import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
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

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const userData = {
        nombreuno: data.nombreuno,
        nombredos: data.nombredos,
        apellidouno: data.apellidouno,
        apellidodos: data.apellidodos,
        email: data.email,
        fechanac: data.fechanac,
        celular: parseInt(data.celular, 10),
        documento: parseInt(data.documento, 10),
        fechasys: new Date().toISOString().split('.')[0]
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
          documento: parseInt(data.documento, 10)
        },
        username: data.username,
        password: data.password
      };

      const accessResponse = await fetch("/api/api/v1/acceso/crearAccesoUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessData),
      });

      if (!accessResponse.ok) {
        const errorData = await accessResponse.json();
        throw new Error(errorData.message || "Error al crear las credenciales");
      }

      alert("¡Registro exitoso!");
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message || "Error en el registro");
      } else {
        alert("Error en el registro");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Registro
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-0.5">Primer Nombre*</label>
              <input
                {...register("nombreuno", { required: "Campo requerido" })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.nombreuno && <span className="text-red-500 text-sm">{errors.nombreuno.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Segundo Nombre</label>
              <input
                {...register("nombredos")}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Primer Apellido*</label>
              <input
                {...register("apellidouno", { required: "Campo requerido" })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.apellidouno && <span className="text-red-500 text-sm">{errors.apellidouno.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Segundo Apellido</label>
              <input
                {...register("apellidodos")}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Email*</label>
              <input
                {...register("email", { 
                  required: "Campo requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Fecha de Nacimiento*</label>
              <input
                {...register("fechanac", { required: "Campo requerido" })}
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.fechanac && <span className="text-red-500 text-sm">{errors.fechanac.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Celular*</label>
              <input
                {...register("celular", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Debe tener 10 dígitos"
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.celular && <span className="text-red-500 text-sm">{errors.celular.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Documento*</label>
              <input
                {...register("documento", {
                  required: "Campo requerido",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Debe tener 10 dígitos"
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.documento && <span className="text-red-500 text-sm">{errors.documento.message}</span>}
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-0.5">Nombre de Usuario*</label>
              <input
                {...register("username", { required: "Campo requerido" })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Contraseña*</label>
              <input
                {...register("password", {
                  required: "Campo requerido",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Debe contener mayúscula, minúscula, número y carácter especial"
                  }
                })}
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-0.5">Confirmar Contraseña*</label>
              <input
                {...register("confirmPassword", {
                  validate: value => value === watch("password") || "Las contraseñas no coinciden"
                })}
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};