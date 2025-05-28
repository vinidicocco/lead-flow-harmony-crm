
import { useState, useEffect } from 'react';
import { userSettingsService, UserSettings } from '@/services/userSettingsService';
import { useAuth } from '@/context/AuthContext';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userSettings = await userSettingsService.getUserSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      await userSettingsService.updateUserSettings(user.id, newSettings);
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
