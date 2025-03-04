import React, { useState } from "react";
import TouristSiteManager from "./components/touristSites/TouristSiteManager";
import EventManager from "./components/activitySites/ActivityManager";
import GastronomyManager from "./components/gastronomySites/GastronomyManager";


const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "eventos" | "sitios" | "gastronomia"
  >("eventos");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Administrar contenido
      </h1>
      <div className="flex border-b border-gray-300 mb-6">
      <button
          className={`px-4 py-2 font-medium ${
            activeTab === "eventos"
              ? "bg-purple-600 text-white rounded-t-lg"
              : "text-gray-200 hover:text-white"
          }`}
          onClick={() => setActiveTab("eventos")}
        >
          Eventos y Actividades
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "sitios"
              ? "bg-purple-600 text-white rounded-t-lg"
              : "text-gray-200 hover:text-white"
          }`}
          onClick={() => setActiveTab("sitios")}
        >
          Sitios Turísticos
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "sitios"
              ? "bg-purple-600 text-white rounded-t-lg"
              : "text-gray-200 hover:text-white"
          }`}
          onClick={() => setActiveTab("gastronomia")}
        >
          Gastronomia
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        {activeTab === "eventos" && <EventManager />}
        {activeTab === "sitios" && <TouristSiteManager />}
        {activeTab === "gastronomia" && <GastronomyManager />}
      </div>
    </div>
  );
};

export default AdminPage;