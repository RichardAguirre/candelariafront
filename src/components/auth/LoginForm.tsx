import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import candelaria from "../../assets/images/Candelaria.jpg";
import { useState } from "react";

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { login, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLocalError("");
      
      const response = await fetch("/api/api/v1/acceso/validaAcceso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username.trim(),
          password: data.password
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Credenciales inválidas");
      }

      await login(data.username, data.password);
      navigate("/dashboard");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error de conexión";
      setLocalError(errorMessage);
      console.error("Error en el login:", err);
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <div
        className="w-1/2 flex flex-col justify-center items-center text-white bg-cover bg-center relative"
        style={{ backgroundImage: `url(${candelaria})` }}
      >
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre de usuario</label>
              <input
                {...register("username", {
                  required: "El nombre de usuario es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-black"
                placeholder="Ingresa tu nombre de usuario"
              />
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <input
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-black"
                type="password"
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {(localError || authError) && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {localError || authError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>

            <div className="text-center mt-4">
              <span className="text-gray-600">¿No tienes cuenta?</span>{" "}
              <Link
                to="/register"
                className="text-purple-500 hover:text-purple-700 font-medium"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};