
import React from 'react';
import { Button } from "@/components/ui/button";
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import TopNavMenu from './TopNavMenu';
import ProfileSwitcher from './ProfileSwitcher';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { currentProfile } = useProfile();

  const profileStyle = currentProfile === 'SALT' 
    ? 'bg-salt-light' 
    : 'bg-ghf-light';

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation Bar */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Left side - Logo and Profile */}
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-md ${profileStyle} text-white flex items-center justify-center text-lg font-bold`}>
              {currentProfile}
            </div>
            <h1 className="font-bold hidden sm:block">{currentProfile} CRM</h1>
            <ProfileSwitcher />
          </div>

          {/* Center - Navigation */}
          <TopNavMenu />

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="hidden lg:block">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
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
