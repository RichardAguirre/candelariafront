import React from "react";

const DashboardPage: React.FC = () => {
  const handleClick = () => {
    alert("Estamos en desarrollo");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-green-200 to-brown-500 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Candelaria Valle.</h1>
        <p className="text-xl mb-8">Encuentra información aquí.</p>
        <button
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Botón Nuevo
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;