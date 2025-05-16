
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, Tenant } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from './types/AuthTypes';
import { mapSupabaseUserToAppUser } from '@/utils/userMapper';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const [session, setSession] = useState<Session | null>(null);

  const { login, updateUserAvatar, logout } = useAuthOperations(setUser, setIsLoading);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          // We use setTimeout to avoid potential Supabase auth deadlocks
          setTimeout(async () => {
            const mappedUser = await mapSupabaseUserToAppUser(session.user);
            setUser(mappedUser);
            setCurrentTenant(mappedUser.tenant);
            localStorage.setItem('crm-user', JSON.stringify(mappedUser));
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('crm-user');
          setIsLoading(false);
        }
        
        setSession(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = await mapSupabaseUserToAppUser(session.user);
        setUser(mappedUser);
        setCurrentTenant(mappedUser.tenant);
        localStorage.setItem('crm-user', JSON.stringify(mappedUser));
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserAvatar, 
      isLoading, 
      currentTenant 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
