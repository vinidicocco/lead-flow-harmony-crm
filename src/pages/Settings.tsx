
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';

const Settings = () => {
  const { user } = useAuth();
  const { currentProfile } = useProfile();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-500 mt-1">
          Gerencie suas preferências e configurações de conta
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Visualize e atualize suas informações pessoais
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
                      <p className="mt-1">{user.organization_id ? (typeof currentProfile === 'object' ? currentProfile.organization?.name : '') : ''}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Perfil:</span>
                      <p className="mt-1">{user.role}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <PasswordChangeForm />
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Configure suas preferências de uso do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Configurações de preferências em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Configurações de notificações em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
