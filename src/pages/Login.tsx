
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import AuthHeader from '@/components/auth/AuthHeader';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionamento se já estiver logado
  useEffect(() => {
    if (user && !isLoading) {
      console.log("Usuário logado, redirecionando...", user);
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Se estiver carregando a sessão inicial, mostrar loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <AuthHeader />
        <div className="pt-4">
          <LoginForm />
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Entre em contato com um administrador para obter acesso ao sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
