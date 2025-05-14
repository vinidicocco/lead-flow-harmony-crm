
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  availableProfiles: Profile[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, organization } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<Profile>('SALT');
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>(['SALT', 'GHF']);

  // Se o usuário estiver autenticado, usa o perfil da organização
  useEffect(() => {
    if (organization) {
      const orgProfile = organization.code as Profile;
      if (orgProfile) {
        setCurrentProfile(orgProfile);
        
        // Atualiza a lista de perfis disponíveis se não existir
        if (!availableProfiles.includes(orgProfile)) {
          setAvailableProfiles(prev => [...prev, orgProfile]);
        }
      }
    }
  }, [organization]);

  const handleProfileChange = (profile: Profile) => {
    // Apenas usuários MASTER podem trocar de perfil
    if (user?.role === 'MASTER') {
      setCurrentProfile(profile);
      toast.success(`Perfil alterado para ${profile}`);
    } else {
      // Outros usuários só podem usar o perfil da sua organização
      toast.error('Você não tem permissão para alterar o perfil');
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      currentProfile, 
      setCurrentProfile: handleProfileChange,
      availableProfiles
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile deve ser usado dentro de um ProfileProvider');
  }
  return context;
};
