import React, { useState } from "react";
import SitioTuristicoManager from "./components/TouristSiteComponent";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "sitios" | "eventos" | "gastronomia"
  >("sitios");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Panel de Administración
      </h1>
      <div className="flex border-b border-gray-300 mb-6">
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
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === "sitios" && <SitioTuristicoManager />}
      </div>
    </div>
  );
};

export default AdminPage;
