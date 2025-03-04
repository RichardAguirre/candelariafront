import React, { useState, useEffect } from "react";
import GastronomyComponent from "./components/GastronomyComponent";

interface User {
  documento: number | null;
  nombreuno: string | null;
  nombredos: string | null;
  apellidouno: string | null;
  apellidodos: string | null;
  email: string | null;
  fechanac: string | null;
  celular: string | null;
  fechasys: string | null;
}

interface TipoCalificacion {
  tipocodi: number | null;
  tiponomb: string;
}

interface Calificacion {
  calicodi: number;
  califech: string;
  caliuser: User;
  tipocodi: TipoCalificacion;
  caliobse: string;
}

interface Gastronomia {
  gastcodi: number;
  gastnomb: string;
  gastdesc: string;
  gastimag: string;
  gastface: string;
  gasturlx: string;
  gastinst: string;
  gastesta: number;
  gastestaStr: string;
}

interface GastronomiaCalificacion {
  gacacodi: number | null;
  calicodi: Calificacion;
  gastcodi: Gastronomia;
}

interface RestaurantData {
  images: string[];
  name: string;
  rating: number;
  cuisine: string;
  hours: string;
  summary: string;
  facebookUrl: string;
  xUrl: string;
  instagramUrl: string;
}

const GastronomyPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGastronomy = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/api/v1/gastronomia/consultaAllGastronomia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gastesta: 1 }),
        });

        if (!response.ok) {
          throw new Error(`Error al obtener gastronomía: ${response.status}`);
        }

        const gastronomiaData: GastronomiaCalificacion[] = await response.json();
        console.log("Datos recibidos de gastronomía:", gastronomiaData);
        
        const transformedData: RestaurantData[] = gastronomiaData.map(item => {
          let ratingNum = 5;
          try {
            const ratingStr = item.calicodi.tipocodi.tiponomb;
            ratingNum = parseInt(ratingStr, 10);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
              ratingNum = 5;
            }
          } catch (e) {
            console.error("Error al parsear el rating:", e);
          }

          const defaultImage = "https://colombia.gastronomia.com/media/cache/noticia_grande/uploads/noticias/sancocho2.aE9qc3JuUU1jT1NSbHA1ai8vMTQ4OTQ0NDA1OS8.jpg";
          let imageArray: string[] = [];
          
          if (item.gastcodi.gastimag) {
            if (item.gastcodi.gastimag.includes(',')) {
              imageArray = item.gastcodi.gastimag.split(',');
            } else {
              imageArray = [item.gastcodi.gastimag];
            }
          } else {
            imageArray = [defaultImage];
          }

          return {
            images: imageArray,
            name: item.gastcodi.gastnomb || "Sin nombre",
            rating: ratingNum,
            cuisine: item.gastcodi.gastdesc || "Gastronomía local",
            hours: "Abierto ahora",
            summary: item.gastcodi.gastdesc || "Sin descripción",
            facebookUrl: item.gastcodi.gastface || "",
            xUrl: item.gastcodi.gasturlx || "",
            instagramUrl: item.gastcodi.gastinst || "",
          };
        });

        setRestaurants(transformedData);

      } catch (err) {
        console.error("Error al cargar gastronomía:", err);
        setError(err instanceof Error ? err.message : "Error al cargar gastronomía");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGastronomy();
  }, []);


  const fallbackRestaurants = [
    {
      images: ["https://via.placeholder.com/400x300/cccccc/666666?text=Cargando..."],
      name: "Cargando restaurantes...",
      rating: 5,
      cuisine: "Gastronomía local",
      hours: "Abierto ahora",
      summary: "Por favor espere mientras cargamos la información.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
    }
  ];

  return (
    <div className="ml-8 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Gastronomía Candelaria Valle
      </h1>
      
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
        {!isLoading && !error && restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <GastronomyComponent
              key={index}
              images={restaurant.images}
              name={restaurant.name}
              rating={restaurant.rating}
              cuisine={restaurant.cuisine}
              hours={restaurant.hours}
              summary={restaurant.summary}
              facebookUrl={restaurant.facebookUrl}
              xUrl={restaurant.xUrl}
              instagramUrl={restaurant.instagramUrl}
            />
          ))
        ) : isLoading ? (
          null
        ) : error ? (
          fallbackRestaurants.map((restaurant, index) => (
            <GastronomyComponent
              key={index}
              images={restaurant.images}
              name={restaurant.name}
              rating={restaurant.rating}
              cuisine={restaurant.cuisine}
              hours={restaurant.hours}
              summary={restaurant.summary}
              facebookUrl={restaurant.facebookUrl}
              xUrl={restaurant.xUrl}
              instagramUrl={restaurant.instagramUrl}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-white py-12">
            No hay información gastronómica disponible en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default GastronomyPage;