
import { 
  getLeadsByProfile as originalGetLeadsByProfile, 
  getTasksByProfile as originalGetTasksByProfile,
  getMeetingsByProfile as originalGetMeetingsByProfile,
  getStatsByProfile as originalGetStatsByProfile
} from '@/data/mockData';
import { Lead, Meeting, Stats, Task, Profile } from '@/types';

// Helper wrapper functions that handle all Profile types
export const getLeadsByProfile = (profile: Profile): Lead[] => {
  // If profile is NEOIN, default to SALT data for now
  if (profile === 'NEOIN') {
    return originalGetLeadsByProfile('SALT');
  }
  return originalGetLeadsByProfile(profile);
};

export const getTasksByProfile = (profile: Profile): Task[] => {
  if (profile === 'NEOIN') {
    return originalGetTasksByProfile('SALT');
  }
  return originalGetTasksByProfile(profile);
};

export const getMeetingsByProfile = (profile: Profile): Meeting[] => {
  if (profile === 'NEOIN') {
    return originalGetMeetingsByProfile('SALT');
  }
  return originalGetMeetingsByProfile(profile);
};

export const getStatsByProfile = (profile: Profile): Stats => {
  if (profile === 'NEOIN') {
    return originalGetStatsByProfile('SALT');
  }
  return originalGetStatsByProfile(profile);
};
