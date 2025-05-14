
import { useState } from 'react';
import { User, Organization, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Função para buscar perfil completo do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Buscando perfil para o usuário:", userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations:organization_id (*)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        return null;
      }

      if (!profileData) {
        console.error("Perfil não encontrado para o usuário:", userId);
        return null;
      }

      console.log("Perfil encontrado:", profileData);

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

      return profileData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
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

  return {
    user,
    setUser,
    organization,
    setOrganization,
    fetchUserProfile,
    updateUserProfile
  };
};
