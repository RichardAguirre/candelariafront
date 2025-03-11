import React from "react";

interface HotelsComponentProps {
  nombre: string;
  descripcion: string;
  ubicacion: string;
}

const HotelsComponent: React.FC<HotelsComponentProps> = ({
  nombre,
  descripcion,
  ubicacion,
}) => {
  return (
    <div className="bg-white shadow rounded p-4 text-black">
      <h2 className="text-xl font-bold mb-2">{nombre}</h2>
      <p className="mb-1">{descripcion}</p>
      <p className="mb-2 font-medium">Ubicación: {ubicacion}</p>
    </div>
  );
};

export default HotelsComponent;