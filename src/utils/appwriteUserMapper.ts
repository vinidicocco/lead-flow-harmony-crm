
import { User as AppwriteUser } from 'appwrite';
import { User, Tenant } from '@/types';
import { dbService } from '@/integrations/appwrite/database';
import { getTenantByOrganizationId } from './organizationUtils';

// Profile mapping helper for Appwrite users
export const mapAppwriteUserToAppUser = async (appwriteUser: AppwriteUser): Promise<User> => {
  try {
    // Fetch profile data from profiles collection
    const profileData = await dbService.profiles.getByUserId(appwriteUser.$id);
    
    if (!profileData) {
      // Create default profile if not found
      console.log("Profile not found, creating default profile");
      const defaultProfile = {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        first_name: appwriteUser.name.split(' ')[0] || 'User',
        last_name: appwriteUser.name.split(' ').slice(1).join(' ') || '',
        role: 'USER',
        organization_id: null, // This will default to SALT_GHF later
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to create a profile
      try {
        await dbService.profiles.create(defaultProfile);
      } catch (err) {
        console.error("Failed to create profile:", err);
      }
    }

    // Determine tenant based on organization_id
    const tenant = await getTenantByOrganizationId(profileData?.organization_id || null);
    
    return {
      id: appwriteUser.$id,
      name: profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : appwriteUser.name || appwriteUser.email?.split('@')[0] || 'User',
      email: appwriteUser.email || '',
      avatar: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appwriteUser.email}`,
      profile: (profileData?.role || 'SALT') as 'SALT' | 'GHF' | 'NEOIN',
      tenant: tenant,
      isAdmin: profileData?.role === 'MASTER' || profileData?.role === 'ADMIN',
    };
  } catch (error) {
    console.error('Error mapping user:', error);
    // Return basic user info if profile fetch fails
    return {
      id: appwriteUser.$id,
      name: appwriteUser.name || appwriteUser.email?.split('@')[0] || 'User',
      email: appwriteUser.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${appwriteUser.email}`,
      profile: 'SALT',
      tenant: 'SALT_GHF',
      isAdmin: false
    };
  }
};
