
import { useState, useEffect } from 'react';
import { communicationsService, leadsService, meetingsService } from '@/services/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { Communication } from '@/types/firestore';

interface AgentMetrics {
  messagesSent: number;
  activeConversations: number;
  qualifiedLeads: number;
  scheduledMeetings: number;
  conversionRate: number;
}

export const useAgentMetrics = () => {
  const [metrics, setMetrics] = useState<AgentMetrics>({
    messagesSent: 0,
    activeConversations: 0,
    qualifiedLeads: 0,
    scheduledMeetings: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMetrics = async () => {
    if (!user?.organizationId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [messagesResult, leadsResult, meetingsResult] = await Promise.all([
        communicationsService.getAll(),
        leadsService.getAll(),
        meetingsService.getAll()
      ]);
      
      const messages = messagesResult.documents as Communication[];
      const leads = leadsResult.documents;
      const meetings = meetingsResult.documents;
      
      // Calculate metrics
      const messagesSent = messages.filter(m => m.direction === 'outbound').length;
      const activeConversations = messages.filter(m => m.status === 'active').length;
      const qualifiedLeads = leads.filter(l => (l as any).status === 'qualified').length;
      const scheduledMeetings = meetings.filter(m => (m as any).status === 'scheduled').length;
      
      const conversionRate = qualifiedLeads > 0 && scheduledMeetings > 0 
        ? Math.round((scheduledMeetings / qualifiedLeads) * 100) 
        : 0;
      
      setMetrics({
        messagesSent,
        activeConversations,
        qualifiedLeads,
        scheduledMeetings,
        conversionRate
      });
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching agent metrics:', err);
      setMetrics({
        messagesSent: 0,
        activeConversations: 0,
        qualifiedLeads: 0,
        scheduledMeetings: 0,
        conversionRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [user?.organizationId]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};
