import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Save, Bell, User, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // Adicionado estado activeTab
  const { 
    settings, 
    profileData, 
    loading, 
    saving, 
    error,
    saveProfile, 
    saveSettings 
  } = useUserSettings();
  
  const [localProfileData, setLocalProfileData] = useState(profileData);
  const [localSettings, setLocalSettings] = useState(settings);

  // Update local state when data loads
  React.useEffect(() => {
    setLocalProfileData(profileData);
  }, [profileData]);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Adicionar timeout de segurança para evitar loading infinito
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        console.warn('Timeout ao carregar configurações');
        // Forçar parada do loading após 10 segundos
        if (loading) {
          toast({
            variant: "destructive",
            title: "Timeout",
            description: "Tempo limite excedido ao carregar configurações. Tente recarregar a página."
          });
        }
      }, 10000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, toast]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setLocalSettings(prev => prev ? {
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    } : null);
  };

  const handleAppearanceChange = (name: string, value: any) => {
    setLocalSettings(prev => prev ? {
      ...prev,
      appearance: {
        ...prev.appearance,
        [name]: value
      }
    } : null);
  };

  const handleSaveProfile = async () => {
    const result = await saveProfile(localProfileData);
    
    if (result.success) {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error || "Não foi possível salvar o perfil."
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;
    
    const result = await saveSettings(localSettings);
    
    if (result.success) {
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error || "Não foi possível salvar as configurações."
      });
    }
  };

  // Fallback para dados não encontrados
  if (!settings && !loading && !error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Não foi possível carregar suas configurações.</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar configurações: {error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Configurações</h1>
      <p className="text-gray-500 mb-6">Gerencie suas preferências de conta e do sistema</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input 
                      name="name"
                      value={localProfileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      name="email"
                      value={localProfileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input 
                      name="phone"
                      value={localProfileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Biografia Profissional</label>
                  <Textarea 
                    name="bio"
                    value={localProfileData.bio}
                    onChange={handleProfileChange}
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Controle quais notificações você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {localSettings && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por Email</p>
                        <p className="text-sm text-gray-500">Receba atualizações por email</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações Push</p>
                        <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lembretes de Reuniões</p>
                        <p className="text-sm text-gray-500">Notificações antes de reuniões agendadas</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.meetingReminders}
                        onCheckedChange={(checked) => handleNotificationChange('meetingReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Atualizações de Leads</p>
                        <p className="text-sm text-gray-500">Notificações quando leads são atualizados</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.leadUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('leadUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lembretes de Tarefas</p>
                        <p className="text-sm text-gray-500">Notificações para tarefas pendentes</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.taskReminders}
                        onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Resumo Diário</p>
                        <p className="text-sm text-gray-500">Receba um resumo diário das atividades</p>
                      </div>
                      <Switch 
                        checked={localSettings.notifications.dailyDigest}
                        onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)}
                      />
                    </div>
                  </div>
                )}
                
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {localSettings && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tema</label>
                      <div className="flex gap-4">
                        <div
                          className={`cursor-pointer p-4 rounded-lg border ${
                            localSettings.appearance.theme === 'light'
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleAppearanceChange('theme', 'light')}
                        >
                          <div className="h-16 w-full bg-white border rounded-md shadow-sm mb-2"></div>
                          <p className="text-center text-sm font-medium">Claro</p>
                        </div>
                        <div
                          className={`cursor-pointer p-4 rounded-lg border ${
                            localSettings.appearance.theme === 'dark'
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleAppearanceChange('theme', 'dark')}
                        >
                          <div className="h-16 w-full bg-gray-800 border rounded-md shadow-sm mb-2"></div>
                          <p className="text-center text-sm font-medium">Escuro</p>
                        </div>
                        <div
                          className={`cursor-pointer p-4 rounded-lg border ${
                            localSettings.appearance.theme === 'system'
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleAppearanceChange('theme', 'system')}
                        >
                          <div className="h-16 w-full bg-gradient-to-r from-white to-gray-800 border rounded-md shadow-sm mb-2"></div>
                          <p className="text-center text-sm font-medium">Sistema</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Modo Compacto</p>
                        <p className="text-sm text-gray-500">Reduz o espaçamento na interface</p>
                      </div>
                      <Switch 
                        checked={localSettings.appearance.denseMode}
                        onCheckedChange={(checked) => handleAppearanceChange('denseMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alto Contraste</p>
                        <p className="text-sm text-gray-500">Aumenta o contraste para melhor legibilidade</p>
                      </div>
                      <Switch 
                        checked={localSettings.appearance.highContrast}
                        onCheckedChange={(checked) => handleAppearanceChange('highContrast', checked)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tamanho da Fonte</label>
                      <div className="flex gap-4">
                        {['small', 'medium', 'large'].map((size) => (
                          <div 
                            key={size}
                            className={`cursor-pointer flex-1 p-3 rounded-lg border text-center ${
                              localSettings.appearance.fontSize === size
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200'
                            }`}
                            onClick={() => handleAppearanceChange('fontSize', size)}
                          >
                            <p className={`font-medium ${
                              size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
                            }`}>
                              {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Senha Atual</label>
                    <Input type="password" placeholder="Digite sua senha atual" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nova Senha</label>
                    <Input type="password" placeholder="Digite sua nova senha" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmar Nova Senha</label>
                    <Input type="password" placeholder="Confirme sua nova senha" />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Autenticação de Dois Fatores</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">Configurar Autenticação de Dois Fatores</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Sessões Ativas</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Gerencie os dispositivos que estão conectados à sua conta
                  </p>
                  <Button variant="outline">Gerenciar Sessões</Button>
                </div>
                
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
