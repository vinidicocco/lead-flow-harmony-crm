
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/types';
import { toast } from 'sonner';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  availableProfiles: Profile[];
  getProfileForDataFunctions: (profile: Profile) => "SALT" | "GHF" | "Neoin";
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  // Definimos Neoin como perfil padrão
  const [currentProfile, setCurrentProfile] = useState<Profile>('Neoin');
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>(['SALT', 'GHF', 'Neoin']);

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Perfil alterado para ${profile}`);
  };

  // Esta função garante compatibilidade com as funções mockData
  const getProfileForDataFunctions = (profile: Profile): "SALT" | "GHF" | "Neoin" => {
    if (profile === 'SALT' || profile === 'GHF' || profile === 'Neoin') {
      return profile;
    }
    return 'Neoin'; // Default agora é Neoin
  };

  return (
    <ProfileContext.Provider value={{ 
      currentProfile, 
      setCurrentProfile: handleProfileChange,
      availableProfiles,
      getProfileForDataFunctions
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
