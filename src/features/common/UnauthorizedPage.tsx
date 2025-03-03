import React from 'react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
      <p>No tiene permisos para acceder a esta sección.</p>
    </div>
  );
};

export default UnauthorizedPage;
