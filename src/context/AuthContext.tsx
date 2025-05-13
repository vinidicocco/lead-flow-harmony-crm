
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
    isAdmin: true // This user is an admin
  },
  {
    id: '2',
    name: 'GHF User',
    email: 'ghf@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghf',
    profile: 'GHF',
    isAdmin: false // Regular user
  }
];

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm-user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
