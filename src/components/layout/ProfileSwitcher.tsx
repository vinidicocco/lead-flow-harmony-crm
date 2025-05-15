
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile, availableProfiles } = useProfile();

  // Cores dinamicamente adaptadas para qualquer perfil
  const getProfileColor = (profile: string) => {
    const colorMap: Record<string, string> = {
      'SALT': 'bg-salt hover:bg-salt-dark',
      'GHF': 'bg-salt hover:bg-salt-dark', 
      'Neoin': 'bg-neoin hover:bg-neoin-dark', 
    };

    return colorMap[profile] || 'bg-salt hover:bg-salt-dark';
  };

  const profileButtonColor = getProfileColor(currentProfile);

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
        {availableProfiles.map((profile) => {
          // Determine the color for the profile indicator
          const colorClass = profile === 'Neoin' ? 'bg-neoin' : 'bg-salt';
          
          return (
            <DropdownMenuItem
              key={profile}
              onClick={() => setCurrentProfile(profile)}
              className={`flex items-center ${currentProfile === profile ? (profile === 'Neoin' ? 'bg-neoin/20' : 'bg-salt/20') : ''}`}
            >
              <div className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></div>
              {profile}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
