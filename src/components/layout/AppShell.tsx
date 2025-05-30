
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Camera, ChevronDown } from 'lucide-react';
import TopNavMenu from './TopNavMenu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout, updateUserAvatar, currentTenant } = useAuth();
  const { currentProfile, setCurrentProfile, availableProfiles } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const navigate = useNavigate();

  const handleAvatarChange = () => {
    if (avatarUrl) {
      updateUserAvatar(avatarUrl);
      setAvatarUrl('');
      setIsProfileOpen(false);
      toast.success('Foto de perfil atualizada com sucesso!');
    } else {
      toast.error('Por favor, insira um URL válido para a imagem');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Perfil alterado para ${profile}`);
  };

  const renderLogo = () => {
    if (currentTenant === 'NEOIN') {
      return (
        <div className="w-10 h-10 rounded-md flex items-center justify-center">
          <img 
            src="/lovable-uploads/4a3313d8-ccf0-4a4e-99e6-555ff916f513.png" 
            alt="NEOIN Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else if (currentProfile === 'GHF') {
      return (
        <div className="w-10 h-10 rounded-md flex items-center justify-center">
          <img 
            src="/lovable-uploads/f07b2db5-3e35-4bba-bda2-685a8fcae7d5.png" 
            alt="GHF Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
          <img 
            src="/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png" 
            alt="SALT Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation Bar */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-4">
            {renderLogo()}
            <h1 className="font-bold hidden sm:block">{currentProfile} CRM</h1>
          </div>

          {/* Center - Navigation */}
          <TopNavMenu />

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent relative group">
                    <Avatar className="w-8 h-8 border">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback>
                          <User size={16} />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={14} className="text-white" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Perfil do Usuário</h4>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt="Preview" />
                        ) : user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback>
                            <User size={24} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    {/* Profile Switcher */}
                    {availableProfiles.length > 1 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Perfil Ativo</label>
                        <Select value={currentProfile} onValueChange={handleProfileChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableProfiles.map((profile) => (
                              <SelectItem key={profile} value={profile}>
                                {profile}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Atualizar Foto</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole o URL de uma imagem da web
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAvatarChange}
                        disabled={!avatarUrl}
                      >
                        Atualizar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="hidden lg:block ml-2">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
