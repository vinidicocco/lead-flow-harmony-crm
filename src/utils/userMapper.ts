import { User, Profile, Tenant } from '@/types';

export const mapGenericUserToUser = (genericUser: any): User => {
  // Determinar perfil com base no email
  let profile: Profile = 'SALT';
  let tenant: Tenant = 'SALT_GHF';
  let organizationId = 'salt-org-1';
  
  if (genericUser.email) {
    if (genericUser.email.includes('salt') || genericUser.email.includes('credito')) {
      profile = 'SALT';
      tenant = 'SALT_GHF';
      organizationId = 'salt-org-1';
    } else if (genericUser.email.includes('ghf') || genericUser.email.includes('hospitalar')) {
      profile = 'GHF';
      tenant = 'SALT_GHF';
      organizationId = 'ghf-org-1';
    } else if (genericUser.email.includes('neoin')) {
      profile = 'NEOIN';
      tenant = 'NEOIN';
      organizationId = 'neoin-org-1';
    }
  }

  return {
    id: genericUser.id || 'user-1',
    name: genericUser.name || 'Usuário Padrão',
    email: genericUser.email || 'user@salt.com.br',
    avatar: genericUser.avatar || '',
    profile,
    tenant,
    isAdmin: genericUser.isAdmin || false,
    organizationId
  };
};

export const createDefaultUser = (): User => {
  return {
    id: 'user-1',
    name: 'Usuário Padrão',
    email: 'user@salt.com.br',
    avatar: '',
    profile: 'SALT',
    tenant: 'SALT_GHF',
    isAdmin: false,
    organizationId: 'salt-org-1'
  };
};
