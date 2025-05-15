
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile, Tenant } from '@/types';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  availableProfiles: Profile[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, currentTenant } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<Profile>('SALT');
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>(['SALT', 'GHF']);

  useEffect(() => {
    // Set available profiles and default profile based on tenant
    if (currentTenant === 'SALT_GHF') {
      setAvailableProfiles(['SALT', 'GHF']);
      // If current profile is not in available profiles, set it to the first available one
      if (!['SALT', 'GHF'].includes(currentProfile)) {
        setCurrentProfile('SALT');
      }
    } else if (currentTenant === 'NEOIN') {
      setAvailableProfiles(['NEOIN']);
      setCurrentProfile('NEOIN');
    }
  }, [currentTenant, currentProfile]);

  // Use user's profile if available
  useEffect(() => {
    if (user && availableProfiles.includes(user.profile)) {
      setCurrentProfile(user.profile);
    }
  }, [user, availableProfiles]);

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, availableProfiles }}>
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
