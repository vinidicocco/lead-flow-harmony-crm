
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/firebase";
import { checkFirebaseConnection, firebaseAppConfig } from "@/firebase";
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [connectionError, setConnectionError] = useState<{ message: string; details?: string; code?: string | number } | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const { login } = useAuth();

  // Check Firebase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkFirebaseConnection();
        
        if (result.success) {
          setConnectionStatus('connected');
          setConnectionError(null);
        } else {
          setConnectionStatus('failed');
          setConnectionError({
            message: result.message,
            details: result.details,
            code: result.code
          });
          
          toast({
            variant: "destructive",
            title: "Erro de conexão",
            description: result.message
          });
        }
      } catch (error: any) {
        console.error('Erro ao verificar conexão:', error);
        setConnectionStatus('failed');
        setConnectionError({
          message: 'Falha ao verificar a conexão com o Firebase',
          details: error.message
        });
      }
    };
    
    checkConnection();
  }, []);

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
        
        // Register new user with Firebase
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

  const retryConnection = async () => {
    setConnectionStatus('checking');
    setConnectionError(null);
    
    try {
      const result = await checkFirebaseConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        setConnectionError(null);
        
        toast({
          title: "Conexão restabelecida",
          description: "A conexão com o Firebase foi restabelecida com sucesso."
        });
      } else {
        setConnectionStatus('failed');
        setConnectionError({
          message: result.message,
          details: result.details,
          code: result.code
        });
        
        toast({
          variant: "destructive",
          title: "Erro persistente",
          description: "A conexão com o Firebase continua falhando."
        });
      }
    } catch (error: any) {
      console.error('Erro ao verificar conexão:', error);
      setConnectionStatus('failed');
      setConnectionError({
        message: 'Falha ao verificar a conexão com o Firebase',
        details: error.message
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {connectionStatus === 'failed' && connectionError && (
        <Alert variant="destructive" className="rounded-t-lg rounded-b-none border-b">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão com o servidor Firebase</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{connectionError.message}</p>
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={retryConnection} className="text-xs">
                Tentar novamente
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDebugInfo(!showDebugInfo)} className="text-xs">
                {showDebugInfo ? "Ocultar informações de debug" : "Mostrar informações de debug"}
              </Button>
            </div>
            
            {showDebugInfo && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                    Ver detalhes técnicos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Informações de Debug</DialogTitle>
                    <DialogDescription>Detalhes técnicos da configuração e erro</DialogDescription>
                  </DialogHeader>
                  <div className="bg-slate-50 p-3 rounded text-xs font-mono overflow-auto max-h-[300px]">
                    <p className="font-bold mb-2">Configuração Firebase:</p>
                    <p>Project ID: {firebaseAppConfig.projectId || 'Não configurado'}</p>
                    <p>Debug Mode: {firebaseAppConfig.debugMode ? 'Ativado' : 'Desativado'}</p>
                    
                    {connectionError && (
                      <>
                        <p className="font-bold mt-4 mb-2">Detalhes do erro:</p>
                        <p>Mensagem: {connectionError.details || 'Não disponível'}</p>
                        {connectionError.code && <p>Código: {connectionError.code}</p>}
                      </>
                    )}
                    
                    <p className="mt-4 text-sm">
                      Verifique se os valores no arquivo .env estão corretos.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </AlertDescription>
        </Alert>
      )}
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
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || connectionStatus === 'failed'}>
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
          
          {connectionStatus === 'checking' && (
            <p className="text-xs text-center mt-2 text-gray-500">
              Verificando conexão com o servidor Firebase...
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
