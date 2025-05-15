
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant } from '@/types';
import { toast } from "sonner";
import { getDataByTenant } from '@/data/mockDataWrapper';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
  currentTenant: Tenant;
  tenantData: ReturnType<typeof getDataByTenant>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'SALT User',
    email: 'salt@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salt',
    profile: 'SALT',
    tenant: 'SALT_GHF',
    isAdmin: true // This user is an admin
  },
  {
    id: '2',
    name: 'GHF User',
    email: 'ghf@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghf',
    profile: 'GHF',
    tenant: 'SALT_GHF',
    isAdmin: false // Regular user
  },
  {
    id: '3',
    name: 'NEOIN User',
    email: 'neoin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neoin',
    profile: 'NEOIN',
    tenant: 'NEOIN',
    isAdmin: true // Admin for NEOIN
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const tenantData = getDataByTenant(currentTenant);
  
  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('crm-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setCurrentTenant(parsedUser.tenant);
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
        setCurrentTenant(foundUser.tenant);
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserAvatar, 
      isLoading, 
      currentTenant,
      tenantData
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
