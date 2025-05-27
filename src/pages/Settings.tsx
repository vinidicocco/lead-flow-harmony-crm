
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { userSettingsService } from '@/services/firebaseService';
import { UserSettings } from '@/types/firestore';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<Partial<UserSettings>>({
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
    }
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const settings = await userSettingsService.getByUserId(user.id);
        
        if (isMounted) {
          if (settings) {
            setUserSettings(settings);
          } else {
            // Criar configurações padrão para o usuário
            const defaultSettings = {
              userId: user.id,
              organizationId: user.organizationId,
              notifications: {
                emailNotifications: true,
                pushNotifications: true,
                meetingReminders: true,
                leadUpdates: true,
                taskReminders: true,
                dailyDigest: false
              },
              appearance: {
                theme: 'light' as const,
                denseMode: false,
                highContrast: false,
                fontSize: 'medium' as const
              }
            };
            
            await userSettingsService.create(defaultSettings);
            setUserSettings(defaultSettings);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        if (isMounted) {
          toast.error('Erro ao carregar configurações');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();
    
    // Timeout de segurança
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        console.warn('Timeout ao carregar configurações');
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  const handleSave = async () => {
    if (!user?.id || !userSettings) return;

    setSaving(true);
    try {
      if (userSettings.id) {
        await userSettingsService.update(userSettings.id, userSettings);
      } else {
        await userSettingsService.create({
          ...userSettings,
          userId: user.id,
          organizationId: user.organizationId
        } as Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>);
      }
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setUserSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Você precisa estar logado para acessar as configurações.</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações de conta</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2 w-full md:w-auto">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={user.name || ''}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações importantes por email</p>
                </div>
                <Switch
                  checked={userSettings.notifications?.emailNotifications || false}
                  onCheckedChange={(checked) => updateSetting('notifications.emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações push no navegador</p>
                </div>
                <Switch
                  checked={userSettings.notifications?.pushNotifications || false}
                  onCheckedChange={(checked) => updateSetting('notifications.pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lembretes de Reunião</Label>
                  <p className="text-sm text-muted-foreground">Receba lembretes de reuniões agendadas</p>
                </div>
                <Switch
                  checked={userSettings.notifications?.meetingReminders || false}
                  onCheckedChange={(checked) => updateSetting('notifications.meetingReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={userSettings.appearance?.theme || 'light'}
                  onChange={(e) => updateSetting('appearance.theme', e.target.value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Automático</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
