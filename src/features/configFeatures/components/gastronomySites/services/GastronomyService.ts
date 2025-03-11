export interface User {
  documento: number | null;
  nombreuno: string | null;
  nombredos: string | null;
  apellidouno: string | null;
  apellidodos: string | null;
  email: string | null;
  fechanac: string | null;
  celular: string | null;
  fechasys: string | null;
}

export interface TipoCalificacion {
  tipocodi: number | null;
  tiponomb: number | string;
}

export interface Gastronomia {
  gastcodi: number;
  gastnomb: string;
  gastdesc: string;
  gastimag: string;
  gastface: string;
  gasturlx: string;
  gastinst: string;
  gastesta: number;
  gastestaStr: string;
}

export interface GastronomiaCalificacion {
  calicodi: number;
  califech: string;
  caliuser: User;
  tipocodi: TipoCalificacion;
  caliobse: string;
  gastcodi: Gastronomia;
}

export interface GastronomiaFormData {
  gastnomb: string;
  gastdesc: string;
  gastface: string;
  gasturlx: string;
  gastinst: string;
}

/**
 * Obtiene las gastronomías según su estado
 * @param gastesta - Estado de las gastronomías a consultar (1: activas, 0: inactivas, null: todas)
 */
export async function fetchGastronomias(gastesta: 1 | 0 | null = 1): Promise<Gastronomia[]> {
  if (gastesta === null) {
    try {
      const [activasResponse, inactivasResponse] = await Promise.all([
        fetch("/api/api/v1/gastronomia/consultaAllGastronomia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gastesta: 1 }),
        }),
        fetch("/api/api/v1/gastronomia/consultaAllGastronomia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gastesta: 0 }),
        })
      ]);
      
      if (!activasResponse.ok) {
        const errorData = await activasResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar gastronomías activas: ${activasResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      if (!inactivasResponse.ok) {
        const errorData = await inactivasResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar gastronomías inactivas: ${inactivasResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      const [activasData, inactivasData] = await Promise.all([
        activasResponse.json(),
        inactivasResponse.json()
      ]);
      
      const activasGastronomias = activasData.map((item: GastronomiaCalificacion) => item.gastcodi);
      const inactivasGastronomias = inactivasData.map((item: GastronomiaCalificacion) => item.gastcodi);
      
      const todasGastronomias = [...activasGastronomias, ...inactivasGastronomias];
      const uniqueGastronomias = Array.from(
        new Map(todasGastronomias.map(item => [item.gastcodi, item])).values()
      );
      
      return uniqueGastronomias;
    } catch (error) {
      console.error("Error al cargar ambos tipos de gastronomías:", error);
      throw error;
    }
  }
  
  try {
    const response = await fetch("/api/api/v1/gastronomia/consultaAllGastronomia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gastesta }),
    });
    
    if (!response.ok) {
      throw new Error(`Error al cargar gastronomías: ${response.status}`);
    }
    
    const data: GastronomiaCalificacion[] = await response.json();
    console.log("Respuesta API gastronomía:", data);
    
    const gastronomias: Gastronomia[] = data.map(item => item.gastcodi);
    
    const uniqueGastronomias = Array.from(
      new Map(gastronomias.map(item => [item.gastcodi, item])).values()
    );
    
    return uniqueGastronomias;
  } catch (error) {
    console.error("Error en fetchGastronomias:", error);
    throw error;
  }
}

export async function createGastronomia(
  data: GastronomiaFormData,
  imageUrls: string[]
): Promise<void> {
  const imageUrlsString = imageUrls
    .filter((url) => url.trim() !== "")
    .join(",");

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  const validUrls = imageUrls.filter(url => urlPattern.test(url));

  if (validUrls.length !== imageUrls.length) {
    throw new Error("Una o más URLs de imagen no son válidas.");
  }

  const response = await fetch('/api/api/v1/gastronomia/crearGastronomia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gastnomb: data.gastnomb,
      gastdesc: data.gastdesc,
      gastimag: imageUrlsString,
      gastface: data.gastface || '',
      gasturlx: data.gasturlx || '',
      gastinst: data.gastinst || ''
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear gastronomía: ${response.status} - ${errorText}`);
  }
}

export async function updateGastronomia(
  data: GastronomiaFormData,
  selectedGastronomia: Gastronomia,
  imageUrls: string[]
): Promise<void> {
  const imageUrlsString = imageUrls
    .filter((url) => url.trim() !== "")
    .join(",");

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  const validUrls = imageUrls.filter(url => urlPattern.test(url));

  if (validUrls.length !== imageUrls.length) {
    throw new Error("Una o más URLs de imagen no son válidas.");
  }

  const response = await fetch('/api/api/v1/gastronomia/modificarGastronomia', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gastcodi: selectedGastronomia.gastcodi,
      gastnomb: data.gastnomb,
      gastdesc: data.gastdesc,
      gastimag: imageUrlsString,
      gastface: data.gastface || '',
      gasturlx: data.gasturlx || '',
      gastinst: data.gastinst || ''
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar gastronomía: ${response.status} - ${errorText}`);
  }
}

/**
 * Cambia el estado de una gastronomía (activa/inactiva)
 * @param gastcodi - Código de la gastronomía
 * @param estado - Estado deseado (1: activo, 0: inactivo)
 */
export async function cambiarEstadoGastronomia(
  gastcodi: number,
  estado: 0 | 1
): Promise<void> {
  try {
    console.log(`${estado === 1 ? "Activando" : "Inactivando"} gastronomía:`, gastcodi);
    
    const response = await fetch("/api/api/v1/gastronomia/cambiarEstadoGastronomia", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gastcodi,
        gastesta: estado
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      const accion = estado === 1 ? "activar" : "inactivar";
      throw new Error(`Error al ${accion} gastronomía: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`Error al cambiar estado de gastronomía:`, error);
    throw error;
  }
}

export async function inactivateGastronomia(gastcodi: number): Promise<void> {
  return cambiarEstadoGastronomia(gastcodi, 0);
}

export async function debugGastronomiaEndpoint(): Promise<void> {
  try {
    const minimalTest = {
      gastnomb: "Test básico",
      gastdesc: "Descripción de prueba"
    };
    
    console.log("Enviando objeto mínimo de prueba:", minimalTest);
    
    const response = await fetch("/api/v1/gastronomia/crearGastronomia", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(minimalTest),
    });
    
    console.log("Status de respuesta:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error completo:", errorText);
    } else {
      const data = await response.json();
      console.log("Respuesta exitosa:", data);
    }
  } catch (error) {
    console.error("Error en depuración:", error);
  }
}