
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Tenant } from '@/types';
import { AuthContextType } from './types/AuthTypes';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulação de login simples
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar usuário baseado no email
      let profile: 'SALT' | 'GHF' | 'NEOIN' = 'SALT';
      let tenant: Tenant = 'SALT_GHF';
      let organizationId = 'salt-org-1';
      
      if (email.includes('ghf')) {
        profile = 'GHF';
        organizationId = 'ghf-org-1';
      } else if (email.includes('neoin')) {
        profile = 'NEOIN';
        tenant = 'NEOIN';
        organizationId = 'neoin-org-1';
      }

      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        avatar: '',
        profile,
        tenant,
        organizationId
      };

      setUser(mockUser);
      setCurrentTenant(mockUser.tenant);
      localStorage.setItem('crm-user', JSON.stringify(mockUser));
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: "Falha na autenticação. Verifique suas credenciais."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('crm-user');
      toast({
        title: "Logout concluído",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout."
      });
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('crm-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });
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
      connectionError: null,
      retryConnection: undefined
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
