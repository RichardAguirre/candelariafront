import React from "react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center w-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">
          Candelaria Valle.
        </h1>
        <p className="text-xl mb-8 text-white">Encuentra información aquí.</p>
      </div>

      <div className="ml-20 mr-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/gastronomy"
          className="bg-white bg-opacity-75 p-4 rounded-lg shadow-lg text-center hover:bg-opacity-90 transition duration-300"
        >
          <img
            src="/src/assets/images/Gastronomia.jpg"
            alt="Gastronomía"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold text-purple-600 hover:text-purple-800">
            Gastronomía
          </p>
        </Link>

        <Link
          to="/events"
          className="bg-white bg-opacity-75 p-4 rounded-lg shadow-lg text-center hover:bg-opacity-90 transition duration-300"
        >
          <img
            src="/src/assets/images/Eventos.jpg"
            alt="Eventos"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold text-purple-600 hover:text-purple-800">
            Eventos
          </p>
        </Link>

        <Link
          to="/touristSites"
          className="bg-white bg-opacity-75 p-4 rounded-lg shadow-lg text-center hover:bg-opacity-90 transition duration-300"
        >
          <img
            src="/src/assets/images/SitioTuristico.jpg"
            alt="Sitios Turísticos"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold text-purple-600 hover:text-purple-800">
            Sitios Turísticos
          </p>
        </Link>
      </div>

      <div className="mt-8 ml-30 mr-30 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/adminpage"
          className="bg-white bg-opacity-75 p-4 rounded-lg shadow-lg text-center hover:bg-opacity-90 transition duration-300"
        >
          <p className="text-xl font-semibold text-blue-600 hover:text-blue-800">
            Administrar Contenido
          </p>
        </Link>
        <Link
          to="/userManagement"
          className="bg-white bg-opacity-75 p-4 rounded-lg shadow-lg text-center hover:bg-opacity-90 transition duration-300"
        >
          <p className="text-xl font-semibold text-blue-600 hover:text-blue-800">
            Administrar Usuarios
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;