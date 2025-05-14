
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useAuthManager = (fetchUserProfile: (userId: string) => Promise<any>) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Efeito para redirecionar após login bem-sucedido
  useEffect(() => {
    if (session?.user) {
      console.log("Sessão detectada, redirecionando...", session);
      if (window.location.pathname === '/login') {
        // Forçar redirecionamento após login bem-sucedido
        navigate('/', { replace: true });
      }
    }
  }, [session, navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Definir a sessão localmente para acionar o redirecionamento
      setSession(data.session);
      
      // Verificar se o usuário foi carregado
      if (data.user) {
        try {
          const userData = await fetchUserProfile(data.user.id);
          
          if (!userData) {
            console.error("Erro: Perfil do usuário não encontrado");
            throw new Error("Perfil do usuário não encontrado");
          } 
          
          if (!userData?.is_active) {
            throw new Error("Sua conta está inativa. Entre em contato com o administrador.");
          }
          
          toast.success('Login efetuado com sucesso!');
          
          // Forçar redirecionamento imediato
          navigate('/', { replace: true });
        } catch (profileError: any) {
          // Em caso de erro no perfil, fazer logout
          await supabase.auth.signOut();
          throw profileError;
        }
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
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

      // Verificar se a organização SALT existe antes de prosseguir
      const { data: saltOrgs, error: saltOrgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('code', 'SALT');
        
      if (saltOrgError) {
        console.error("Erro ao verificar organização SALT:", saltOrgError);
        throw new Error('Erro ao verificar organização: ' + saltOrgError.message);
      }
      
      if (!saltOrgs || saltOrgs.length === 0) {
        console.error("Organização SALT não encontrada");
        // Tentar criar a organização SALT se ela não existir
        try {
          const { data: newOrg, error: createOrgError } = await supabase
            .from('organizations')
            .insert([
              { name: 'SALT Tecnologia', code: 'SALT' }
            ])
            .select();
            
          if (createOrgError) {
            throw new Error('Erro ao criar organização SALT: ' + createOrgError.message);
          }
          
          if (newOrg && newOrg.length > 0) {
            organizationId = newOrg[0].id;
            console.log("Nova organização SALT criada com ID:", organizationId);
          } else {
            throw new Error('Falha ao criar organização SALT');
          }
        } catch (createError) {
          console.error("Erro ao criar organização SALT:", createError);
          throw new Error('Não foi possível criar a organização SALT. Por favor, contate o administrador.');
        }
      } else if (organizationId === 'saltOrgId') { // Se estiver usando um ID temporário
        organizationId = saltOrgs[0].id;
      }

      // Obter o código da organização
      let organizationCode = "SALT"; // Default
      try {
        if (organizationId) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('code')
            .eq('id', organizationId)
            .maybeSingle();
          
          if (orgError) {
            console.error("Erro ao buscar organização:", orgError);
            throw new Error('Erro ao buscar organização: ' + orgError.message);
          }
          
          if (orgData) {
            organizationCode = orgData.code;
          }
        }
      } catch (err) {
        console.error("Erro ao buscar organização:", err);
        // Mantém "SALT" como código padrão
      }

      // Criar usuário com os metadados necessários
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            organization: organizationCode,
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast.success('Usuário criado com sucesso! Você já pode fazer login.');
      return data;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
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
