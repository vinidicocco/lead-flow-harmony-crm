
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile, availableProfiles } = useProfile();
  const { user } = useAuth();

  // Verificar se o usuário é MASTER
  const isMaster = user?.role === 'MASTER';
  
  // Se não for MASTER, o componente não permite mudança
  const isDisabled = !isMaster;

  // Cores dinamicamente adaptadas para qualquer perfil
  // Usar SALT color como fallback para profiles sem cor definida
  const getProfileColor = (profile: string) => {
    // Aqui podemos adicionar mais cores conforme necessário
    const colorMap: Record<string, string> = {
      'SALT': 'bg-salt hover:bg-salt-dark',
      'GHF': 'bg-salt hover:bg-salt-dark', // Usando mesma cor por enquanto
      'Neoin': 'bg-neoin hover:bg-neoin-dark', // Adicionado cores para Neoin
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
          className={`${profileButtonColor} gap-1 ${isDisabled ? 'opacity-80' : ''}`}
          disabled={isDisabled}
        >
          {currentProfile}
          {isMaster && <ChevronDown size={16} />}
        </Button>
      </DropdownMenuTrigger>
      {isMaster && (
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
      )}
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
