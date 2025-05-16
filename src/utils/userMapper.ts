
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Tenant } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { getTenantByOrganizationId } from './organizationUtils';

// Profile mapping helper
export const mapSupabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Fetch profile data from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

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
    const tenant = await getTenantByOrganizationId(profileData?.organization_id || null);
    
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
