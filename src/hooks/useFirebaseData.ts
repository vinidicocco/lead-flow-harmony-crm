
import { useState, useEffect } from 'react';
import { leadsService, meetingsService, followUpsService } from '@/services/firebaseService';
import { Lead, Meeting, Stats, Profile } from '@/types';
import { FirestoreLead, FirestoreMeeting, FollowUp } from '@/types/firestore';
import { useProfile } from '@/context/ProfileContext';

export const useLeads = (profile?: Profile) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile } = useProfile();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const targetProfile = profile || currentProfile;
      const result = targetProfile 
        ? await leadsService.getByProfile(targetProfile)
        : await leadsService.getAll();
      
      const firestoreLeads = result.documents as FirestoreLead[];
      const mappedLeads: Lead[] = firestoreLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        position: lead.position,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        value: lead.value,
        notes: lead.notes,
        assignedTo: lead.assignedTo,
        profile: lead.profile,
        nextFollowUp: lead.nextFollowUp,
        lastContact: lead.lastContact,
        createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: lead.updatedAt instanceof Date ? lead.updatedAt.toISOString() : new Date().toISOString()
      }));
      
      setLeads(mappedLeads);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [profile, currentProfile]);

  return { leads, loading, error, refetch: fetchLeads };
};

export const useMeetings = (profile?: Profile) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile } = useProfile();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const targetProfile = profile || currentProfile;
      const result = targetProfile 
        ? await meetingsService.getByProfile(targetProfile)
        : await meetingsService.getAll();
      
      const firestoreMeetings = result.documents as FirestoreMeeting[];
      const mappedMeetings: Meeting[] = firestoreMeetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        duration: meeting.duration,
        leadId: meeting.leadId,
        leadName: meeting.leadName,
        notes: meeting.notes,
        status: meeting.status,
        profile: meeting.profile
      }));
      
      setMeetings(mappedMeetings);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [profile, currentProfile]);

  return { meetings, loading, error, refetch: fetchMeetings };
};

export const useFollowUps = (userId?: string) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const result = userId 
        ? await followUpsService.getByUserId(userId)
        : await followUpsService.getAll();
      
      setFollowUps(result.documents as FollowUp[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [userId]);

  return { followUps, loading, error, refetch: fetchFollowUps };
};

export const useStats = (profile?: Profile) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProfile } = useProfile();

  const calculateStats = async () => {
    try {
      setLoading(true);
      const targetProfile = profile || currentProfile;
      const leadsResult = targetProfile 
        ? await leadsService.getByProfile(targetProfile)
        : await leadsService.getAll();
      
      const allLeads = leadsResult.documents as FirestoreLead[];
      
      // Calculate stats from real data
      const totalLeads = allLeads.length;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthLeads = allLeads.filter(lead => {
        const createdDate = lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      });
      
      const wonDeals = allLeads.filter(lead => lead.status === 'closed');
      const wonThisMonth = wonDeals.filter(lead => {
        const updatedDate = lead.updatedAt instanceof Date ? lead.updatedAt : new Date(lead.updatedAt);
        return updatedDate.getMonth() === currentMonth && 
               updatedDate.getFullYear() === currentYear;
      });
      
      const revenueThisMonth = wonThisMonth.reduce((sum, lead) => sum + lead.value, 0);
      const averageDealSize = wonDeals.length > 0 
        ? wonDeals.reduce((sum, lead) => sum + lead.value, 0) / wonDeals.length 
        : 0;
      
      const conversionRate = totalLeads > 0 ? (wonDeals.length / totalLeads) * 100 : 0;

      const calculatedStats: Stats = {
        totalLeads,
        newLeadsThisMonth: thisMonthLeads.length,
        wonDealsThisMonth: wonThisMonth.length,
        revenueThisMonth,
        conversionRate: Math.round(conversionRate * 10) / 10,
        averageDealSize: Math.round(averageDealSize)
      };

      setStats(calculatedStats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error calculating stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [profile, currentProfile]);

  return { stats, loading, error, refetch: calculateStats };
};
