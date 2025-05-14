
import { User } from '@/types';
import { supabase } from "@/integrations/supabase/client";

export const usePermissions = (user: User | null) => {
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

  return { hasPermission };
};
