
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { Profile } from '@/types';
import { toast } from 'sonner';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile } = useProfile();

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Switched to ${profile} profile`);
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button
        variant={currentProfile === 'SALT' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleProfileChange('SALT')}
        className={currentProfile === 'SALT' ? 'bg-salt hover:bg-salt-dark' : ''}
      >
        SALT
      </Button>
      <Button
        variant={currentProfile === 'GHF' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleProfileChange('GHF')}
        className={currentProfile === 'GHF' ? 'bg-ghf hover:bg-ghf-dark' : ''}
      >
        GHF
      </Button>
    </div>
  );
};

export default ProfileSwitcher;
