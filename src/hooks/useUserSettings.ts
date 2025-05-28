
import { useState, useEffect } from 'react';
import { userSettingsService, UserSettings } from '@/services/userSettingsService';

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userSettings = await userSettingsService.getUserSettings('demo-user');
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading user settings:', error);
      setError('Erro ao carregar configurações');
      // Configurações padrão em caso de erro
      setSettings({
        theme: 'light',
        language: 'pt',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        profile: {
          name: '',
          email: '',
          avatar: '',
          phone: '',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    
    try {
      await userSettingsService.updateUserSettings('demo-user', newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      
      // Aplicar tema imediatamente se foi alterado
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      setError('Erro ao atualizar configurações');
    }
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  // Aplicar tema na inicialização
  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: loadSettings,
  };
};
