
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha ambos email e senha');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Tentando login via LoginForm com:", email);
      await login(email, password);
      // O redirecionamento acontecerá no AuthContext após verificação do perfil
    } catch (error: any) {
      console.error('Erro de login:', error);
      
      // Mensagens de erro específicas e mais informativas
      if (error.message) {
        if (error.message.includes("inativa")) {
          toast.error('Sua conta está inativa. Entre em contato com o administrador.');
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error('Credenciais inválidas. Verifique seu email e senha.');
        } else if (error.message.includes("Organização SALT não encontrada")) {
          toast.error('Erro no sistema: Organização padrão não configurada. Contate o suporte.');
        } else if (error.message.includes("Perfil do usuário não encontrado")) {
          toast.error('Erro no sistema: Perfil de usuário não encontrado. Contate o suporte.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">CRM Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="salt@example.com ou ghf@example.com" 
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
              placeholder="Use 'password' para demo" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Fazendo login...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
