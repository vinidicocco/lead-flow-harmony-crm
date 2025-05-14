
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirecionamento se já estiver logado
  useEffect(() => {
    if (user && !isLoading) {
      console.log("Usuário logado, redirecionando...", user);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // O redirecionamento será feito pelo useEffect
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || "Não foi possível fazer login. Verifique suas credenciais.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Correção na consulta para buscar a organização SALT
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('code', 'SALT')
        .limit(1)
        .single();
      
      if (error) {
        console.error("Erro ao buscar organização:", error);
        throw new Error('Erro ao buscar organização: ' + error.message);
      }
      
      const saltOrgId = data?.id;
      
      if (!saltOrgId) {
        throw new Error('Organização SALT não encontrada');
      }
      
      await register(email, password, firstName, lastName, saltOrgId);
      
      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      
      // Limpar campos após sucesso
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      
      // Muda para a aba de login
      setActiveTab('login');
      
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast.error(error.message || "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Acesso ao Sistema</CardTitle>
                <CardDescription>
                  Entre com seus dados para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Esqueceu a senha?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Preencha os dados para criar uma nova conta.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        Nome
                      </label>
                      <Input
                        id="firstName"
                        placeholder="João"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Sobrenome
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Silva"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="registerEmail" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="registerPassword" className="text-sm font-medium">
                      Senha
                    </label>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
