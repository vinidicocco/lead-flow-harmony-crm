import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, Tenant } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
  currentTenant: Tenant;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map organization IDs to tenant values
const organizationToTenant: Record<string, Tenant> = {
  // Add mappings for your organizations here
  // Example: "123e4567-e89b-12d3-a456-426614174000": "SALT_GHF"
};

// Profile mapping helper
const mapSupabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Fetch profile data from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();
    
    if (profileError) throw profileError;

    if (!profileData) {
      // Create default profile if not found
      console.log("Profile not found, creating default profile");
      const defaultProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.email?.split('@')[0] || 'User',
        last_name: '',
        role: 'USER',
        organization_id: null, // This will default to SALT_GHF later
        is_active: true
      };
      
      // Try to create a profile
      try {
        await supabase.from('profiles').insert([defaultProfile]);
      } catch (err) {
        console.error("Failed to create profile:", err);
      }
    }

    // Determine tenant based on organization_id
    let tenant: Tenant = 'SALT_GHF'; // Default tenant
    
    if (profileData?.organization_id) {
      // If we have a specific mapping for this organization, use it
      if (organizationToTenant[profileData.organization_id]) {
        tenant = organizationToTenant[profileData.organization_id];
      } else {
        // Otherwise, fetch the organization code to determine tenant
        const { data: orgData } = await supabase
          .from('organizations')
          .select('code')
          .eq('id', profileData.organization_id)
          .maybeSingle();
        
        // Map organization code to tenant
        if (orgData?.code === 'NEOIN') {
          tenant = 'NEOIN';
        } else {
          tenant = 'SALT_GHF'; // Default for all other organizations
        }
      }
    }
    
    return {
      id: supabaseUser.id,
      name: profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      profile: (profileData?.role || 'SALT') as 'SALT' | 'GHF' | 'NEOIN',
      tenant: tenant,
      isAdmin: profileData?.role === 'MASTER' || profileData?.role === 'ADMIN',
    };
  } catch (error) {
    console.error('Error mapping user:', error);
    // Return basic user info if profile fetch fails
    return {
      id: supabaseUser.id,
      name: supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      profile: 'SALT',
      tenant: 'SALT_GHF',
      isAdmin: false
    };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant>('SALT_GHF');
  const [session, setSession] = useState<Session | null>(null);

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // User is set via the onAuthStateChange listener
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso!"
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: error.message || "Falha na autenticação. Verifique suas credenciais."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update avatar in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (error) throw error;
        
      // Update local state
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('crm-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar a foto de perfil."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentTenant('SALT_GHF');
      localStorage.removeItem('crm-user');
      toast({
        title: "Logout concluído",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Não foi possível realizar o logout."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserAvatar, isLoading, currentTenant }}>
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
