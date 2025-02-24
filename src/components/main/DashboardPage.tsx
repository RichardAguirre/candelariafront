import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b from-green-200 to-brown-500 w-screen h-screen flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Candelari Valle.</h1>
        <p className="text-xl mb-8">Encuentra información aquí.</p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Boton Nuevo
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;