import { account, ID } from './client';
import { AppwriteException } from 'appwrite';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    try {
      const session = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      if (session) {
        return await this.login(email, password);
      }
      
      return session;
    } catch (error: any) {
      console.error('Appwrite signUp error:', error);
      
      // More descriptive error messages
      if (error.code === 429) {
        throw new Error('Muitas tentativas. Por favor, tente novamente mais tarde.');
      } else if (error.code === 400) {
        throw new Error(error.message || 'Dados inválidos. Verifique seu email e senha.');
      } else if (error.message && error.message.includes('Network')) {
        throw new Error('Erro de conexão com o servidor Appwrite. Verifique sua conexão de internet.');
      } else {
        throw error;
      }
    }
  },
  
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailSession(email, password);
      return session;
    } catch (error: any) {
      console.error('Appwrite login error:', error);
      
      // More descriptive error messages
      if (error.code === 401) {
        throw new Error('Email ou senha incorretos.');
      } else if (error.code === 429) {
        throw new Error('Muitas tentativas. Por favor, tente novamente mais tarde.');
      } else if (error.message && error.message.includes('Network')) {
        throw new Error('Erro de conexão com o servidor Appwrite. Verifique sua conexão de internet.');
      } else {
        throw error;
      }
    }
  },
  
  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error('Appwrite getCurrentUser error:', error);
      return null;
    }
  },
  
  async logout() {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      console.error('Appwrite logout error:', error);
      return false;
    }
  },
  
  async updateName(name: string) {
    try {
      return await account.updateName(name);
    } catch (error) {
      console.error('Appwrite updateName error:', error);
      throw error;
    }
  },

  onAuthStateChange(callback: (user: any) => void) {
    // Add debug info
    console.log('Setting up auth state change listener');
    
    // Appwrite doesn't have a direct equivalent to Supabase's onAuthStateChange
    // We'll implement a polling mechanism to check auth status
    const checkAuthStatus = async () => {
      try {
        const user = await this.getCurrentUser();
        callback(user);
      } catch (error) {
        console.error('Error checking auth status:', error);
        callback(null);
      }
    };
    
    // Initial check
    checkAuthStatus();
    
    // Set up interval to check periodically (not ideal but workable)
    const interval = setInterval(checkAuthStatus, 5000);
    
    // Return cleanup function
    return {
      unsubscribe: () => {
        console.log('Cleaning up auth state change listener');
        clearInterval(interval);
      }
    };
  }
};
