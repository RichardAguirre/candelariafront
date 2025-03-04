import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

interface Evento {
  evencodi: number;
  evennomb: string;
}

interface Actividad {
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

const ActivityManager: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const { reset, setValue } = useForm();

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/api/v1/actividad/consultaAllActividad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actiesta: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Error al cargar actividades: ${response.status}`);
      }

      const data = await response.json();
      setActividades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      console.error('Error al cargar actividades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    
    setValue('actinomb', actividad.actinomb);
    setValue('actidesc', actividad.actidesc);
    setValue('evencodiValue', actividad.evencodi.evencodi);
    setValue('ubiccodiValue', actividad.ubiccodi.ubiccodi);
    setValue('actifein', actividad.actifein);
    setValue('actifefi', actividad.actifefi);
    setValue('actiface', actividad.actiface || '');
    setValue('actiurlx', actividad.actiurlx || '');
    setValue('actiinst', actividad.actiinst || '');
    
    if (actividad.actiimag) {
      const urls = actividad.actiimag.split(',');
      setImageUrls(urls.length > 0 ? urls : ['']);
    } else {
      setImageUrls(['']);
    }
    
    setMode('edit');
  };

  const renderContent = () => {
    if (mode === 'list') {
      return <ActivityList actividades={actividades} onEdit={handleEdit} />;
    }
    return <ActivityForm mode={mode} setMode={setMode} fetchActividades={fetchActividades} selectedActividad={selectedActividad} imageUrls={imageUrls} setImageUrls={setImageUrls} reset={reset} setValue={setValue} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderContent()}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {success && <p className="text-green-500 text-center mt-4">{success}</p>}
    </div>
  );
};

export default ActivityManager;