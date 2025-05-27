
import { useState, useEffect } from 'react';
import { leadsService } from '@/services/firebaseService';
import { Lead } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useLeadsByStatus = () => {
  const [leadsByStatus, setLeadsByStatus] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLeadsByStatus = async () => {
    if (!user?.organizationId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const result = await leadsService.getAll();
      const leads = result.documents as Lead[];
      
      // Group leads by status
      const grouped = leads.reduce((acc: Record<string, Lead[]>, lead) => {
        const status = lead.status as string || 'qualified';
        if (!acc[status]) acc[status] = [];
        acc[status].push(lead);
        return acc;
      }, {});
      
      setLeadsByStatus(grouped);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching leads by status:', err);
      setLeadsByStatus({});
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await leadsService.update(leadId, { status: newStatus as Lead['status'] });
      await fetchLeadsByStatus(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error('Error updating lead status:', err);
      return { success: false, error: err.message };
    }
  };

  const getTotalValueByStatus = (status: string) => {
    const statusLeads = leadsByStatus[status] || [];
    return statusLeads.reduce((total, lead) => total + (lead.value || 0), 0);
  };

  useEffect(() => {
    fetchLeadsByStatus();
  }, [user?.organizationId]);

  return {
    leadsByStatus,
    loading,
    error,
    updateLeadStatus,
    getTotalValueByStatus,
    refetch: fetchLeadsByStatus
  };
};
