import React from "react";
import CardComponent from "./components/TouristSitesComponent";


const TouristSitesPage: React.FC = () => {
  const touristSites = [
    {
      images: [
        "https://occidente.co/wp-content/uploads/2018/01/candelaria-1.jpg",
        "https://occidente.co/wp-content/uploads/2018/01/candelaria-4.jpg",
        "https://www.vivepalmira.com/wp-content/uploads/2019/03/image.jpg",
      ],
      title: "Parque Principal",
      description:
        "El parque principal de Candelaria Valle es un lugar de encuentro para los habitantes y visitantes.",
      facebookUrl: "https://www.facebook.com/parqueprincipal",
      xUrl: "https://twitter.com/parqueprincipal",
      instagramUrl: "https://www.instagram.com/parqueprincipal",
      liked: true,
    },
    {
      images: [
        "https://turismovalledelcauca.com/wp-content/uploads/2017/11/Museo-de-la-Cana-de-Azucar-turismovalledelcauca-3.jpg",
        "https://turismovalledelcauca.com/wp-content/uploads/2017/11/Museo-de-la-Cana-de-Azucar-turismovalledelcauca-15.jpg",
        "https://turismovalledelcauca.com/wp-content/uploads/2017/11/Museo-de-la-Cana-de-Azucar-turismovalledelcauca-10.jpg",
      ],
      title: "Museo de la Caña de Azúcar",
      description:
        "El Museo de la Caña de Azúcar es una atracción turística ubicada en la ciudad de Cali, Colombia. Este museo ofrece a los visitantes la oportunidad de conocer la historia y el proceso de producción de uno de los productos más importantes de la región: el azúcar.",
      facebookUrl: "https://www.facebook.com/museodelacana",
      xUrl: "https://twitter.com/museodelacana",
      instagramUrl: "https://www.instagram.com/museodelacana",
      liked: true,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Río Cauca",
      description:
        "El río Cauca es un lugar ideal para actividades recreativas y deportivas.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Reserva Natural",
      description:
        "La reserva natural de Candelaria es un espacio protegido para la conservación de la flora y fauna.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Plaza de Mercado",
      description:
        "La plaza de mercado es un lugar vibrante donde se pueden encontrar productos locales frescos.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Centro Cultural",
      description:
        "El centro cultural de Candelaria ofrece una variedad de eventos y actividades culturales.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Parque de la Salud",
      description:
        "El parque de la salud es un espacio dedicado al bienestar y la actividad física.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
    {
      images: ["url1", "url2", "url3"],
      title: "Mirador de Candelaria",
      description:
        "El mirador de Candelaria ofrece vistas panorámicas impresionantes de la región.",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      liked: false,
    },
  ];

  return (
    <div className="TouristSitesComponent p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Sitios turisticos Candelaria Valle</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {touristSites.map((site, index) => (
          <CardComponent
            key={index}
            images={site.images}
            title={site.title}
            description={site.description}
            facebookUrl={site.facebookUrl}
            xUrl={site.xUrl}
            instagramUrl={site.instagramUrl}
            liked={site.liked}
          />
        ))}
      </div>
    </div>
  );
};

export default TouristSitesPage;