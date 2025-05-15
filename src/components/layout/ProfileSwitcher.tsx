
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile, availableProfiles } = useProfile();
  const { currentTenant } = useAuth();

  // Don't show the profile switcher if there's only one profile available
  if (availableProfiles.length <= 1) {
    return null;
  }

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Switched to ${profile} profile`);
  };

  // Use tenant-appropriate color
  const getProfileButtonColor = () => {
    if (currentTenant === 'NEOIN') {
      return 'bg-neoin hover:bg-neoin-dark';
    }
    return 'bg-salt hover:bg-salt-dark'; // Default for SALT_GHF tenant
  };

  const profileButtonColor = getProfileButtonColor();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={`${profileButtonColor} gap-1`}
        >
          {currentProfile}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-24">
        {availableProfiles.map((profile) => (
          <DropdownMenuItem
            key={profile}
            onClick={() => handleProfileChange(profile)}
            className={`flex items-center ${currentProfile === profile ? 'bg-salt/20' : ''}`}
          >
            <div className={`w-3 h-3 rounded-full ${
              profile === 'NEOIN' ? 'bg-neoin' : 'bg-salt'
            } mr-2`}></div>
            {profile}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
