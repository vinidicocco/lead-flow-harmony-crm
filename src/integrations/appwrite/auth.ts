
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
      throw error;
    }
  },
  
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailSession(email, password);
      return session;
    } catch (error: any) {
      console.error('Appwrite login error:', error);
      throw error;
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
    // Appwrite doesn't have a direct equivalent to Supabase's onAuthStateChange
    // We'll implement a polling mechanism to check auth status
    const checkAuthStatus = async () => {
      try {
        const user = await this.getCurrentUser();
        callback(user);
      } catch (error) {
        callback(null);
      }
    };
    
    // Initial check
    checkAuthStatus();
    
    // Set up interval to check periodically (not ideal but workable)
    const interval = setInterval(checkAuthStatus, 5000);
    
    // Return cleanup function
    return {
      unsubscribe: () => clearInterval(interval)
    };
  }
};
