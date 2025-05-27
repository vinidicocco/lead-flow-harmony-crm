
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { firebaseAppConfig } from '@/firebase/config';

const Login = () => {
  const { user, isLoading, connectionError, retryConnection } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for redirect error
    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    if (errorParam && errorDescription) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: errorDescription
      });
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {connectionError && (
        <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-500 mt-0.5" size={18} />
            <div>
              <h4 className="font-medium text-red-900">Erro de conexão</h4>
              <p className="text-sm text-red-700">{connectionError}</p>
            </div>
          </div>
          
          <div className="bg-white/50 rounded p-3 border border-red-100 text-sm text-red-800">
            <p className="font-medium mb-1">Possíveis soluções:</p>
            <ol className="list-decimal ml-4 space-y-1 text-xs">
              <li>Verifique se o servidor backend está acessível</li>
              <li>Confira se as configurações no arquivo .env estão corretas</li>
              <li>Certifique-se que os recursos necessários foram criados no Firebase</li>
              <li>Verifique se o CORS está configurado para permitir solicitações</li>
            </ol>
          </div>
          
          {retryConnection && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryConnection} 
              className="text-red-600 border-red-200 hover:bg-red-50 w-full flex items-center justify-center gap-2"
            >
              <ArrowRight size={14} /> Tentar conexão novamente
            </Button>
          )}
        </div>
      )}
      
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sistema CRM - Assistu</p>
          <p className="text-xs mt-1 text-gray-400">
            Versão 1.0 - Firebase ({firebaseAppConfig.projectId})
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
