
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant } from '@/types';
import { authService } from "@/firebase";
import { AuthContextType } from './types/AuthTypes';
import { mapFirebaseUserToAppUser } from '@/utils/firebaseMapper';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from '@/components/ui/use-toast';
import { checkFirebaseConnection } from '@/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionChecked, setConnectionChecked] = useState(false);

  const { login, updateUserAvatar, logout } = useFirebaseAuth(setUser, setIsLoading);

  // Check connection first
  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const result = await checkFirebaseConnection();
        if (!result.success) {
          setConnectionError(result.message);
          console.error('Falha na conexão com o Firebase:', result.message);
        } else {
          setConnectionError(null);
        }
      } catch (error: any) {
        setConnectionError('Falha ao verificar conexão com o Firebase');
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
    const unsubscribe = authService.onAuthStateChange(
      async (firebaseUser) => {
        setIsLoading(true);
        
        if (firebaseUser) {
          console.log('AuthProvider: User authenticated', firebaseUser.uid);
          setTimeout(async () => {
            try {
              const mappedUser = await mapFirebaseUserToAppUser(firebaseUser);
              setUser(mappedUser);
              setCurrentTenant(mappedUser.tenant);
              localStorage.setItem('crm-user', JSON.stringify(mappedUser));
              setConnectionError(null);
            } catch (error: any) {
              console.error("Error mapping user:", error);
              
              if (error.message?.includes('Network')) {
                setConnectionError('Falha na conexão com o servidor Firebase');
                toast({
                  variant: "destructive",
                  title: "Erro de conexão",
                  description: "Não foi possível conectar ao servidor Firebase."
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
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      console.log('AuthProvider: Found existing user session', currentUser.uid);
      const processUser = async () => {
        try {
          const mappedUser = await mapFirebaseUserToAppUser(currentUser);
          setUser(mappedUser);
          setCurrentTenant(mappedUser.tenant);
          localStorage.setItem('crm-user', JSON.stringify(mappedUser));
          setConnectionError(null);
        } catch (error) {
          console.error("Error mapping user:", error);
        } finally {
          setIsLoading(false);
        }
      };
      processUser();
    } else {
      console.log('AuthProvider: No existing user session found');
      setIsLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [connectionChecked]);

  const retryConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkFirebaseConnection();
      if (result.success) {
        setConnectionError(null);
        toast({
          title: "Conexão restabelecida",
          description: "A conexão com o servidor Firebase foi restaurada com sucesso."
        });
        
        // Re-verify user
        const firebaseUser = authService.getCurrentUser();
        if (firebaseUser) {
          const mappedUser = await mapFirebaseUserToAppUser(firebaseUser);
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
      setConnectionError('Falha ao verificar conexão com o Firebase');
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
