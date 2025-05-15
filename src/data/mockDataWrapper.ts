
import { getLeadsByProfile as originalGetLeadsByProfile, 
         getMeetingsByProfile as originalGetMeetingsByProfile, 
         getTasksByProfile as originalGetTasksByProfile, 
         getStatsByProfile as originalGetStatsByProfile } from './mockData';
import { Profile, Lead, Meeting, Task, Stats, Tenant } from '@/types';

// Helper function to generate NEOIN-specific mock data based on SALT data
const convertToNEOINData = <T extends { profile: Profile }>(data: T[]): T[] => {
  return data.map(item => ({
    ...item,
    profile: 'NEOIN' as Profile
  }));
};

// Wrapper for leads data
export const getLeadsByProfile = (profile: Profile): Lead[] => {
  if (profile === 'NEOIN') {
    const saltLeads = originalGetLeadsByProfile('SALT');
    return convertToNEOINData(saltLeads);
  }
  return originalGetLeadsByProfile(profile as 'SALT' | 'GHF');
};

// Wrapper for meetings data
export const getMeetingsByProfile = (profile: Profile): Meeting[] => {
  if (profile === 'NEOIN') {
    const saltMeetings = originalGetMeetingsByProfile('SALT');
    return convertToNEOINData(saltMeetings);
  }
  return originalGetMeetingsByProfile(profile as 'SALT' | 'GHF');
};

// Wrapper for tasks data
export const getTasksByProfile = (profile: Profile): Task[] => {
  if (profile === 'NEOIN') {
    const saltTasks = originalGetTasksByProfile('SALT');
    return convertToNEOINData(saltTasks);
  }
  return originalGetTasksByProfile(profile as 'SALT' | 'GHF');
};

// Wrapper for stats data
export const getStatsByProfile = (profile: Profile): Stats => {
  if (profile === 'NEOIN') {
    // Return SALT stats with slightly modified values for NEOIN
    const saltStats = originalGetStatsByProfile('SALT');
    return {
      ...saltStats,
      totalLeads: saltStats.totalLeads - 5,
      revenueThisMonth: saltStats.revenueThisMonth * 1.2,
      averageDealSize: saltStats.averageDealSize * 1.1
    };
  }
  return originalGetStatsByProfile(profile as 'SALT' | 'GHF');
};

// New tenant-specific functions
export const getDataByTenant = (tenant: Tenant) => {
  switch (tenant) {
    case 'SALT_GHF':
      return {
        name: 'SALT/GHF Group',
        availableProfiles: ['SALT', 'GHF'] as Profile[],
        defaultProfile: 'SALT' as Profile,
        primaryColor: '#0891b2', // Cyan
        secondaryColor: '#06b6d4',
        logoUrl: tenant === 'SALT_GHF' ? '/lovable-uploads/fd91fbcc-643d-49e8-84a7-5988b6024237.png' : null
      };
    case 'NEOIN':
      return {
        name: 'NEOIN',
        availableProfiles: ['NEOIN'] as Profile[],
        defaultProfile: 'NEOIN' as Profile,
        primaryColor: '#FBB02F', // Amarelo NEOIN
        secondaryColor: '#FFC75F',
        logoUrl: '/lovable-uploads/d6af1cbe-2fa0-45e8-86de-83a05ffc0d1d.png'
      };
    default:
      return getDataByTenant('SALT_GHF');
  }
};

// Helper to check if a profile belongs to a tenant
export const isProfileInTenant = (profile: Profile, tenant: Tenant): boolean => {
  const tenantData = getDataByTenant(tenant);
  return tenantData.availableProfiles.includes(profile);
};
