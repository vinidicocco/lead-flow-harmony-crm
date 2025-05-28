
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

const Settings = () => {
  const { settings, isLoading, error, updateSettings } = useUserSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.profile) {
      setFormData({
        name: settings.profile.name || '',
        email: settings.profile.email || '',
        phone: settings.profile.phone || '',
      });
    }
  }, [settings]);

  const handleSaveProfile = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await updateSettings({
        profile: {
          ...settings.profile,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      });
      
      toast({
        title: "Perfil salvo",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o perfil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (type: 'email' | 'push' | 'sms', value: boolean) => {
    if (!settings) return;
    
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: value,
      }
    });

    toast({
      title: "Notificação atualizada",
      description: `Configuração de ${type} foi ${value ? 'ativada' : 'desativada'}.`,
    });
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await updateSettings({ theme });
    toast({
      title: "Tema atualizado",
      description: `Tema alterado para ${theme === 'light' ? 'claro' : theme === 'dark' ? 'escuro' : 'sistema'}.`,
    });
  };

  const handleLanguageChange = async (language: 'pt' | 'en' | 'es') => {
    await updateSettings({ language });
    toast({
      title: "Idioma atualizado",
      description: "Configuração de idioma foi atualizada.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações básicas da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Perfil
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como você quer receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">Receber notificações por email</p>
              </div>
              <Switch 
                checked={settings?.notifications.email || false}
                onCheckedChange={(value) => handleNotificationChange('email', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push</Label>
                <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
              </div>
              <Switch 
                checked={settings?.notifications.push || false}
                onCheckedChange={(value) => handleNotificationChange('push', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS</Label>
                <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
              </div>
              <Switch 
                checked={settings?.notifications.sms || false}
                onCheckedChange={(value) => handleNotificationChange('sms', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Personalize sua experiência no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select 
                value={settings?.theme || 'light'} 
                onValueChange={handleThemeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={settings?.language || 'pt'} 
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
