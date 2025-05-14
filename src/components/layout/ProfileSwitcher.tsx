import React, { useEffect } from 'react';
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
import { cn } from '@/lib/utils';

const ProfileSwitcher = () => {
  const { currentProfile, setCurrentProfile, organizations } = useProfile();
  const { user, isSuperAdmin } = useAuth();

  const handleProfileChange = (profile: Profile) => {
    setCurrentProfile(profile);
    toast.success(`Switched to ${profile} profile`);
  };

  // Get available profiles based on user role
  const getAvailableProfiles = () => {
    if (!user) return [];
    
    // Super admin can see all organizations
    if (isSuperAdmin()) {
      return organizations;
    }
    
    // Other users can only see their own organization
    return organizations.filter(org => org.id === user.orgId);
  };

  const availableProfiles = getAvailableProfiles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-salt hover:bg-salt-dark gap-1"
        >
          {currentProfile}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {availableProfiles.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleProfileChange(org.name)}
            className={cn(
              "flex items-center",
              currentProfile === org.name ? "bg-salt/20" : ""
            )}
          >
            <div className="w-6 h-6 rounded-full mr-2 overflow-hidden">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-salt flex items-center justify-center text-white text-xs">
                  {org.name.substring(0, 2)}
                </div>
              )}
            </div>
            {org.name}
          </DropdownMenuItem>
        ))}

        {isSuperAdmin() && (
          <DropdownMenuItem
            onClick={() => {
              // This would open a modal or redirect to organization management
              toast.info('Organization management will be available in the admin panel');
            }}
            className="border-t mt-1 pt-1"
          >
            <div className="w-6 h-6 rounded-full mr-2 flex items-center justify-center bg-gray-100">
              +
            </div>
            Manage Organizations
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
