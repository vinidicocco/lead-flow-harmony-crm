
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/types';

export const useAuthOperations = (setUser: React.Dispatch<React.SetStateAction<User | null>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso!"
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: error.message || "Falha na autenticação. Verifique suas credenciais."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Usuário não encontrado");
      
      // Update avatar in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', currentUser.id);
        
      if (error) throw error;
        
      // Update local state - we'll handle this in the AuthProvider
      setUser(prevUser => prevUser ? { ...prevUser, avatar: avatarUrl } : null);
      
      // Update local storage
      const storedUser = localStorage.getItem('crm-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.avatar = avatarUrl;
        localStorage.setItem('crm-user', JSON.stringify(parsedUser));
      }
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar a foto de perfil."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
        description: error.message || "Não foi possível realizar o logout."
      });
    }
  };

  return { login, updateUserAvatar, logout };
};
