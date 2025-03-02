import React from "react";
import GastronomyComponent from "./components/GastronomyComponent";

const GastronomyPage: React.FC = () => {
  const restaurants = [
    {
      images: [
        "https://plus.unsplash.com/premium_photo-1670984940113-f3aa1cd1309a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudGVzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Ritual Mesa Y Mística",
      rating: 4,
      cuisine: "Fusión, Colombiana",
      hours: "Abierto ahora",
      summary: '"10 de 10" "Increíble experiencia 10/10"',
      facebookUrl: "https://www.facebook.com/ritualmesaymistica",
      xUrl: "https://twitter.com/ritualmesaymistica",
      instagramUrl: "https://www.instagram.com/ritualmesaymistica",
    },
    {
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudGVzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "La Parrilla de Juancho",
      rating: 5,
      cuisine: "Parrilla, Colombiana",
      hours: "Abierto ahora",
      summary: '"Excelente servicio y comida deliciosa"',
      facebookUrl: "https://www.facebook.com/laparrilladejuancho",
      xUrl: "https://twitter.com/laparrilladejuancho",
      instagramUrl: "https://www.instagram.com/laparrilladejuancho",
    },
    {
      images: [
        "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudGVzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "El Sazón de la Abuela",
      rating: 4,
      cuisine: "Comida Casera, Colombiana",
      hours: "Abierto ahora",
      summary: '"Sabor auténtico y ambiente acogedor"',
      facebookUrl: "https://www.facebook.com/elsazondelaabuela",
      xUrl: "https://twitter.com/elsazondelaabuela",
      instagramUrl: "https://www.instagram.com/elsazondelaabuela",
    },
    {
      images: [
        "https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudGVzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Pizzería La Italiana",
      rating: 5,
      cuisine: "Italiana, Pizzas",
      hours: "Abierto ahora",
      summary: '"Las mejores pizzas de la región"',
      facebookUrl: "https://www.facebook.com/pizzerialaitaliana",
      xUrl: "https://twitter.com/pizzerialaitaliana",
      instagramUrl: "https://www.instagram.com/pizzerialaitaliana",
    },
    {
      images: ["url1", "url2", "url3"],
      name: "Mariscos del Pacífico",
      rating: 4,
      cuisine: "Mariscos, Colombiana",
      hours: "Abierto ahora",
      summary: '"Frescos y deliciosos mariscos"',
      facebookUrl: "https://www.facebook.com/mariscosdelpacifico",
      xUrl: "https://twitter.com/mariscosdelpacifico",
      instagramUrl: "https://www.instagram.com/mariscosdelpacifico",
    },
    {
      images: [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1956&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Café Aroma y Sabor",
      rating: 5,
      cuisine: "Café, Postres",
      hours: "Abierto ahora",
      summary: '"El mejor café y postres exquisitos"',
      facebookUrl: "https://www.facebook.com/cafearomaysabor",
      xUrl: "https://twitter.com/cafearomaysabor",
      instagramUrl: "https://www.instagram.com/cafearomaysabor",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Gastronomía Candelaria Valle
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default GastronomyPage;
