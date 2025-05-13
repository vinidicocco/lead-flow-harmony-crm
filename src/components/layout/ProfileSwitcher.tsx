
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
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
  const { currentProfile, setCurrentProfile } = useProfile();

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Switched to ${profile} profile`);
  };

  // Always use SALT color as default for all profiles
  const profileButtonColor = 'bg-salt hover:bg-salt-dark';

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
        <DropdownMenuItem
          onClick={() => handleProfileChange('SALT')}
          className={`flex items-center ${currentProfile === 'SALT' ? 'bg-salt/20' : ''}`}
        >
          <div className={`w-3 h-3 rounded-full bg-salt mr-2`}></div>
          SALT
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleProfileChange('GHF')}
          className={`flex items-center ${currentProfile === 'GHF' ? 'bg-salt/20' : ''}`}
        >
          <div className={`w-3 h-3 rounded-full bg-salt mr-2`}></div>
          GHF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
