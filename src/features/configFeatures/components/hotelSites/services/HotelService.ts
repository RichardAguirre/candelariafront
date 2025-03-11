export interface Ubicacion {
    ubiccodi: number;
    ubicnomb: string;
  }
  
  export interface Hotel {
    hotecodi: number;
    hotenomb: string;
    hotedesc: string;
    ubiccodi: Ubicacion;
    hoteesta: number;
    hoteestaStr?: string;
  }
  
  export interface HotelFormData {
    hotenomb: string;
    hotedesc: string;
    ubiccodiValue: number;
  }
  
  /**
   * Obtiene los hoteles según su estado
   * @param estado - 1 activos, 0 inactivos, null ambos
   */
  export async function fetchHoteles(estado: 1 | 0 | null = 1): Promise<Hotel[]> {
    if (estado === null) {
      try {
        const [activosResponse, inactivosResponse] = await Promise.all([
          fetch('/api/api/v1/hotel/consultaHotelByEstado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hoteesta: 1 }),
          }),
          fetch('/api/api/v1/hotel/consultaHotelByEstado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hoteesta: 0 }),
          }),
        ]);
  
        if (!activosResponse.ok) {
          throw new Error(`Error al cargar hoteles activos: ${activosResponse.status}`);
        }
        if (!inactivosResponse.ok) {
          throw new Error(`Error al cargar hoteles inactivos: ${inactivosResponse.status}`);
        }
  
        const [activos, inactivos] = await Promise.all([
          activosResponse.json(),
          inactivosResponse.json(),
        ]);
        return [...activos, ...inactivos];
      } catch (error) {
        console.error("Error al cargar hoteles:", error);
        throw error;
      }
    }
  
    const response = await fetch('/api/api/v1/hotel/consultaHotelByEstado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hoteesta: estado }),
    });
    if (!response.ok) {
      throw new Error(`Error al cargar hoteles: ${response.status}`);
    }
    return response.json();
  }
  
  /**
   * Crea un nuevo hotel
   */
  export async function createHotel(data: HotelFormData): Promise<void> {
    const response = await fetch('/api/api/v1/hotel/crearHotel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotenomb: data.hotenomb,
        hotedesc: data.hotedesc,
        ubiccodi: { ubiccodi: data.ubiccodiValue },
      }),
    });
    if (!response.ok) {
      throw new Error(`Error al crear hotel: ${response.status}`);
    }
  }
  
  /**
   * Modifica un hotel existente
   */
  export async function updateHotel(
    data: HotelFormData,
    selectedHotel: Hotel
  ): Promise<void> {
    const response = await fetch('/api/api/v1/hotel/modificarHotel', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotecodi: selectedHotel.hotecodi,
        hotenomb: data.hotenomb,
        hotedesc: data.hotedesc,
        ubiccodi: { ubiccodi: data.ubiccodiValue },
        hoteesta: selectedHotel.hoteesta,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar hotel: ${response.status}`);
    }
  }
  
  /**
   * Cambia el estado (activo/inactivo) de un hotel
   */
  export async function cambiarEstadoHotel(
    hotecodi: number,
    estado: 0 | 1
  ): Promise<void> {
    const response = await fetch('/api/api/v1/hotel/cambiarEstadoHotel', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotecodi,
        hoteesta: estado,
      }),
    });
    if (!response.ok) {
      const accion = estado === 1 ? "activar" : "inactivar";
      throw new Error(`Error al ${accion} hotel: ${response.status}`);
    }
  }
  
  export async function inactivateHotel(hotecodi: number): Promise<void> {
    return cambiarEstadoHotel(hotecodi, 0);
  }