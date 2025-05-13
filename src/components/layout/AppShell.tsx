
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import NavMenu from './NavMenu';
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
    <div className="min-h-screen flex w-full">
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-lg ${profileStyle} text-white flex items-center justify-center text-xl font-bold mb-2`}>
            {currentProfile}
          </div>
          <h1 className="text-lg font-bold">{currentProfile} CRM</h1>
          <ProfileSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMenu />
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut size={18} />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
