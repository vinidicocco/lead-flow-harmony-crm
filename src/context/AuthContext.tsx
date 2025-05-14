
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo with enhanced roles
const mockUsers: User[] = [
  {
    id: '1',
    name: 'System Admin',
    email: 'admin@system.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    profile: 'SYSTEM',
    role: 'super_admin',
    orgId: '0',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'SALT Admin',
    email: 'salt@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salt',
    profile: 'SALT',
    role: 'org_admin',
    orgId: 'salt-org',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'GHF Admin',
    email: 'ghf@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghf',
    profile: 'GHF',
    role: 'org_admin',
    orgId: 'ghf-org',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'SALT User',
    email: 'saltuser@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saltuser',
    profile: 'SALT',
    role: 'org_user',
    orgId: 'salt-org',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'GHF User',
    email: 'ghfuser@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghfuser',
    profile: 'GHF',
    role: 'org_user',
    orgId: 'ghf-org',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Define role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ['all'],
  org_admin: ['manage_users', 'manage_leads', 'manage_meetings', 'manage_tasks', 'view_reports', 'manage_settings'],
  org_user: ['view_leads', 'edit_leads', 'view_meetings', 'edit_meetings', 'view_tasks', 'edit_tasks']
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('crm-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('crm-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo login logic
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // Simple demo password
        setUser(foundUser);
        localStorage.setItem('crm-user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('crm-user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm-user');
    toast.info('You have been logged out');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    
    // Check if user's role has the specified permission
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission) || permissions.includes('all');
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  const isOrgAdmin = () => {
    return user?.role === 'org_admin' || user?.role === 'super_admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserAvatar, 
      isLoading, 
      hasPermission,
      isSuperAdmin,
      isOrgAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
