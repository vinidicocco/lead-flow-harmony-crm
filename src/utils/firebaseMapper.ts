import { User, Profile, Tenant } from '@/types';

export const mapFirebaseUserToUser = (firebaseUser: any): User => {
  // Determinar perfil com base no email
  let profile: Profile = 'SALT';
  let tenant: Tenant = 'SALT_GHF';
  let organizationId = 'salt-org-1';
  
  if (firebaseUser.email) {
    if (firebaseUser.email.includes('salt') || firebaseUser.email.includes('credito')) {
      profile = 'SALT';
      tenant = 'SALT_GHF';
      organizationId = 'salt-org-1';
    } else if (firebaseUser.email.includes('ghf') || firebaseUser.email.includes('hospitalar')) {
      profile = 'GHF';
      tenant = 'SALT_GHF';
      organizationId = 'ghf-org-1';
    } else if (firebaseUser.email.includes('neoin')) {
      profile = 'NEOIN';
      tenant = 'NEOIN';
      organizationId = 'neoin-org-1';
    }
  }

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || '',
    profile,
    tenant,
    isAdmin: false,
    organizationId
  };
};

export const createDefaultUserFromFirebase = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Usuário',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || '',
    profile: 'SALT',
    tenant: 'SALT_GHF',
    organizationId: 'salt-org-1'
  };
};
