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
  
  export async function fetchSitiosTuristicos(): Promise<SitioTuristico[]> {
    const response = await fetch('/api/api/v1/sitioTuristico/consultaAllSitioTuristico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turiesta: 1 }),
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
  
  export async function inactivateSitioTuristico(turicodi: number): Promise<void> {
    const response = await fetch('/api/api/v1/sitioTuristico/inactivarSitioTuristico', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turicodi }),
    });
    if (!response.ok) {
      throw new Error(`Error al inactivar sitio turístico: ${response.status}`);
    }
  }