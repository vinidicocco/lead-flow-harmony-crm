
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType } from '@/types/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthManager } from '@/hooks/useAuthManager';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    setUser, 
    organization, 
    setOrganization, 
    fetchUserProfile, 
    updateUserProfile 
  } = useUserProfile();
  
  const { hasPermission } = usePermissions(user);
  
  const { 
    session, 
    setSession, 
    isLoading, 
    setIsLoading, 
    login, 
    register, 
    logout 
  } = useAuthManager(fetchUserProfile);
  
  const navigate = useNavigate();

  const refreshUser = async () => {
    if (session?.user?.id) {
      await fetchUserProfile(session.user.id);
    }
  };

  // Verificar sessão atual e configurar listener para mudanças de autenticação
  useEffect(() => {
    // Primeiro configura o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Evento de auth:", event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Usar setTimeout para evitar problemas de recursão
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setOrganization(null);
        }
      }
    );

    // Depois verifica a sessão atual
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        
        if (currentSession?.user?.id) {
          const profileData = await fetchUserProfile(currentSession.user.id);
          
          if (!profileData?.is_active) {
            // Usuário inativo, fazer logout
            await supabase.auth.signOut();
            toast.error('Sua conta está inativa. Entre em contato com o administrador.');
            setUser(null);
            setOrganization(null);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization,
      isLoading, 
      session,
      login, 
      register,
      logout, 
      updateUserProfile,
      refreshUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
