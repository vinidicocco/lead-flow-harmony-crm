
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Profile } from '@/types';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [currentProfile, setCurrentProfile] = useState<Profile>('SALT');

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
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
