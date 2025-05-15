
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile, Tenant } from '@/types';
import { useAuth } from './AuthContext';
import { isProfileInTenant } from '@/data/mockDataWrapper';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  availableProfiles: Profile[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, currentTenant, tenantData } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<Profile>(tenantData.defaultProfile);
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>(tenantData.availableProfiles);

  useEffect(() => {
    // Set available profiles and default profile based on tenant
    setAvailableProfiles(tenantData.availableProfiles);
    
    // If current profile is not in available profiles, set it to the default one
    if (!tenantData.availableProfiles.includes(currentProfile)) {
      setCurrentProfile(tenantData.defaultProfile);
    }
  }, [currentTenant, tenantData, currentProfile]);

  // Use user's profile if available
  useEffect(() => {
    if (user && isProfileInTenant(user.profile, currentTenant)) {
      setCurrentProfile(user.profile);
    }
  }, [user, currentTenant]);

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
