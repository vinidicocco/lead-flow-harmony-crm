import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Save, Bell, User, Shield, Palette, Users, Plus } from 'lucide-react';

const Settings = () => {
  const { currentProfile, currentOrganization } = useProfile();
  const { user, isOrgAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '+55 (11) 98765-4321',
      bio: 'CRM user with access to system features.'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      meetingReminders: true,
      leadUpdates: true,
      taskReminders: true,
      dailyDigest: false
    },
    appearance: {
      theme: 'light',
      denseMode: false,
      highContrast: false,
      fontSize: 'medium'
    },
    organization: {
      name: currentOrganization?.name || currentProfile,
      email: `info@${currentProfile.toLowerCase()}.com`,
      phone: '+55 (11) 3333-4444',
      address: 'Av. Paulista, 1000, São Paulo - SP',
      website: `https://www.${currentProfile.toLowerCase()}.com`,
      logo: currentOrganization?.logo || ''
    }
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      profile: {
        ...settings.profile,
        [name]: value
      }
    });
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked
      }
    });
  };

  const handleAppearanceChange = (name: string, value: any) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [name]: value
      }
    });
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      organization: {
        ...settings.organization,
        [name]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações salvas com sucesso!');
  };

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
          {isOrgAdmin() && (
            <TabsTrigger value="organization">
              <Users className="w-4 h-4 mr-2" />
              Organização
            </TabsTrigger>
          )}
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input 
                      name="name"
                      value={settings.profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      name="email"
                      value={settings.profile.email}
                      onChange={handleProfileChange}
                      disabled={!isOrgAdmin()}
                    />
                    {!isOrgAdmin() && (
                      <p className="text-xs text-muted-foreground">
                        Contate um administrador para alterar seu email.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input 
                      name="phone"
                      value={settings.profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Função</label>
                    <Input 
                      value={user?.role === 'super_admin' ? 'Super Admin' : 
                             user?.role === 'org_admin' ? 'Administrador da Organização' : 
                             'Usuário Regular'}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Biografia Profissional</label>
                  <Textarea 
                    name="bio"
                    value={settings.profile.bio}
                    onChange={handleProfileChange}
                    rows={4}
                  />
                </div>
                
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-gray-500">Receba atualizações por email</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações Push</p>
                      <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lembretes de Reuniões</p>
                      <p className="text-sm text-gray-500">Notificações antes de reuniões agendadas</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.meetingReminders}
                      onCheckedChange={(checked) => handleNotificationChange('meetingReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações de Leads</p>
                      <p className="text-sm text-gray-500">Notificações quando leads são atualizados</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.leadUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('leadUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lembretes de Tarefas</p>
                      <p className="text-sm text-gray-500">Notificações para tarefas pendentes</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.taskReminders}
                      onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Resumo Diário</p>
                      <p className="text-sm text-gray-500">Receba um resumo diário das atividades</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.dailyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)}
                    />
                  </div>
                </div>
                
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tema</label>
                    <div className="flex gap-4">
                      <div
                        className={`cursor-pointer p-4 rounded-lg border ${
                          settings.appearance.theme === 'light'
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
                          settings.appearance.theme === 'dark'
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
                          settings.appearance.theme === 'system'
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
                      checked={settings.appearance.denseMode}
                      onCheckedChange={(checked) => handleAppearanceChange('denseMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alto Contraste</p>
                      <p className="text-sm text-gray-500">Aumenta o contraste para melhor legibilidade</p>
                    </div>
                    <Switch 
                      checked={settings.appearance.highContrast}
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
                            settings.appearance.fontSize === size
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
                
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Organization settings - only for admins */}
        {isOrgAdmin() && (
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Organização</CardTitle>
                <CardDescription>
                  Gerencie detalhes da sua organização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome da Organização</label>
                      <Input 
                        name="name"
                        value={settings.organization.name}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email de Contato</label>
                      <Input 
                        type="email"
                        name="email"
                        value={settings.organization.email}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone</label>
                      <Input 
                        name="phone"
                        value={settings.organization.phone}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website</label>
                      <Input 
                        name="website"
                        value={settings.organization.website}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Endereço</label>
                    <Input 
                      name="address"
                      value={settings.organization.address}
                      onChange={handleOrganizationChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo (URL)</label>
                    <Input 
                      name="logo"
                      value={settings.organization.logo}
                      onChange={handleOrganizationChange}
                      placeholder="https://example.com/logo.png"
                    />
                    {settings.organization.logo && (
                      <div className="mt-3 p-4 border rounded-md flex items-center justify-center">
                        <img 
                          src={settings.organization.logo} 
                          alt="Logo preview" 
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  {user?.role === 'org_admin' && (
                    <div className="border-t pt-4 mt-6">
                      <h3 className="font-medium mb-2">Gerenciar Usuários</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Administre os usuários em sua organização
                      </p>
                      <Button variant="outline" className="mr-2">
                        <Users className="w-4 h-4 mr-2" />
                        Gerenciar Usuários
                      </Button>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Usuário
                      </Button>
                    </div>
                  )}
                  
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
