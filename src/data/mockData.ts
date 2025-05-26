
import { Lead, Meeting, Task, Stats } from '@/types';
import { generateMockLeads, generateMockMeetings, generateMockTasks } from '@/utils/mockDataGenerator';

// Usar dados gerados pelo utilitário
export const mockLeads: Lead[] = generateMockLeads();
export const mockMeetings: Meeting[] = generateMockMeetings();
export const mockTasks: Task[] = generateMockTasks();

export const mockStats: { [key in 'SALT' | 'GHF']: Stats } = {
  'SALT': {
    totalLeads: 64,
    newLeadsThisMonth: 12,
    wonDealsThisMonth: 4,
    revenueThisMonth: 540000,
    conversionRate: 23.5,
    averageDealSize: 135000
  },
  'GHF': {
    totalLeads: 52,
    newLeadsThisMonth: 9,
    wonDealsThisMonth: 3,
    revenueThisMonth: 420000,
    conversionRate: 21.8,
    averageDealSize: 140000
  }
};

// Função para obter dados filtrados por perfil
export const getLeadsByProfile = (profile: 'SALT' | 'GHF') => {
  return mockLeads.filter(lead => lead.profile === profile);
};

export const getMeetingsByProfile = (profile: 'SALT' | 'GHF') => {
  return mockMeetings.filter(meeting => meeting.profile === profile);
};

export const getTasksByProfile = (profile: 'SALT' | 'GHF') => {
  return mockTasks.filter(task => task.profile === profile);
};

export const getStatsByProfile = (profile: 'SALT' | 'GHF') => {
  return mockStats[profile];
};
