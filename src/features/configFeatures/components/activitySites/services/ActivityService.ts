export interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

export interface Evento {
  evencodi: number;
  evennomb: string;
}

export interface Actividad {
  acticodi: number;
  actinomb: string;
  actidesc: string;
  actiimag: string;
  evencodi: Evento;
  ubiccodi: Ubicacion;
  actifein: string;
  actifefi: string;
  actiesta: number;
  actiface: string;
  actiurlx: string;
  actiinst: string;
  actiestaStr?: string;
}

export interface ActividadFormData {
  actinomb: string;
  actidesc: string;
  evencodiValue: number;
  ubiccodiValue: number;
  actifein: string;
  actifefi: string;
  actiface: string;
  actiurlx: string;
  actiinst: string;
}

/**
 * Obtiene todas las actividades según su estado
 * @param estado - Estado de las actividades a consultar (1: activas, 0: inactivas, null: todas)
 */
export async function fetchActividades(
  estado: 1 | 0 | null = 1
): Promise<Actividad[]> {
  if (estado === null) {
    try {
      const [activasResponse, inactivasResponse] = await Promise.all([
        fetch("/api/api/v1/actividad/consultaAllActividad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actiesta: 1 }),
        }),
        fetch("/api/api/v1/actividad/consultaAllActividad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actiesta: 0 }),
        })
      ]);
      
      if (!activasResponse.ok) {
        const errorData = await activasResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar actividades activas: ${activasResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      if (!inactivasResponse.ok) {
        const errorData = await inactivasResponse.json().catch(() => ({}));
        throw new Error(`Error al cargar actividades inactivas: ${inactivasResponse.status} - ${JSON.stringify(errorData)}`);
      }
      
      const [activas, inactivas] = await Promise.all([
        activasResponse.json(),
        inactivasResponse.json()
      ]);
      
      return [...activas, ...inactivas];
    } catch (error) {
      console.error("Error al cargar ambos tipos de actividades:", error);
      throw error;
    }
  }
  
  const response = await fetch("/api/api/v1/actividad/consultaAllActividad", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actiesta: estado }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Error al cargar actividades: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json();
}

export async function fetchEventos(): Promise<Evento[]> {
  const response = await fetch("/api/api/v1/tipoEvento/consultaAllTipoEvento", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Error al cargar eventos: ${response.status}`);
  }
  return response.json();
}

export async function fetchUbicaciones(): Promise<Ubicacion[]> {
  const response = await fetch("/api/api/v1/ubicacion/consultaAllUbicacion", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Error al cargar ubicaciones: ${response.status}`);
  }
  return response.json();
}

export async function createActividad(
  data: ActividadFormData,
  imageUrls: string[]
): Promise<void> {
  try {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString();
    };

    const imageUrlsString = imageUrls
      .filter((url) => url.trim() !== "")
      .join(",");

    const requestBody = {
      actinomb: data.actinomb.trim(),
      actidesc: data.actidesc.trim(),
      actiimag: imageUrlsString,
      evencodi: { evencodi: data.evencodiValue },
      ubiccodi: { ubiccodi: data.ubiccodiValue },
      actifein: formatDate(data.actifein),
      actifefi: formatDate(data.actifefi),
      actiface: (data.actiface || "").trim(),
      actiurlx: (data.actiurlx || "").trim(),
      actiinst: (data.actiinst || "").trim(),
    };

    console.log(
      "Enviando datos al servidor:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch("/api/api/v1/actividad/crearActividad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Respuesta raw del servidor:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }
      throw new Error(
        `Error al crear actividad: ${response.status} - ${JSON.stringify(
          errorData
        )}`
      );
    }

    console.log("Actividad creada exitosamente");
  } catch (error) {
    console.error("Error en createActividad:", error);
    throw error;
  }
}

export async function updateActividad(
  data: ActividadFormData,
  selectedActividad: Actividad,
  imageUrls: string[]
): Promise<void> {
  if (!selectedActividad) {
    throw new Error("No se ha seleccionado una actividad para editar");
  }

  const formatDate = (dateString: string) => {
    if (dateString.length === 16) {
      return dateString + ":00";
    }
    return dateString;
  };

  const imageUrlsString = imageUrls
    .filter((url) => url.trim() !== "")
    .join(",");

  const requestBody = {
    actinomb: data.actinomb.trim(),
    actidesc: data.actidesc.trim(),
    actiimag: imageUrlsString,
    evencodi: { evencodi: data.evencodiValue },
    ubiccodi: { ubiccodi: data.ubiccodiValue },
    actifein: formatDate(data.actifein),
    actifefi: formatDate(data.actifefi),
    actiface: data.actiface?.trim() || "",
    actiurlx: data.actiurlx?.trim() || "",
    actiinst: data.actiinst?.trim() || "",
    acticodi: selectedActividad.acticodi,
  };

  console.log("Enviando datos de actualización:", JSON.stringify(requestBody, null, 2));

  const response = await fetch("/api/api/v1/actividad/modificarActividad", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const rawResponse = await response.text();
  console.log("Respuesta cruda del servidor:", rawResponse);

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = JSON.parse(rawResponse);
    } catch {
    }
    throw new Error(
      `Error al actualizar la actividad: ${
        response.status
      } - ${JSON.stringify(errorData)}`
    );
  }

  console.log("Actividad actualizada con éxito");
}


/**
 * Nuevo Nombre: inactivateActividad
 * @param acticodi - Código de la actividad
 * @param estado - Estado deseado (1: activo, 0: inactivo)
 */
export async function cambiarEstadoActividad(
  acticodi: number,
  estado: 0 | 1
): Promise<void> {
  const response = await fetch("/api/api/v1/actividad/cambiarEstadoActividad", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      acticodi,
      actiesta: estado,
    }),
  });

  if (!response.ok) {
    const accion = estado === 1 ? "activar" : "inactivar";
    throw new Error(`Error al ${accion} actividad: ${response.status}`);
  }
}
