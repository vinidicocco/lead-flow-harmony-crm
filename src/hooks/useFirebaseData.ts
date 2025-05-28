
import { useState, useEffect } from 'react';

// Mock data structures to replace Firebase data
export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'qualified' | 'contacted' | 'proposal' | 'contract' | 'closed';
  value: number;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  leadName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Stats {
  totalLeads: number;
  newLeadsThisMonth: number;
  wonDealsThisMonth: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalLeads: 0,
        newLeadsThisMonth: 0,
        wonDealsThisMonth: 0,
        revenueThisMonth: 0,
        conversionRate: 0,
        averageDealSize: 0,
      });
      setLoading(false);
    }, 1000);
  }, []);

  return { stats, loading };
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeads([]);
      setLoading(false);
    }, 1000);
  }, []);

  return { leads, loading };
};

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMeetings([]);
      setLoading(false);
    }, 1000);
  }, []);

  return { meetings, loading };
};
