export interface User {
    documento: number;
    nombreuno: string;
    nombredos: string;
    apellidouno: string;
    apellidodos: string;
    email: string;
    celular: number;
    fechasys: string;
    fechanac: string;
    estado: number | null;
    perfil?: string;
    username?: string;
  }
  
  export async function fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/api/v1/usuario/consultaAllUsuario');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const users: User[] = await response.json();
    
    const usersWithAccess = await Promise.all(users.map(async (user) => {
      try {
        const accessResponse = await fetch('/api/api/v1/acceso/datosAcceso', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documento: user.documento }),
        });
        const accessData = accessResponse.ok ? await accessResponse.json() : {};
  
        return {
          ...user,
          perfil: accessData.perfil || 'N/A',
          username: accessData.username || 'N/A',
          estado: accessData.estado ?? null,
        };
      } catch (error) {
        return {
          ...user,
          perfil: 'N/A',
          username: 'N/A',
          estado: null,
        };
      }
    }));
  
    return usersWithAccess;
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
  
  export async function updateUserCredentials(
    documento: number,
    username: string | undefined,
    password: string
  ): Promise<void> {
    const response = await fetch('/api/api/v1/acceso/modificaAcceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documento: { documento },
        username,
        password,
      }),
    });
    if (!response.ok) {
      throw new Error('Error actualizando credenciales');
    }
  }
  
  export async function toggleUserStatus(user: User): Promise<void> {
    const isActive = user.estado === 1;
    const url = isActive
      ? '/api/api/v1/acceso/eliminarAcceso'
      : '/api/api/v1/acceso/activarUsuario';
  
    const body = isActive
      ? JSON.stringify({ documento: { documento: user.documento } })
      : JSON.stringify({ documento: user.documento });
  
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!response.ok) {
      throw new Error(`Error ${isActive ? 'desactivando' : 'activando'} usuario`);
    }
  }