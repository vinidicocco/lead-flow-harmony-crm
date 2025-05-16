import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/integrations/appwrite/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o email e senha"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isRegistering) {
        if (!name) {
          toast({
            variant: "destructive",
            title: "Nome obrigatório",
            description: "Por favor, informe seu nome para o cadastro"
          });
          setIsLoading(false);
          return;
        }
        
        // Register new user with Appwrite
        await authService.signUp(email, password, name);
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso! Você já pode fazer login."
        });
        
        setIsRegistering(false);
      } else {
        // Login existing user
        await login(email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: isRegistering ? "Erro no cadastro" : "Erro no login",
        description: error.message || "Ocorreu um erro. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Clear form fields when switching modes
    setPassword('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {isRegistering ? "Cadastro CRM" : "Login CRM"}
        </CardTitle>
        <CardDescription>
          {isRegistering 
            ? "Crie sua conta para acessar o sistema" 
            : "Entre com suas credenciais para acessar sua conta"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegistering}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder={isRegistering ? "Crie uma senha segura" : "Sua senha"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (isRegistering ? "Cadastrando..." : "Entrando...") 
              : (isRegistering ? "Cadastrar" : "Entrar")}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-sm"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isRegistering 
              ? "Já tem uma conta? Entre aqui" 
              : "Não tem uma conta? Cadastre-se"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
