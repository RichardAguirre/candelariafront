import React, { useEffect, useState } from 'react';

interface EventProps {
  eventName: string;
  eventDate: string;
  location: string;
  eventInfo: string;
}

const EventComponent: React.FC<EventProps> = ({ eventName, eventDate, location, eventInfo }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const event = new Date(eventDate);
      const difference = event.getTime() - now.getTime();

      if (difference > 0) {
        const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const renderTimeUnit = (unit: string, label: string) => (
    <div className="flex flex-col items-center">
      <div className="flex space-x-1">
        {unit.split('').map((digit, index) => (
          <div key={index} className="bg-white p-2 rounded shadow">
            <div className="text-xl text-black font-bold">{digit}</div>
          </div>
        ))}
      </div>
      <div className="text-sm text-black mt-1">{label}</div>
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return { dayOfWeek, month, day };
  };

  const { dayOfWeek, month, day } = formatDate(eventDate);

  return (
    <div className="mt-4 flex flex-col items-center p-4 bg-gray-400 rounded shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        {renderTimeUnit(timeLeft.days, 'Días')}
        <div className="text-xl text-black font-bold">:</div>
        {renderTimeUnit(timeLeft.hours, 'Horas')}
        <div className="text-xl text-black font-bold">:</div>
        {renderTimeUnit(timeLeft.minutes, 'Minutos')}
        <div className="text-xl text-black font-bold">:</div>
        {renderTimeUnit(timeLeft.seconds, 'Segundos')}
      </div>
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold">{eventName}</div>
          <div className="text-sm text-gray-600">{location}</div>
        </div>
        <div className="bg-white p-2 rounded shadow flex flex-col items-center">
          <div className="bg-gray-700 text-white p-1 rounded-t w-full text-center">{dayOfWeek}</div>
          <div className="text-lg text-black font-bold">{month}. {day}</div>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        onClick={() => setShowModal(true)}
      >
        Más información
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Información del Evento</h2>
            <p className="text-gray-700 mb-4">{eventInfo}</p>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventComponent;