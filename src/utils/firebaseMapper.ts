
import { User as FirebaseUser } from 'firebase/auth';
import { User, Profile, Tenant } from '@/types';
import { FirestoreUser } from '@/types/firestore';
import { usersService } from '@/services/firebaseService';
import { getOrganizationId } from '@/firebase/config';

// Map organization to profile and tenant
const getProfileAndTenant = (orgId: string | null): { profile: Profile; tenant: Tenant } => {
  const orgMap: Record<string, { profile: Profile; tenant: Tenant }> = {
    'salt-org-id': { profile: 'SALT', tenant: 'SALT_GHF' },
    'ghf-org-id': { profile: 'GHF', tenant: 'SALT_GHF' },
    'neoin-org-id': { profile: 'NEOIN', tenant: 'NEOIN' }
  };

  return orgMap[orgId || 'default-org-id'] || { profile: 'SALT', tenant: 'SALT_GHF' };
};

export const mapFirebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Get additional user data from Firestore
    let userData = await usersService.getByEmail(firebaseUser.email || '') as FirestoreUser | null;
    
    // Get organization context
    const orgId = getOrganizationId();
    const { profile, tenant } = getProfileAndTenant(orgId);
    
    // If user doesn't exist in Firestore, create it
    if (!userData) {
      const newUserData = {
        name: firebaseUser.displayName || 'Usuário',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || '',
        profile,
        tenant,
        isAdmin: false,
        organizationId: orgId || 'default-org-id'
      };
      
      userData = await usersService.create(newUserData) as FirestoreUser;
    }
    
    // Create user with Firebase Auth and Firestore data
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'Usuário',
      email: userData.email || firebaseUser.email || '',
      avatar: userData.avatar || firebaseUser.photoURL || '',
      profile: userData.profile || profile,
      tenant: userData.tenant || tenant,
      isAdmin: userData.isAdmin || false
    };
  } catch (error) {
    console.error('Error mapping Firebase user:', error);
    
    // Return basic user in case of error
    const { profile, tenant } = getProfileAndTenant(getOrganizationId());
    
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Usuário',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || '',
      profile,
      tenant
    };
  }
};
