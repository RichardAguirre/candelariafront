import React, { useState, useEffect } from 'react';
import EventComponent from './components/EventComponent';

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
  actiestaStr: string;
}

interface EventData {
  eventName: string;
  eventDate: string;
  location: string;
  eventInfo: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/api/v1/actividad/consultaAllActividad", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ actiesta: 1 }),
        });

        if (!response.ok) {
          throw new Error(`Error al obtener eventos: ${response.status}`);
        }

        const actividades: Actividad[] = await response.json();
        
        const transformedEvents: EventData[] = actividades.map(actividad => ({
          eventName: actividad.actinomb,
          eventDate: actividad.actifein,
          location: actividad.ubiccodi.ubicnomb,
          eventInfo: actividad.actidesc
        }));

        setEvents(transformedEvents);

      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError(err instanceof Error ? err.message : "Error al cargar eventos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fallbackEvents = [
    {
      eventName: 'Cargando eventos...',
      eventDate: new Date().toISOString(),
      location: 'Candelaria Valle',
      eventInfo: 'Por favor espere mientras cargamos los eventos.',
    }
  ];

  return (
    <div className="ml-4 p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Eventos y actividades Candelaria Valle</h1>
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!isLoading && !error && events.length > 0 ? (
          events.map((event, index) => (
            <EventComponent
              key={index}
              eventName={event.eventName}
              eventDate={event.eventDate}
              location={event.location}
              eventInfo={event.eventInfo}
            />
          ))
        ) : isLoading ? (
          null
        ) : error ? (
          fallbackEvents.map((event, index) => (
            <EventComponent
              key={index}
              eventName={event.eventName}
              eventDate={event.eventDate}
              location={event.location}
              eventInfo={event.eventInfo}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-white py-12">
            No hay eventos disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;