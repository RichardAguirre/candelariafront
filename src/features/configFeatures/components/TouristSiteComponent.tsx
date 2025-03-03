import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

interface UbicacionOption {
  value: number;
  label: string;
}

interface SitioTuristico {
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

interface SitioTuristicoFormData {
  turinomb: string;
  turidire: string;
  ubiccodiValue: number;
  turiface: string;
  turiurlx: string;
  turiinst: string;
}

const SitioTuristicoManager: React.FC = () => {
  const [sitios, setSitios] = useState<SitioTuristico[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedSitio, setSelectedSitio] = useState<SitioTuristico | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<SitioTuristicoFormData>();

  useEffect(() => {
    fetchSitiosTuristicos();
    fetchUbicaciones();
  }, []);

  const fetchSitiosTuristicos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/api/v1/sitioTuristico/consultaAllSitioTuristico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ turiesta: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Error al cargar sitios turísticos: ${response.status}`);
      }

      const data = await response.json();
      setSitios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      console.error('Error al cargar sitios turísticos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUbicaciones = async () => {
    try {
      const response = await fetch('/api/api/v1/ubicacion/consultaAllUbicacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error al cargar ubicaciones: ${response.status}`);
      }

      const data = await response.json();
      const options = data.map((ubicacion: Ubicacion) => ({
        value: ubicacion.ubiccodi,
        label: ubicacion.ubicnomb
      }));
      setUbicaciones(options);
    } catch (err) {
      console.error('Error al cargar ubicaciones:', err);
    }
  };

  const createSitioTuristico = async (data: SitioTuristicoFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const imageUrlsString = imageUrls.filter(url => url.trim() !== '').join(',');
      
      const response = await fetch('/api/api/v1/sitioTuristico/crearSitioTuristico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      setSuccess('Sitio turístico creado con éxito');
      setMode('list');
      fetchSitiosTuristicos();
      reset();
      setImageUrls(['']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el sitio turístico');
      console.error('Error al crear sitio turístico:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSitioTuristico = async (data: SitioTuristicoFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!selectedSitio) {
        throw new Error('No se ha seleccionado un sitio para editar');
      }

      const imageUrlsString = imageUrls.filter(url => url.trim() !== '').join(',');
      
      const response = await fetch('/api/api/v1/sitioTuristico/modificarSitioTuristico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

      setSuccess('Sitio turístico actualizado con éxito');
      setMode('list');
      fetchSitiosTuristicos();
      setSelectedSitio(null);
      reset();
      setImageUrls(['']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el sitio turístico');
      console.error('Error al actualizar sitio turístico:', err);
    } finally {
      setLoading(false);
    }
  };

  const inactivateSitioTuristico = async (turicodi: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/api/v1/sitioTuristico/inactivarSitioTuristico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ turicodi }),
      });

      if (!response.ok) {
        throw new Error(`Error al inactivar sitio turístico: ${response.status}`);
      }

      setSuccess('Sitio turístico inactivado con éxito');
      fetchSitiosTuristicos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al inactivar el sitio turístico');
      console.error('Error al inactivar sitio turístico:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sitio: SitioTuristico) => {
    setSelectedSitio(sitio);
    
    setValue('turinomb', sitio.turinomb);
    setValue('turidire', sitio.turidire);
    setValue('ubiccodiValue', sitio.ubiccodi.ubiccodi);
    setValue('turiface', sitio.turiface || '');
    setValue('turiurlx', sitio.turiurlx || '');
    setValue('turiinst', sitio.turiinst || '');
    
    if (sitio.turiimag) {
      const urls = sitio.turiimag.split(',');
      setImageUrls(urls.length > 0 ? urls : ['']);
    } else {
      setImageUrls(['']);
    }
    
    setMode('edit');
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const renderForm = () => {
    const onSubmit = mode === 'create' ? createSitioTuristico : updateSitioTuristico;
    
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'create' ? 'Crear Nuevo Sitio Turístico' : 'Editar Sitio Turístico'}
        </h2>
        
        {/* Nombre */}
        <div>
          <label className="block text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            {...register('turinomb', { required: 'El nombre es requerido' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nombre del sitio turístico"
          />
          {errors.turinomb && <p className="text-red-500 text-sm">{errors.turinomb.message}</p>}
        </div>
        
        {/* Dirección */}
        <div>
          <label className="block text-gray-700 mb-1">Dirección/Descripción *</label>
          <textarea
            {...register('turidire', { required: 'La dirección es requerida' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Dirección o descripción breve del sitio"
          />
          {errors.turidire && <p className="text-red-500 text-sm">{errors.turidire.message}</p>}
        </div>
        
        {/* Ubicación */}
        <div>
          <label className="block text-gray-700 mb-1">Ubicación *</label>
          <select
            {...register('ubiccodiValue', { 
              required: 'La ubicación es requerida',
              valueAsNumber: true
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Seleccione una ubicación</option>
            {ubicaciones.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.ubiccodiValue && <p className="text-red-500 text-sm">{errors.ubiccodiValue.message}</p>}
        </div>
        
        {/* URLs de imágenes */}
        <div>
          <label className="block text-gray-700 mb-1">URLs de Imágenes</label>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="URL de la imagen"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                disabled={imageUrls.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrlField}
            className="mt-1 text-purple-600 hover:text-purple-800 text-sm"
          >
            + Agregar otra imagen
          </button>
        </div>
        
        {/* Redes Sociales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Facebook */}
          <div>
            <label className="block text-gray-700 mb-1">Facebook URL</label>
            <input
              type="text"
              {...register('turiface')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="URL de Facebook"
            />
          </div>
          
          {/* Twitter/X */}
          <div>
            <label className="block text-gray-700 mb-1">Twitter/X URL</label>
            <input
              type="text"
              {...register('turiurlx')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="URL de Twitter/X"
            />
          </div>
          
          {/* Instagram */}
          <div>
            <label className="block text-gray-700 mb-1">Instagram URL</label>
            <input
              type="text"
              {...register('turiinst')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="URL de Instagram"
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => {
              setMode('list');
              setSelectedSitio(null);
              reset();
              setImageUrls(['']);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            disabled={loading}
          >
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    );
  };

  const renderSitiosList = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sitios Turísticos</h2>
        <button
          onClick={() => {
            setMode('create');
            reset();
            setImageUrls(['']);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Nuevo Sitio Turístico
        </button>
      </div>
      
      {sitios.length === 0 && !loading ? (
        <p className="text-gray-500 text-center py-4">No hay sitios turísticos registrados</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sitios.map((sitio) => (
                <tr key={sitio.turicodi} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{sitio.turinomb}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{sitio.turidire}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sitio.ubiccodi.ubicnomb}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sitio.turiesta === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sitio.turiestaStr || (sitio.turiesta === 1 ? 'Activo' : 'Inactivo')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sitio)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Está seguro de que desea inactivar este sitio turístico?')) {
                          inactivateSitioTuristico(sitio.turicodi);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Inactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <div>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{success}</p>
          <button 
            className="float-right text-green-700" 
            onClick={() => setSuccess(null)}
          >
            ✕
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
          <button 
            className="float-right text-red-700" 
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}
      
      {loading && mode === 'list' && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {mode === 'list' ? renderSitiosList() : renderForm()}
    </div>
  );
};

export default SitioTuristicoManager;