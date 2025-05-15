
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { currentProfile } = useProfile();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Seus dados de usuário no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="grid gap-4">
                    <div>
                      <span className="font-medium">Nome:</span>
                      <p className="mt-1">{user.first_name} {user.last_name}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="mt-1">{user.email}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Organização:</span>
                      <p className="mt-1">{currentProfile}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Perfil:</span>
                      <p className="mt-1">{user.role}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de uso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <span className="font-medium">Tema:</span>
                    <p className="mt-1">Padrão do sistema</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Língua:</span>
                    <p className="mt-1">Português (Brasil)</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Fuso horário:</span>
                    <p className="mt-1">Brasília (GMT-3)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alteração de Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>
                  Gerencie seus dispositivos conectados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4">
                  <div className="font-medium">Dispositivo atual</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Navegador Web • São Paulo, Brasil
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Escolha como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Preferências de notificações não disponíveis neste momento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
