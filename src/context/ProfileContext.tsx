import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile, Organization } from '@/types';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  organizations: Organization[];
  currentOrganization: Organization | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Mock organizations for demo
const mockOrganizations: Organization[] = [
  {
    id: 'salt-org',
    name: 'SALT',
    logo: '/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    createdAt: new Date().toISOString(),
    ownerId: '2'
  },
  {
    id: 'ghf-org',
    name: 'GHF',
    logo: '/lovable-uploads/f07b2db5-3e35-4bba-bda2-685a8fcae7d5.png',
    primaryColor: '#1a1f2c',
    secondaryColor: '#ffffff',
    createdAt: new Date().toISOString(),
    ownerId: '3'
  }
];

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [currentProfile, setCurrentProfile] = useState<Profile>('SALT');
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Set current organization based on profile
    const org = organizations.find(org => org.name === currentProfile) || null;
    setCurrentOrganization(org);

    // Save preference to localStorage
    localStorage.setItem('crm-current-profile', currentProfile);
  }, [currentProfile, organizations]);

  useEffect(() => {
    // Initialize with user's organization if available
    if (user) {
      const userOrg = organizations.find(org => org.id === user.orgId);
      if (userOrg) {
        const savedProfile = localStorage.getItem('crm-current-profile');
        
        // If super admin, they can access any profile, so use saved preference
        // Otherwise, set to user's organization
        if (user.role === 'super_admin' && savedProfile) {
          setCurrentProfile(savedProfile);
        } else {
          setCurrentProfile(userOrg.name);
        }
      }
    }
  }, [user]);

  return (
    <ProfileContext.Provider value={{ 
      currentProfile, 
      setCurrentProfile, 
      organizations,
      currentOrganization
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
