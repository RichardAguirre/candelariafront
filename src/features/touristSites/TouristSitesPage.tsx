import React, { useState, useEffect } from "react";
import CardComponent from "./components/TouristSitesComponent";

interface Ubicacion {
  ubiccodi: number;
  ubicnomb: string;
}

interface SitioTuristico {
  turicodi: number;
  turinomb: string;
  turidire: string;
  turiimag: string;
  ubiccodi: Ubicacion;
  turiesta: number;
  turiestaStr: string;
  turilike: number;
  turiface: string;
  turiurlx: string;
  turiinst: string;
}

interface TouristSiteData {
  id: number;
  images: string[];
  title: string;
  description: string;
  facebookUrl: string;
  xUrl: string;
  instagramUrl: string;
  liked: boolean;
}

const TouristSitesPage: React.FC = () => {
  const [touristSites, setTouristSites] = useState<TouristSiteData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTouristSites();
  }, []);

  const fetchTouristSites = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/api/v1/sitioTuristico/consultaAllSitioTuristico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ turiesta: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Error al obtener sitios turísticos: ${response.status}`);
      }

      const sitios: SitioTuristico[] = await response.json();
      console.log("Sitios turísticos recibidos:", sitios);
      
      const transformedSites: TouristSiteData[] = sitios.map(sitio => {
        const defaultImage = "https://media.viajando.travel/p/ba9022857b0eefe77666f99084a6e766/adjuntos/236/imagenes/000/683/0000683458/1200x0/smart/candelaria-valle-del-caucajpg.jpg";
        let imageArray: string[];
        
        if (sitio.turiimag) {
          if (sitio.turiimag.includes(',')) {
            imageArray = sitio.turiimag.split(',');
          } else {
            imageArray = [sitio.turiimag];
          }
        } else {
          imageArray = [defaultImage];
        }

        return {
          id: sitio.turicodi,
          images: imageArray,
          title: sitio.turinomb || "Sin nombre",
          description: sitio.turidire || "Sin descripción",
          facebookUrl: sitio.turiface || "",
          xUrl: sitio.turiurlx || "",
          instagramUrl: sitio.turiinst || "",
          liked: sitio.turilike === 1,
        };
      });

      setTouristSites(transformedSites);

    } catch (err) {
      console.error("Error al cargar sitios turísticos:", err);
      setError(err instanceof Error ? err.message : "Error al cargar sitios turísticos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async (id: number, liked: boolean) => {
    try {
      const response = await fetch("/api/api/v1/sitioTuristico/likeSitioTuristico", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          turilike: liked ? 1 : 0, 
          turicodi: id 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar like: ${response.status}`);
      }

      console.log(`Like actualizado para el sitio ${id}. Nuevo estado: ${liked ? 'Me gusta' : 'No me gusta'}`);
      

      setTouristSites(prevSites => 
        prevSites.map(site => 
          site.id === id ? { ...site, liked } : site
        )
      );

    } catch (error) {
      console.error("Error al actualizar el like:", error);
      throw error;
    }
  };

  const fallbackSites = [
    {
      id: 0,
      images: ["https://st2.depositphotos.com/2815589/5747/v/450/depositphotos_57477791-stock-illustration-loading-bar-with-a-doodle.jpg"],
      title: "Cargando sitios...",
      description: "Por favor espere mientras cargamos la información.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    }
  ];

  return (
    <div className="TouristSitesComponent ml-10 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Sitios turísticos Candelaria Valle</h1>
      
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isLoading && !error && touristSites.length > 0 ? (
          touristSites.map((site) => (
            <CardComponent
              key={site.id}
              id={site.id}
              images={site.images}
              title={site.title}
              description={site.description}
              facebookUrl={site.facebookUrl}
              xUrl={site.xUrl}
              instagramUrl={site.instagramUrl}
              liked={site.liked}
              onLikeToggle={handleLikeToggle}
            />
          ))
        ) : isLoading ? (
          null
        ) : error ? (
          fallbackSites.map((site) => (
            <CardComponent
              key={site.id}
              id={site.id}
              images={site.images}
              title={site.title}
              description={site.description}
              facebookUrl={site.facebookUrl}
              xUrl={site.xUrl}
              instagramUrl={site.instagramUrl}
              liked={site.liked}
              onLikeToggle={() => Promise.resolve()}
            />
          ))
        ) : (
          <div className="col-span-4 text-center text-white py-12">
            No hay sitios turísticos disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristSitesPage;