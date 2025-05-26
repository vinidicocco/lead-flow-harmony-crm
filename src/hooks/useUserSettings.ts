
import { useState, useEffect } from 'react';
import { userSettingsService, usersService } from '@/services/firebaseService';
import { UserSettings } from '@/types/firestore';
import { useAuth } from '@/context/AuthContext';
import { getOrganizationId } from '@/firebase/config';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load user profile data
      const userData = await usersService.getById(user.id);
      
      if (userData) {
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: '', // Add phone to user model if needed
          bio: '' // Add bio to user model if needed
        });
      }

      // Load user settings
      const userSettings = await userSettingsService.getByUserId(user.id);
      if (userSettings) {
        setSettings(userSettings);
      } else {
        // Create default settings
        const defaultSettings = {
          userId: user.id,
          organizationId: getOrganizationId() || 'default-org-id',
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
        const createdSettings = await userSettingsService.create(defaultSettings);
        setSettings(createdSettings as UserSettings);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: typeof profileData) => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      
      await usersService.update(user.id, {
        name: data.name,
        email: data.email
      });

      setProfileData(data);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user?.id || !settings) return;
    
    try {
      setSaving(true);
      
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      await userSettingsService.update(settings.id, updatedSettings);
      setSettings(updatedSettings);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  return {
    settings,
    profileData,
    loading,
    saving,
    error,
    saveProfile,
    saveSettings,
    refetch: loadUserData
  };
};
