
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthHeader from '@/components/auth/AuthHeader';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSuccess={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
