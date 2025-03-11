export interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

export interface SitioTuristico {
  turicodi: number;
  turinomb: string;
  turidire: string;
  turiimag: string;
  ubiccodi: Ubicacion;
  turiesta: number;
  turiestaStr?: string;
  turilike: number;
  turiface: string;
  turiurlx: string;
  turiinst: string;
}

export interface SitioTuristicoFormData {
  turinomb: string;
  turidire: string;
  ubiccodiValue: number;
  turiface: string;
  turiurlx: string;
  turiinst: string;
}

/**
 * Obtiene los sitios turísticos según su estado
 * @param estado - Estado de los sitios turísticos a consultar (1: activos, 0: inactivos, null: todos)
 */
export async function fetchSitiosTuristicos(estado: 1 | 0 | null = 1): Promise<SitioTuristico[]> {
  if (estado === null) {
    try {
      const [activosResponse, inactivosResponse] = await Promise.all([
        fetch('/api/api/v1/sitioTuristico/consultaAllSitioTuristico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ turiesta: 1 }),
        }),
        fetch('/api/api/v1/sitioTuristico/consultaAllSitioTuristico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ turiesta: 0 }),
        })
      ]);
      
      if (!activosResponse.ok) {
        const errorData = await activosResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar sitios turísticos activos: ${activosResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      if (!inactivosResponse.ok) {
        const errorData = await inactivosResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar sitios turísticos inactivos: ${inactivosResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      const [activos, inactivos] = await Promise.all([
        activosResponse.json(),
        inactivosResponse.json()
      ]);
      
      return [...activos, ...inactivos];
    } catch (error) {
      console.error("Error al cargar ambos tipos de sitios turísticos:", error);
      throw error;
    }
  }
  
  const response = await fetch('/api/api/v1/sitioTuristico/consultaAllSitioTuristico', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ turiesta: estado }),
  });

  if (!response.ok) {
    throw new Error(`Error al cargar sitios turísticos: ${response.status}`);
  }
  
  return response.json();
}

export async function createSitioTuristico(data: SitioTuristicoFormData, imageUrlsString: string): Promise<void> {
  const response = await fetch('/api/api/v1/sitioTuristico/crearSitioTuristico', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      turinomb: data.turinomb,
      turidire: data.turidire,
      turiimag: imageUrlsString,
      ubiccodi: { ubiccodi: data.ubiccodiValue },
      turilike: 0,
      turiface: data.turiface || '',
      turiurlx: data.turiurlx || '',
      turiinst: data.turiinst || '',
    }),
  });
  if (!response.ok) {
    throw new Error(`Error al crear sitio turístico: ${response.status}`);
  }
}

export async function updateSitioTuristico(
  data: SitioTuristicoFormData,
  selectedSitio: SitioTuristico,
  imageUrlsString: string
): Promise<void> {
  const response = await fetch('/api/api/v1/sitioTuristico/modificarSitioTuristico', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      turicodi: selectedSitio.turicodi,
      turinomb: data.turinomb,
      turidire: data.turidire,
      turiimag: imageUrlsString,
      ubiccodi: { ubiccodi: data.ubiccodiValue },
      turilike: selectedSitio.turilike,
      turiface: data.turiface || '',
      turiurlx: data.turiurlx || '',
      turiinst: data.turiinst || '',
    }),
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar sitio turístico: ${response.status}`);
  }
}

/**
 * Cambia el estado de un sitio turístico (activo/inactivo)
 * @param turicodi - Código del sitio turístico
 * @param estado - Estado deseado (1: activo, 0: inactivo)
 */
export async function cambiarEstadoSitioTuristico(
  turicodi: number,
  estado: 0 | 1
): Promise<void> {
  try {
    const response = await fetch('/api/api/v1/sitioTuristico/cambiarEstadoSitioTuristico', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turicodi,
        turiesta: estado
      }),
    });
    
    if (!response.ok) {
      const accion = estado === 1 ? "activar" : "inactivar";
      throw new Error(`Error al ${accion} sitio turístico: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error al cambiar estado del sitio turístico:`, error);
    throw error;
  }
}

export async function inactivateSitioTuristico(turicodi: number): Promise<void> {
  return cambiarEstadoSitioTuristico(turicodi, 0);
}