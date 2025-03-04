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

export async function fetchActividades(): Promise<Actividad[]> {
  const response = await fetch("/api/api/v1/actividad/consultaAllActividad", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actiesta: 1 }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error al cargar actividades: ${response.status} - ${JSON.stringify(errorData)}`);
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
      actiinst: (data.actiinst || "").trim()
    };
    
    console.log("Enviando datos al servidor:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("/api/api/v1/actividad/crearActividad", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
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
      throw new Error(`Error al crear actividad: ${response.status} - ${JSON.stringify(errorData)}`);
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
  
  const imageUrlsString = imageUrls
    .filter((url) => url.trim() !== "")
    .join(",");
  
  const requestBody = {
    acticodi: selectedActividad.acticodi,
    actinomb: data.actinomb,
    actidesc: data.actidesc,
    actiimag: imageUrlsString,
    evencodi: { evencodi: data.evencodiValue },
    ubiccodi: { ubiccodi: data.ubiccodiValue },
    actifein: data.actifein,
    actifefi: data.actifefi,
    actiface: data.actiface || "",
    actiurlx: data.actiurlx || "",
    actiinst: data.actiinst || "",
  };
  
  console.log("Enviando datos de actualización:", requestBody);

  const response = await fetch("/api/api/v1/actividad/modificarActividad", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error al actualizar actividad: ${response.status} - ${JSON.stringify(errorData)}`);
  }
}

export async function inactivateActividad(acticodi: number): Promise<void> {
  const response = await fetch("/api/api/v1/actividad/inactivarActividad", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acticodi }),
  });
  if (!response.ok) {
    throw new Error(`Error al inactivar actividad: ${response.status}`);
  }
}
