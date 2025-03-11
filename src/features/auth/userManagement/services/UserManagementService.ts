export interface User {
  documento: number;
  nombreuno: string;
  nombredos: string;
  apellidouno: string;
  apellidodos: string;
  correo: string;
  celular: number;
  fechanac: string;
  estado: number | null;
  usuario: string;
  contrasena: string;
  idperfil: {
    idperfil: number;
    nombreperfil: string;
    estado: number;
    strEstado: string;
  };
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/api/v1/usuario/consultaAllUsuario');
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const users: User[] = await response.json();
  return users;
}

export async function fetchUserByDocumento(documento: number): Promise<User> {
  const response = await fetch('/api/api/v1/usuario/consultaUsuarioByDocumento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documento }),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const user: User = await response.json();
  return user;
}

export async function updateUser(user: User, newData: Partial<User>): Promise<void> {
  const response = await fetch('/api/api/v1/usuario/modificarUsuario', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user, ...newData, documento: user.documento }),
  });
  
  if (!response.ok) {
    throw new Error('Error actualizando usuario');
  }
}

export async function toggleUserStatus(user: User): Promise<void> {
  const isActive = user.estado === 1;
  const url = isActive
    ? '/api/api/v1/usuario/eliminarAcceso'
    : '/api/api/v1/usuario/activarUsuario';

  const body = JSON.stringify({ documento: user.documento });

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!response.ok) {
    throw new Error(`Error ${isActive ? 'desactivando' : 'activando'} usuario`);
  }
}