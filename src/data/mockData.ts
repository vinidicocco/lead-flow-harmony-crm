
import { Lead, Meeting, Task, Stats } from '@/types';

// No mock data - all empty arrays
export const mockLeads: Lead[] = [];
export const mockMeetings: Meeting[] = [];
export const mockTasks: Task[] = [];

export const mockStats: { [key in 'SALT' | 'GHF']: Stats } = {
  'SALT': {
    totalLeads: 0,
    newLeadsThisMonth: 0,
    wonDealsThisMonth: 0,
    revenueThisMonth: 0,
    conversionRate: 0,
    averageDealSize: 0
  },
  'GHF': {
    totalLeads: 0,
    newLeadsThisMonth: 0,
    wonDealsThisMonth: 0,
    revenueThisMonth: 0,
    conversionRate: 0,
    averageDealSize: 0
  }
};

// Functions that return real data from Firebase (empty arrays as fallback)
export const getLeadsByProfile = (profile: 'SALT' | 'GHF') => {
  return [];
};

export const getMeetingsByProfile = (profile: 'SALT' | 'GHF') => {
  return [];
};

export const getTasksByProfile = (profile: 'SALT' | 'GHF') => {
  return [];
};

export const getStatsByProfile = (profile: 'SALT' | 'GHF') => {
  return mockStats[profile];
};
