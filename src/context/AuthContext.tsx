
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant } from '@/types';
import { authService } from "@/integrations/appwrite/auth";
import { AuthContextType } from './types/AuthTypes';
import { mapAppwriteUserToAppUser } from '@/utils/appwriteUserMapper';
import { useAppwriteAuthOperations } from '@/hooks/useAppwriteAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');

  const { login, updateUserAvatar, logout } = useAppwriteAuthOperations(setUser, setIsLoading);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const subscription = authService.onAuthStateChange(
      async (appwriteUser) => {
        setIsLoading(true);
        
        if (appwriteUser) {
          // We use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            try {
              const mappedUser = await mapAppwriteUserToAppUser(appwriteUser);
              setUser(mappedUser);
              setCurrentTenant(mappedUser.tenant);
              localStorage.setItem('crm-user', JSON.stringify(mappedUser));
            } catch (error) {
              console.error("Error mapping user:", error);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('crm-user');
          setIsLoading(false);
        }
      }
    );

    // Check for existing user
    authService.getCurrentUser().then(async (appwriteUser) => {
      if (appwriteUser) {
        try {
          const mappedUser = await mapAppwriteUserToAppUser(appwriteUser);
          setUser(mappedUser);
          setCurrentTenant(mappedUser.tenant);
          localStorage.setItem('crm-user', JSON.stringify(mappedUser));
        } catch (error) {
          console.error("Error mapping user:", error);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserAvatar, 
      isLoading, 
      currentTenant 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
