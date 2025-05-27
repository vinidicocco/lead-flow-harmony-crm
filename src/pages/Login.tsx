
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const { user, isLoading } = useAuth();

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
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sistema CRM - Assistu</p>
          <p className="text-xs mt-1 text-gray-400">
            Versão 1.0 - Sistema Local
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
