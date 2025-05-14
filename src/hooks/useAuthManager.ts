
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useAuthManager = (fetchUserProfile: (userId: string) => Promise<any>) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      
      // Verificar se o usuário foi carregado
      if (data.user) {
        try {
          await fetchUserProfile(data.user.id);
          const from = window.location.pathname === '/login' ? '/' : window.location.pathname;
          navigate(from, { replace: true });
        } catch (profileError) {
          console.error("Erro ao carregar perfil após login:", profileError);
        }
      }
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
      if (role === 'MASTER' && session?.user?.role !== 'MASTER') {
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
              (await supabase.from('organizations').select('code').eq('id', organizationId).maybeSingle()).data?.code :
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Você foi desconectado');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Erro ao sair: ${error.message}`);
    }
  };

  return { 
    session,
    setSession,
    isLoading, 
    setIsLoading,
    login,
    register,
    logout
  };
};
