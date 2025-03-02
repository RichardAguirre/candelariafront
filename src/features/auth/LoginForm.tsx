import { useForm } from "react-hook-form";
import { Button } from "../../features/common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import candelaria from "../../assets/images/Candelaria.jpg";
import { useState } from "react";

// Interfaces
interface LoginFormData {
  username: string;
  password: string;
}

interface ResetPasswordData {
  documento: number;
}

interface UserResponse {
  email: string;
  documento: number;
}

export const LoginForm = () => {
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  const { login, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { 
    register: registerReset, 
    handleSubmit: handleSubmitReset, 
    formState: { errors: resetErrors },
    reset: resetResetForm
  } = useForm<ResetPasswordData>();

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

  const generateRandomPassword = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => chars[x % chars.length])
      .join('');
  };

  const handlePasswordReset = async (data: ResetPasswordData) => {
    try {
      const userResponse = await fetch("/api/api/v1/usuario/consultaUsuarioByDocumento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento: data.documento }),
      });
  
      if (!userResponse.ok) throw new Error("Documento no registrado");
  
      const userData: UserResponse = await userResponse.json();
      setUserEmail(userData.email);
  
      const usernameResponse = await fetch("/api/api/v1/acceso/datosAcceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento: data.documento }),
      });
  
      if (!usernameResponse.ok) throw new Error("No se pudo obtener el username");
  
      const usernameData: { username: string } = await usernameResponse.json();
      
      const newPassword = generateRandomPassword();
  
      const resetResponse = await fetch("/api/api/v1/acceso/olvidoPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameData.username,
          password: newPassword,
          documento: { email: userData.email }
        }),
      });
  
      if (!resetResponse.ok) throw new Error("Error al restablecer contraseña");

      setResetSuccess(true);
      alert(`La nueva contraseña ha sido enviada a tu correo registrado`);
      /* alert(`La nueva contraseña ha sido enviada a ${userData.email}`); */
  
      setTimeout(() => {
        setShowResetModal(false);
        resetResetForm();
        setResetSuccess(false);
      }, 3000);
  
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error desconocido");
      setTimeout(() => setLocalError(""), 5000);
    }
  };
  

  return (
    <div className="flex w-screen h-screen">
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {resetSuccess ? "¡Contraseña restablecida!" : "Restablecer Contraseña"}
            </h2>

            {!resetSuccess ? (
              <form onSubmit={handleSubmitReset(handlePasswordReset)} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Número de documento</label>
                  <input
                    {...registerReset("documento", {
                      required: "El documento es requerido",
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-black"
                    type="number"
                    placeholder="Ingresa tu documento"
                  />
                  {resetErrors.documento && (
                    <span className="text-red-500 text-sm">
                      {resetErrors.documento.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Restablecer
                </Button>
              </form>
            ) : (
              <p className="text-green-600 text-center">
                Se ha enviado una nueva contraseña a: {userEmail}
              </p>
            )}

            {localError && (
              <div className="text-red-500 text-sm text-center mt-4">
                {localError}
              </div>
            )}

            <button
              onClick={() => {
                setShowResetModal(false);
                resetResetForm();
                setResetSuccess(false);
                setLocalError("");
              }}
              className="mt-4 text-gray-600 hover:text-gray-800 w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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

          <form onSubmit={handleLoginSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre de usuario</label>
              <input
                {...loginRegister("username", {
                  required: "El nombre de usuario es requerido",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-black"
                placeholder="Ingresa tu nombre de usuario"
              />
              {loginErrors.username && (
                <span className="text-red-500 text-sm">
                  {loginErrors.username.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <input
                {...loginRegister("password", {
                  required: "La contraseña es requerida",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-black"
                type="password"
                placeholder="Ingresa tu contraseña"
              />
              {loginErrors.password && (
                <span className="text-red-500 text-sm">
                  {loginErrors.password.message}
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

            <div className="text-center mt-4 space-y-2">
              <div>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="text-purple-500 hover:text-purple-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              
              <div>
                <span className="text-gray-600">¿No tienes cuenta?</span>{" "}
                <Link
                  to="/register"
                  className="text-purple-500 hover:text-purple-700 font-medium"
                >
                  Regístrate
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};