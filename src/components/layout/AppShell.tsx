
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Camera, Shield } from 'lucide-react';
import TopNavMenu from './TopNavMenu';
import ProfileSwitcher from './ProfileSwitcher';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import AdminNavMenu from './AdminNavMenu';

interface AppShellProps {
  children: React.ReactNode;
  isAdminShell?: boolean;
}

const AppShell: React.FC<AppShellProps> = ({ children, isAdminShell = false }) => {
  const { user, logout, updateUserAvatar, isSuperAdmin } = useAuth();
  const { currentProfile, currentOrganization } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const profileStyle = isAdminShell 
    ? 'bg-gray-800' 
    : (currentProfile === 'SALT' 
      ? 'bg-salt-light' 
      : 'bg-salt-light');

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

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation Bar */}
      <header className={`border-b ${isAdminShell ? 'bg-gray-900 text-white' : 'bg-background'}`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Left side - Logo and Profile */}
          <div className="flex items-center gap-4">
            {isAdminShell ? (
              <div className="w-10 h-10 rounded-md flex items-center justify-center bg-white">
                <Shield className="text-gray-900" size={20} />
              </div>
            ) : currentProfile === 'GHF' ? (
              <div className="w-10 h-10 rounded-md flex items-center justify-center">
                <img 
                  src="/lovable-uploads/f07b2db5-3e35-4bba-bda2-685a8fcae7d5.png" 
                  alt="GHF Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
                <img 
                  src="/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png" 
                  alt="SALT Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <h1 className="font-bold hidden sm:block">
              {isAdminShell ? (
                'System Administration'
              ) : (
                `${currentProfile} CRM`
              )}
            </h1>
            
            {!isAdminShell && <ProfileSwitcher />}
          </div>

          {/* Center - Navigation */}
          {isAdminShell ? <AdminNavMenu /> : <TopNavMenu />}

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-2">
            {/* Admin panel link for super admins */}
            {isSuperAdmin() && !isAdminShell && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <Shield size={14} />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </Link>
            )}

            {/* Back to main app button when in admin mode */}
            {isAdminShell && (
              <Link to="/">
                <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-gray-800">
                  Back to App
                </Button>
              </Link>
            )}
            
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
                    <h4 className="font-medium">Atualizar Foto de Perfil</h4>
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
                        <p className="text-xs mt-1 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                          {user?.role === 'super_admin' ? 'Super Admin' : 
                           user?.role === 'org_admin' ? 'Org Admin' : 'User'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">URL da Imagem</label>
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
                <p className={`text-xs ${isAdminShell ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role === 'super_admin' ? 'Super Admin' : 
                   user?.role === 'org_admin' ? 'Org Admin' : 'User'}
                </p>
              </div>
            </div>
            <Button 
              variant={isAdminShell ? "outline" : "ghost"} 
              size="icon" 
              onClick={logout} 
              title="Logout"
              className={isAdminShell ? "text-white border-gray-700 hover:bg-gray-800" : ""}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${isAdminShell ? 'bg-gray-950 text-white' : ''}`}>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
