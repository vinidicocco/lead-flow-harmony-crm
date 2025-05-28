
import { useState, useEffect } from 'react';
import { userSettingsService, UserSettings } from '@/services/userSettingsService';

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Usando um ID de usuário fixo para demonstração
      const userSettings = await userSettingsService.getUserSettings('demo-user');
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading user settings:', error);
      // Definir configurações padrão em caso de erro
      setSettings({
        theme: 'light',
        language: 'pt',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        profile: {
          name: 'Usuário Demo',
          email: 'usuario@demo.com',
          avatar: '',
          phone: '',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      await userSettingsService.updateUserSettings('demo-user', newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    refreshSettings: loadSettings,
  };
};
