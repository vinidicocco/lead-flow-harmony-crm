
import React from 'react';

// Mapa de logos organizacionais - mesmo do AppShell, mas poderia ser extraído em um arquivo comum
const clientLogos: Record<string, {src: string, bg?: string}> = {
  'SALT': {
    src: "/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png",
    bg: "bg-black"
  },
  'GHF': {
    src: "/lovable-uploads/f07b2db5-3e35-4bba-bda2-685a8fcae7d5.png"
  }
  // Adicione novos clientes aqui
};

const AuthHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-6 gap-4">
      <div className="flex gap-4">
        {Object.entries(clientLogos).map(([client, config]) => (
          <div key={client} className={`w-10 h-10 rounded-md flex items-center justify-center ${config.bg || ''}`}>
            <img 
              src={config.src} 
              alt={`${client} Logo`} 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      <h1 className="text-3xl font-bold">CRM Integrado</h1>
    </div>
  );
};

export default AuthHeader;
