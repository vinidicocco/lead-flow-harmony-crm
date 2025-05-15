
import React, { useState } from 'react';
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
  const [useBlueTheme, setUseBlueTheme] = useState(false);

  // Don't show the profile switcher if there's only one profile available
  if (availableProfiles.length <= 1) {
    return null;
  }

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Switched to ${profile} profile`);
  };

  const toggleThemeColor = () => {
    setUseBlueTheme(!useBlueTheme);
    toast.success(`Switched to ${!useBlueTheme ? 'Navy Blue' : 'Yellow'} theme`);
  };

  // Use tenant-appropriate color
  const getProfileButtonColor = () => {
    if (currentTenant === 'NEOIN') {
      return useBlueTheme ? 'bg-neoin-blue hover:bg-neoin-blue-dark' : 'bg-neoin hover:bg-neoin-dark';
    }
    return 'bg-salt hover:bg-salt-dark'; // Default for SALT_GHF tenant
  };

  const profileButtonColor = getProfileButtonColor();

  return (
    <div className="flex gap-2 items-center">
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
                profile === 'NEOIN' ? (useBlueTheme ? 'bg-neoin-blue' : 'bg-neoin') : 'bg-salt'
              } mr-2`}></div>
              {profile}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentTenant === 'NEOIN' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleThemeColor}
          className="text-xs px-2"
          title="Toggle theme color"
        >
          <div className={`w-3 h-3 rounded-full ${useBlueTheme ? 'bg-neoin-blue' : 'bg-neoin'}`}></div>
        </Button>
      )}
    </div>
  );
};

export default ProfileSwitcher;
