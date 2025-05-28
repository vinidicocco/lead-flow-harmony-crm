
// Serviço para configurações do usuário
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  profile: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
  };
}

class UserSettingsService {
  async getUserSettings(userId: string): Promise<UserSettings> {
    // TODO: Implementar chamada para API real
    return {
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
    };
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    // TODO: Implementar chamada para API real
    console.log('Settings updated:', settings);
  }
}

export const userSettingsService = new UserSettingsService();
