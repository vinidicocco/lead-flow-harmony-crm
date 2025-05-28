
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
  private readonly STORAGE_KEY = 'user_settings';

  async getUserSettings(userId: string): Promise<UserSettings> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Tentar carregar do localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored settings:', error);
      }
    }

    // Configurações padrão
    const defaultSettings: UserSettings = {
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

    // Salvar configurações padrão
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Carregar configurações atuais
    const current = await this.getUserSettings(userId);
    
    // Merge com as novas configurações
    const updated = { ...current, ...settings };
    
    // Salvar no localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    
    console.log('Settings updated:', settings);
  }
}

export const userSettingsService = new UserSettingsService();
