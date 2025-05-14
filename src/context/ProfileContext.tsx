import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  availableProfiles: Profile[];
  getProfileForDataFunctions: (profile: Profile) => "SALT" | "GHF";
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, organization } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<Profile>('SALT');
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>(['SALT', 'GHF', 'Neoin']);

  // When user is authenticated, use organization profile
  useEffect(() => {
    if (organization) {
      const orgProfile = organization.code as Profile;
      if (orgProfile) {
        setCurrentProfile(orgProfile);
        
        // Update available profiles list if it doesn't exist
        if (!availableProfiles.includes(orgProfile)) {
          setAvailableProfiles(prev => [...prev, orgProfile]);
        }
      }
    }
  }, [organization]);

  const handleProfileChange = (profile: Profile) => {
    // Only MASTER users can change profiles
    if (user?.role === 'MASTER') {
      setCurrentProfile(profile);
      toast.success(`Profile changed to ${profile}`);
    } else {
      // Other users can only use their organization profile
      toast.error('You do not have permission to change profiles');
    }
  };

  // This wrapper function ensures compatibility with the mockData functions
  // that still expect "SALT" | "GHF" literals
  const getProfileForDataFunctions = (profile: Profile): "SALT" | "GHF" => {
    return (profile === 'SALT' || profile === 'GHF') ? profile : 'SALT';
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
