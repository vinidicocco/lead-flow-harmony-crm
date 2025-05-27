import { User, Profile, Tenant } from '@/types';

export const mapAppwriteUserToUser = (appwriteUser: any, organizations: any[]): User => {
  // Determinar perfil com base no email
  let profile: Profile = 'SALT';
  let tenant: Tenant = 'SALT_GHF';
  
  if (appwriteUser.email) {
    if (appwriteUser.email.includes('salt') || appwriteUser.email.includes('credito')) {
      profile = 'SALT';
      tenant = 'SALT_GHF';
    } else if (appwriteUser.email.includes('ghf') || appwriteUser.email.includes('hospitalar')) {
      profile = 'GHF';
      tenant = 'SALT_GHF';
    } else if (appwriteUser.email.includes('neoin')) {
      profile = 'NEOIN';
      tenant = 'NEOIN';
    }
  }
  
  // Determinar organizationId com base no perfil
  const organizationId = organizations.find(org => 
    org.code === profile || org.name.toLowerCase().includes(profile.toLowerCase())
  )?.id || 'default-org';

  return {
    id: appwriteUser.$id,
    name: appwriteUser.name,
    email: appwriteUser.email,
    avatar: appwriteUser.avatar,
    profile,
    tenant,
    isAdmin: appwriteUser.prefs?.isAdmin || false,
    organizationId
  };
};

export const createDefaultUser = (): User => {
  return {
    id: 'default-user',
    name: 'Usuário Padrão',
    email: 'user@salt.com.br',
    avatar: '',
    profile: 'SALT',
    tenant: 'SALT_GHF',
    isAdmin: false,
    organizationId: 'salt-org-1'
  };
};
