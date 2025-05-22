
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/firebase";
import { User } from '@/types';
import { mapFirebaseUserToAppUser } from '@/utils/firebaseMapper';

export const useFirebaseAuth = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>, 
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const firebaseUser = await authService.login(email, password);
      
      if (firebaseUser) {
        const mappedUser = await mapFirebaseUserToAppUser(firebaseUser);
        setUser(mappedUser);
        localStorage.setItem('crm-user', JSON.stringify(mappedUser));
        
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso!"
        });
      }
      
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
      await authService.updatePhoto(avatarUrl);
      
      // Update user in state
      const firebaseUser = authService.getCurrentUser();
      if (!firebaseUser) throw new Error("Usuário não encontrado");
      
      const mappedUser = await mapFirebaseUserToAppUser(firebaseUser);
      setUser(mappedUser);
      
      // Update local storage
      localStorage.setItem('crm-user', JSON.stringify(mappedUser));
      
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
      await authService.logout();
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
