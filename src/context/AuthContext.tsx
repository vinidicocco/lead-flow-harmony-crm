
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Organization, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  session: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, organizationId: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permissionCode: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar perfil completo do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations:organization_id (*)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        return null;
      }

      if (profileData) {
        setUser({
          id: profileData.id,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          avatar_url: profileData.avatar_url,
          organization_id: profileData.organization_id,
          role: profileData.role,
          is_active: profileData.is_active,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        });
        
        if (profileData.organizations) {
          setOrganization(profileData.organizations as Organization);
        }
      }

      return profileData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = async (permissionCode: string): Promise<boolean> => {
    if (!user) return false;
    
    // Master tem todas as permissões
    if (user.role === 'MASTER') return true;

    try {
      const { data, error } = await supabase
        .rpc('has_permission', { permission_code: permissionCode });
        
      if (error) {
        console.error('Erro ao verificar permissão:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  };

  // Verificar sessão atual e configurar listener para mudanças de autenticação
  useEffect(() => {
    // Primeiro configura o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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

  const refreshUser = async () => {
    if (session?.user?.id) {
      await fetchUserProfile(session.user.id);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Usuário é carregado pelo listener de auth
      toast.success('Login efetuado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro no login: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    organizationId: string,
    role: UserRole = 'USER'
  ) => {
    setIsLoading(true);
    try {
      // Verificar se é permitido criar usuário com esse papel
      if (role === 'MASTER' && (!user || user.role !== 'MASTER')) {
        throw new Error('Apenas usuários MASTER podem criar outros usuários MASTER');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            organization: organizationId ? 
              // Buscar o código da organização pelo ID
              (await supabase.from('organizations').select('code').eq('id', organizationId).single()).data?.code :
              null,
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast.success('Usuário criado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao criar usuário: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      // Atualiza o estado local
      setUser({ ...user, ...updates });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setOrganization(null);
      setSession(null);
      toast.info('Você foi desconectado');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Erro ao sair: ${error.message}`);
    }
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
