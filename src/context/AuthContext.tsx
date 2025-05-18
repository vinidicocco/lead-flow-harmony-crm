
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant } from '@/types';
import { authService } from "@/integrations/appwrite/auth";
import { AuthContextType } from './types/AuthTypes';
import { mapAppwriteUserToAppUser } from '@/utils/appwriteUserMapper';
import { useAppwriteAuthOperations } from '@/hooks/useAppwriteAuthOperations';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { login, updateUserAvatar, logout } = useAppwriteAuthOperations(setUser, setIsLoading);

  // Initialize auth state
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    // Set up auth state listener
    const subscription = authService.onAuthStateChange(
      async (appwriteUser) => {
        setIsLoading(true);
        
        if (appwriteUser) {
          console.log('AuthProvider: User authenticated', appwriteUser.$id);
          // We use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            try {
              const mappedUser = await mapAppwriteUserToAppUser(appwriteUser);
              setUser(mappedUser);
              setCurrentTenant(mappedUser.tenant);
              localStorage.setItem('crm-user', JSON.stringify(mappedUser));
              setConnectionError(null);
            } catch (error: any) {
              console.error("Error mapping user:", error);
              
              if (error.message?.includes('Network')) {
                setConnectionError('Falha na conexão com o servidor Appwrite');
                toast({
                  variant: "destructive",
                  title: "Erro de conexão",
                  description: "Não foi possível conectar ao servidor Appwrite. Verifique sua configuração."
                });
              }
              
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          console.log('AuthProvider: No authenticated user');
          setUser(null);
          localStorage.removeItem('crm-user');
          setIsLoading(false);
        }
      }
    );

    // Check for existing user
    authService.getCurrentUser().then(async (appwriteUser) => {
      if (appwriteUser) {
        console.log('AuthProvider: Found existing user session', appwriteUser.$id);
        try {
          const mappedUser = await mapAppwriteUserToAppUser(appwriteUser);
          setUser(mappedUser);
          setCurrentTenant(mappedUser.tenant);
          localStorage.setItem('crm-user', JSON.stringify(mappedUser));
          setConnectionError(null);
        } catch (error: any) {
          console.error("Error mapping user:", error);
          
          if (error.message?.includes('Network')) {
            setConnectionError('Falha na conexão com o servidor Appwrite');
          }
        }
      } else {
        console.log('AuthProvider: No existing user session found');
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Error checking existing user:', error);
      
      if (error.message?.includes('Network')) {
        setConnectionError('Falha na conexão com o servidor Appwrite');
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor Appwrite. Verifique sua configuração."
        });
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
      currentTenant,
      connectionError 
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
