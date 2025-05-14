
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile } = useProfile();
  const { user } = useAuth();

  // Verificar se o usuário é MASTER
  const isMaster = user?.role === 'MASTER';
  
  // Se não for MASTER, o componente não permite mudança
  const isDisabled = !isMaster;

  // Sempre usar SALT color como default para todos os perfis
  const profileButtonColor = 'bg-salt hover:bg-salt-dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={`${profileButtonColor} gap-1 ${isDisabled ? 'opacity-80' : ''}`}
          disabled={isDisabled}
        >
          {currentProfile}
          {isMaster && <ChevronDown size={16} />}
        </Button>
      </DropdownMenuTrigger>
      {isMaster && (
        <DropdownMenuContent align="start" className="w-24">
          <DropdownMenuItem
            onClick={() => setCurrentProfile('SALT')}
            className={`flex items-center ${currentProfile === 'SALT' ? 'bg-salt/20' : ''}`}
          >
            <div className={`w-3 h-3 rounded-full bg-salt mr-2`}></div>
            SALT
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setCurrentProfile('GHF')}
            className={`flex items-center ${currentProfile === 'GHF' ? 'bg-salt/20' : ''}`}
          >
            <div className={`w-3 h-3 rounded-full bg-salt mr-2`}></div>
            GHF
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
