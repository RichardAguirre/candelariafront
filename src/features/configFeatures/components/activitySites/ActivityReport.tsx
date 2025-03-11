import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Actividad } from "./services/ActivityService";
import logoCandelaria from "../../../../assets/images/Candelaria-logo.png";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const generatePDF = async (elementId: string) => {
  const backupStyles: HTMLStyleElement[] = [];
  
  const emergencyStyle = document.createElement('style');
  emergencyStyle.innerHTML = `
    *:not(svg):not(path):not(g) {
      color: #000000 !important;
      background-color: #ffffff !important;
      border-color: #cccccc !important;
      fill: #000000 !important;
      stroke: #000000 !important;
    }
    
    .bg-gray-100, .bg-gray-50, .bg-white, .bg-green-100, .bg-red-100 {
      background-color: #ffffff !important;
    }
    
    .text-gray-700, .text-gray-600, .text-black, .text-green-800, .text-red-800 {
      color: #000000 !important;
    }
    
    .border, .border-b, .border-t, .border-l, .border-r {
      border-color: #cccccc !important;
    }
  `;
  document.head.appendChild(emergencyStyle);
  backupStyles.push(emergencyStyle);

  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Elemento no encontrado`);

    element.style.color = '#000000';
    element.style.backgroundColor = '#ffffff';
    
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.visibility = 'hidden';
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: "#FFFFFF",
      windowHeight: clone.scrollHeight,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    const imgProps = pdf.getImageProperties(imageData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const scaledWidth = imgProps.width * ratio;
    const scaledHeight = imgProps.height * ratio;

    pdf.addImage(imageData, "PNG", 
      (pageWidth - scaledWidth) / 2,
      (pageHeight - scaledHeight) / 2,
      scaledWidth,
      scaledHeight
    );
    
    pdf.save("ReporteCandelaria.pdf");
    document.body.removeChild(clone);
  } catch (error) {
    console.error("Error generando PDF:", error);
    throw error;
  } finally {
    backupStyles.forEach(style => document.head.removeChild(style));
  }
};

interface ActivityReportProps {
  actividades: Actividad[];
  onClose: () => void;
}

const ActivityReport: React.FC<ActivityReportProps> = ({
  actividades,
  onClose,
}) => {
  const { user } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    import("../../../../assets/images/Candelaria-logo.png")
      .then((module) => setLogoUrl(module.default))
      .catch(() => {
        setLogoUrl("https://via.placeholder.com/150x80?text=Logo+Candelaria");
      });
  }, []);

  const activeEvents = actividades.filter((act) => act.actiesta === 1).length;
  const inactiveEvents = actividades.length - activeEvents;

  const chartData = [
    { name: "Eventos Activos", value: activeEvents, color: "#4CAF50" },
    { name: "Eventos Inactivos", value: inactiveEvents, color: "#F44336" },
  ];

  const locationGroups = actividades.reduce((acc, act) => {
    const loc = act.ubiccodi?.ubicnomb || "Desconocida";
    if (!acc[loc]) acc[loc] = 0;
    acc[loc]++;
    return acc;
  }, {} as Record<string, number>);
  const locationData = Object.entries(locationGroups).map(([name, count]) => ({
    name,
    count,
  }));

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Fecha no disponible";
    try {
      return new Date(dateStr).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await generatePDF("fullReportContent");
    } catch (error) {
      console.error("Error exportando PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto py-4 print:bg-white print:p-0">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4 print:shadow-none print:max-h-none print:overflow-visible print:m-0">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2">
          <h2 className="text-2xl font-bold text-black">
            Vista Previa del Reporte
          </h2>
          <div className="flex space-x-2">
            <button
              disabled={isExporting}
              onClick={handleExportPDF}
              className={`px-4 py-2 rounded ${
                isExporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isExporting ? "Generando PDF..." : "Exportar como PDF"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div
          id="fullReportContent"
          ref={reportRef}
          className="bg-white mx-auto"
          style={{
            width: "287mm",
            minHeight: "190mm",
            padding: "10mm",
            boxSizing: "border-box",
            border: "1px solid #e2e8f0",
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-6">
            <img
              src={logoUrl}
              alt="Logo Candelaria"
              className="h-20 w-auto"
              style={{ maxWidth: "100px" }}
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                REPORTE DE EVENTOS CANDELARIA VALLE
              </h1>
              <p className="text-gray-600">
                Generado el {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
              Resumen de Eventos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-3 text-center text-black">
                  Estado de Eventos
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border p-4 rounded">
                <h3 className="font-semibold text-black mb-3">
                  Eventos por Ubicación
                </h3>
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-gray-700 text-left">
                        Ubicación
                      </th>
                      <th className="py-2 px-4 text-gray-700 text-right">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationData.map((loc, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-2 text-gray-700 px-4">{loc.name}</td>
                        <td className="py-2 text-gray-700 px-4 text-right">
                          {loc.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-700">
                  REPORTE DE EVENTOS CANDELARIA VALLE - Listado
                </h2>
                <p className="text-gray-600 text-sm">
                  Fecha: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="border-b pb-2 mb-4"></div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-700">
              Listado de Eventos
            </h3>
            <div>
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Nombre
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Descripción
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Evento
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Ubicación
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Fecha Inicio
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Fecha Fin
                    </th>
                    <th className="py-2 px-3 border text-gray-600 text-left text-sm">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.length > 0 ? (
                    actividades.map((activity, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-2 px-3 text-black border text-xs">
                          {activity.actinomb}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          {activity.actidesc?.length > 30
                            ? `${activity.actidesc.substring(0, 30)}...`
                            : activity.actidesc}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          {activity.evencodi?.evennomb || "No disponible"}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          {activity.ubiccodi?.ubicnomb || "No disponible"}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          {formatDate(activity.actifein)}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          {formatDate(activity.actifefi)}
                        </td>
                        <td className="py-2 px-3 text-black border text-xs">
                          <span
                            style={{
                              backgroundColor:
                                activity.actiesta === 1 ? "#dcfce7" : "#fee2e2",
                              color:
                                activity.actiesta === 1 ? "#166534" : "#991b1b",
                            }}
                            className="px-2 py-1 rounded-full text-xs"
                          >
                            {activity.actiesta === 1 ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center border">
                        No hay actividades disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} className="text-center pt-2 text-xs">
                      <p className="text-gray-500">
                        © {new Date().getFullYear()} - Candelaria VIVA
                      </p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            <p>Reporte generado el {new Date().toLocaleDateString()}</p>
            <p>© {new Date().getFullYear()} - Candelaria VIVA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityReport;
