
import { getLeadsByProfile, getMeetingsByProfile, getTasksByProfile, getStatsByProfile } from './mockData';
import { Lead, Meeting, Task, Stats } from '@/types';

// Create wrapper functions that accept any string as profile
export const getLeadsForProfile = (profile: string) => getLeadsByProfile(profile as "SALT" | "GHF");
export const getMeetingsForProfile = (profile: string) => getMeetingsByProfile(profile as "SALT" | "GHF");
export const getTasksForProfile = (profile: string) => getTasksByProfile(profile as "SALT" | "GHF");
export const getStatsForProfile = (profile: string) => getStatsByProfile(profile as "SALT" | "GHF");
