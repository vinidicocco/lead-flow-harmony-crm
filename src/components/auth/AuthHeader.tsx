
import React from 'react';

const AuthHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-6 gap-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
          <img 
            src="/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png" 
            alt="SALT Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-10 h-10 rounded-md flex items-center justify-center">
          <img 
            src="/lovable-uploads/f07b2db5-3e35-4bba-bda2-685a8fcae7d5.png" 
            alt="GHF Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold">CRM Integrado</h1>
    </div>
  );
};

export default AuthHeader;
