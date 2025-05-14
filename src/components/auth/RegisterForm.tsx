
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Tentando registrar usuário:", email);
      
      // Usar saltOrgId como placeholder, será resolvido no useAuthManager
      await register(email, password, firstName, lastName, 'saltOrgId');
      
      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      
      // Limpar campos após sucesso
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      
      // Chama onSuccess se fornecido
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error.message.includes('User already registered')) {
        toast.error("Este email já está registrado. Tente fazer login.");
      } else if (error.message.includes('SALT')) {
        toast.error("Erro no sistema: Organização padrão não encontrada. Por favor, contate o suporte.");
      } else {
        toast.error(error.message || "Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default RegisterForm;
