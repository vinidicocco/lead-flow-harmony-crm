
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { User, UserRole } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Criamos um usuário fictício para o sistema funcionar sem login
  const [user, setUser] = useState<User>({
    id: 'mock-user-id',
    email: 'neoin@example.com',
    first_name: 'Usuário',
    last_name: 'Neoin',
    avatar_url: null,
    organization_id: 'neoin-org-id',
    role: 'MASTER' as UserRole, // Cast to UserRole type
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const [organization, setOrganization] = useState({
    id: 'neoin-org-id',
    name: 'NEOIN Organização',
    code: 'Neoin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  
  const { hasPermission } = usePermissions(user);

  // Funções mock para manter a compatibilidade da interface
  const login = async (): Promise<void> => { 
    return Promise.resolve();
  };
  
  const register = async (): Promise<void> => {
    return Promise.resolve();
  };
  
  const logout = async (): Promise<void> => {
    // Não faz nada, apenas mantém compatibilidade
    return Promise.resolve();
  };
  
  const updateUserProfile = async (): Promise<void> => {
    return Promise.resolve();
  };
  
  const refreshUser = async (): Promise<void> => {
    return Promise.resolve();
  };

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
