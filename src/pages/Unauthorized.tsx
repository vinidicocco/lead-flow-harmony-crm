
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Não Autorizado</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema se acredita que isto é um erro.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Home size={16} />
            Ir para o Dashboard
          </Button>
          
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
