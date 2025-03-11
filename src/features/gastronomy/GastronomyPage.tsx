import React, { useState, useEffect } from "react";
import GastronomyComponent from "./components/GastronomyComponent";
import { useAuth } from "../../contexts/AuthContext";

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
  tiponomb: string | null;
  tiponombStr?: any;
}

interface Calificacion {
  calicodi: number | null;
  califech: string | null;
  caliuser: User;
  tipocodi: TipoCalificacion;
  caliobse: string | null;
  gastcodi: Gastronomia;
  promedio?: number;
}

interface Gastronomia {
  gastcodi: number;
  gastnomb: string | null;
  gastdesc: string | null;
  gastimag: string | null;
  gastface: string | null;
  gasturlx: string | null;
  gastinst: string | null;
  gastesta: number | null;
  gastestaStr: string | null;
}

interface GastronomiaCalificacion {
  gacacodi: number | null;
  calicodi: Calificacion;
  gastcodi: Gastronomia;
}

interface RestaurantData {
  gastcodi: number;
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
  const [userRatings, setUserRatings] = useState<number[]>([]);
  const { user } = useAuth();

  const fetchUserRatings = async (documento: number) => {
    try {
      const response = await fetch("/api/api/v1/calificacion/listaCalificacionByDocumento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caliuser: { documento } }),
      });
      
      if (!response.ok) {
        console.error("Error al obtener calificaciones del usuario:", response.status);
        return [];
      }
      
      const text = await response.text();
      if (!text) return [];
      
      try {
        const data = JSON.parse(text);
        return data.map((item: any) => item.gastcodi.gastcodi);
      } catch (err) {
        console.error("Error al parsear calificaciones:", err);
        return [];
      }
    } catch (err) {
      console.error("Error en fetchUserRatings:", err);
      return [];
    }
  };

  const submitRating = async (gastcodi: number, rating: number, comment: string) => {
    if (!user?.documento) {
      alert("Necesitas iniciar sesión para calificar");
      return false;
    }

    try {
      const response = await fetch("/api/api/v1/calificacion/crearCalificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caliuser: { documento: user.documento },
          tipocodi: { tipocodi: rating },
          caliobse: comment,
          gastcodi: { gastcodi }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al enviar calificación: ${response.status}`);
      }

      setUserRatings(prev => [...prev, gastcodi]);
      
      await fetchPromedioAndUpdateRestaurant(gastcodi);
      
      return true;
    } catch (err) {
      console.error("Error al enviar calificación:", err);
      return false;
    }
  };

  const fetchPromedioAndUpdateRestaurant = async (gastcodi: number) => {
    try {
      const newRating = await fetchPromedioCalificacion(gastcodi);
      setRestaurants(prevRestaurants =>
        prevRestaurants.map(r => 
          r.gastcodi === gastcodi ? { ...r, rating: newRating } : r
        )
      );
    } catch (err) {
      console.error("Error al actualizar promedio:", err);
    }
  };

  const fetchPromedioCalificacion = async (
    gastcodi: number
  ): Promise<number> => {
    try {
      const response = await fetch(
        "/api/api/v1/calificacion/getPromedioCalificacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gastcodi }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const text = await response.text();
      if (!text || text.trim() === "") {
        console.log(`Respuesta vacía para gastcodi ${gastcodi}`);
        return 0;
      }

      try {
        const data = JSON.parse(text);
        return data.promedio ?? 0;
      } catch (parseError) {
        console.error(
          `Error al parsear respuesta para gastcodi ${gastcodi}:`,
          text
        );
        return 0;
      }
    } catch (err) {
      console.error("Error al cargar promedio:", err);
      return 0;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        
        await fetchRestaurants();
        
        if (user?.documento) {
          const userRatedItems = await fetchUserRatings(user.documento);
          setUserRatings(userRatedItems);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        "/api/api/v1/gastronomia/consultaAllGastronomia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gastesta: 1 }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener gastronomía: ${response.status}`);
      }

      const gastronomiaData: GastronomiaCalificacion[] = await response.json();
      console.log("Datos recibidos de gastronomía:", gastronomiaData);

      const uniqueData = gastronomiaData.reduce<GastronomiaCalificacion[]>(
        (acc, current) => {
          if (
            !acc.some(
              (item) => item.gastcodi.gastcodi === current.gastcodi.gastcodi
            )
          ) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      const defaultLocalImage = "src/assets/images/Gastronomia.jpg";

      const loadedData: RestaurantData[] = await Promise.all(
        uniqueData.map(async (item) => {
          const ratingNum = await fetchPromedioCalificacion(
            item.gastcodi.gastcodi
          );

          let imageArray: string[] = [];
          if (item.gastcodi.gastimag) {
            if (item.gastcodi.gastimag.includes(",")) {
              imageArray = item.gastcodi.gastimag.split(",");
            } else {
              imageArray = [item.gastcodi.gastimag];
            }
            if (!imageArray[0].startsWith("http")) {
              imageArray = [defaultLocalImage];
            }
          } else {
            imageArray = [defaultLocalImage];
          }

          return {
            gastcodi: item.gastcodi.gastcodi,
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
        })
      );

      setRestaurants(loadedData);
    } catch (err) {
      console.error("Error al cargar gastronomía:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar gastronomía"
      );
    }
  };

  const fallbackRestaurants = [
    {
      gastcodi: 0,
      images: [
        "https://via.placeholder.com/400x300/cccccc/666666?text=Cargando...",
      ],
      name: "Cargando restaurantes...",
      rating: 5,
      cuisine: "Gastronomía local",
      hours: "Abierto ahora",
      summary: "Por favor espere mientras cargamos la información.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
    },
  ];

  return (
    <div className="ml-24 p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-white w-full">
        Gastronomía Candelaria Valle
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center w-full py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {!isLoading && !error && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <GastronomyComponent
              key={restaurant.gastcodi}
              gastcodi={restaurant.gastcodi}
              images={restaurant.images}
              name={restaurant.name}
              rating={restaurant.rating}
              cuisine={restaurant.cuisine}
              hours={restaurant.hours}
              summary={restaurant.summary}
              facebookUrl={restaurant.facebookUrl}
              xUrl={restaurant.xUrl}
              instagramUrl={restaurant.instagramUrl}
              userDocumento={user?.documento || null}
              alreadyRated={userRatings.includes(restaurant.gastcodi)}
              onSubmitRating={submitRating}
            />
          ))
        ) : isLoading ? null : error ? (
          fallbackRestaurants.map((restaurant) => (
            <GastronomyComponent
              key={restaurant.gastcodi}
              gastcodi={restaurant.gastcodi}
              images={restaurant.images}
              name={restaurant.name}
              rating={restaurant.rating}
              cuisine={restaurant.cuisine}
              hours={restaurant.hours}
              summary={restaurant.summary}
              facebookUrl={restaurant.facebookUrl}
              xUrl={restaurant.xUrl}
              instagramUrl={restaurant.instagramUrl}
              userDocumento={null}
              alreadyRated={false}
              onSubmitRating={() => Promise.resolve(false)}
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