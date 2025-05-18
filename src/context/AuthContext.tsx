
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant } from '@/types';
import { authService } from "@/integrations/appwrite/auth";
import { AuthContextType } from './types/AuthTypes';
import { mapAppwriteUserToAppUser } from '@/utils/appwriteUserMapper';
import { useAppwriteAuthOperations } from '@/hooks/useAppwriteAuthOperations';
import { toast } from '@/components/ui/use-toast';
import { checkAppwriteConnection } from '@/integrations/appwrite/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionChecked, setConnectionChecked] = useState(false);

  const { login, updateUserAvatar, logout } = useAppwriteAuthOperations(setUser, setIsLoading);

  // Verificar conexão primeiro
  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const result = await checkAppwriteConnection();
        if (!result.success) {
          setConnectionError(result.message);
          console.error('Falha na conexão com o Appwrite:', result.message);
        } else {
          setConnectionError(null);
        }
      } catch (error: any) {
        setConnectionError('Falha ao verificar conexão com o Appwrite');
        console.error('Erro ao verificar conexão:', error);
      } finally {
        setConnectionChecked(true);
      }
    };

    verifyConnection();
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!connectionChecked) return;
    
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
            const errorMsg = 'Falha na conexão com o servidor Appwrite';
            setConnectionError(errorMsg);
            
            // Mostrar toast apenas se não estiver na página de login
            if (window.location.pathname !== '/login') {
              toast({
                variant: "destructive",
                title: "Erro de conexão",
                description: errorMsg
              });
            }
          }
        }
      } else {
        console.log('AuthProvider: No existing user session found');
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Error checking existing user:', error);
      
      if (error.message?.includes('Network')) {
        const errorMsg = 'Falha na conexão com o servidor Appwrite';
        setConnectionError(errorMsg);
        
        // Mostrar toast apenas se não estiver na página de login
        if (window.location.pathname !== '/login') {
          toast({
            variant: "destructive",
            title: "Erro de conexão",
            description: errorMsg
          });
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionChecked]);

  const retryConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkAppwriteConnection();
      if (result.success) {
        setConnectionError(null);
        toast({
          title: "Conexão restabelecida",
          description: "A conexão com o servidor Appwrite foi restaurada com sucesso."
        });
        
        // Re-verificar usuário
        const appwriteUser = await authService.getCurrentUser();
        if (appwriteUser) {
          const mappedUser = await mapAppwriteUserToAppUser(appwriteUser);
          setUser(mappedUser);
          setCurrentTenant(mappedUser.tenant);
          localStorage.setItem('crm-user', JSON.stringify(mappedUser));
        }
      } else {
        setConnectionError(result.message);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: result.message
        });
      }
    } catch (error: any) {
      setConnectionError('Falha ao verificar conexão com o Appwrite');
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: error.message || "Falha ao verificar conexão"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserAvatar, 
      isLoading, 
      currentTenant,
      connectionError,
      retryConnection
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
