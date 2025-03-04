import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  fetchUsers,
  updateUser,
  updateUserCredentials,
  toggleUserStatus,
} from "./services/UserManagementService";
import UserManagementList from "./UserManagementList";
import UserManagementForm from "./UserManagementForm";
import { CreateUserForm } from "../CreateUserForm";

const UserManagementManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "edit" | "credentials" | "create">(
    "list"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const formMethods = useForm<User>();
  const credentialMethods = useForm<{ username?: string; password: string }>();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    formMethods.reset(user);
    setMode("edit");
  };

  const handleUpdateUser = async (data: User) => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      await updateUser(selectedUser, data);
      setSuccess("Usuario actualizado con éxito");
      setMode("list");
      loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error actualizando usuario"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCredentials = (user: User) => {
    setSelectedUser(user);
    credentialMethods.reset({ username: user.username, password: "" });
    setMode("credentials");
  };

  const handleUpdateCredentials = async (data: {
    username?: string;
    password: string;
  }) => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      await updateUserCredentials(
        selectedUser.documento,
        data.username,
        data.password
      );
      setSuccess("Credenciales actualizadas con éxito");
      setMode("list");
      loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error actualizando credenciales"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onToggleUserStatus = async (user: User) => {
    try {
      setLoading(true);
      await toggleUserStatus(user);
      setSuccess(
        `Usuario ${user.estado === 1 ? "desactivado" : "activado"} con éxito`
      );
      loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cambiando estado del usuario"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMode("list");
    setSelectedUser(null);
    formMethods.reset();
    credentialMethods.reset();
  };

  const handleCreateSuccess = () => {
    setSuccess("Usuario creado con éxito");
    setMode("list");
    loadUsers();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Panel de Administración de usuarios
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-4">
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
              <h2 className="text-2xl text-black font-semibold">Usuarios</h2>
              <button
                onClick={() => {
                  setMode("create");
                  formMethods.reset();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                + Nuevo Usuario
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <UserManagementList
                users={users}
                loading={false}
                onEdit={handleEdit}
                onToggleStatus={onToggleUserStatus}
              />
            )}
          </>
        )}

        {mode === "edit" && selectedUser && (
          <>
            <div className="bg-white rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-black font-semibold">
                  Editar Usuario
                </h2>
              </div>
              <UserManagementForm
                formMethods={formMethods}
                onSubmit={handleUpdateUser}
                onCancel={handleCancel}
                loading={loading}
                mode="edit"
              />
              <div className="mt-4">
                <button
                  onClick={() => {
                    handleEditCredentials(selectedUser);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Editar Credenciales
                </button>
              </div>
            </div>
          </>
        )}

        {mode === "credentials" && selectedUser && (
          <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-black font-semibold">
                Editar Credenciales
              </h2>
            </div>
            <form
              onSubmit={credentialMethods.handleSubmit(handleUpdateCredentials)}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  {...credentialMethods.register("username")}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre de usuario"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  {...credentialMethods.register("password", {
                    required: "La contraseña es requerida",
                  })}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Contraseña"
                />
                {credentialMethods.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {credentialMethods.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === "create" && (
          <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-black font-semibold">
                Crear Nuevo Usuario
              </h2>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full">
                <CreateUserForm
                  onSuccessfulRegister={handleCreateSuccess}
                  onCancel={handleCancel}
                  showTitle={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementManager;
