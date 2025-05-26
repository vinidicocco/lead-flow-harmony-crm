
import { useState, useEffect } from 'react';
import { followUpsService, leadsService, communicationsService } from '@/services/firebaseService';
import { FollowUp } from '@/types/firestore';
import { useAuth } from '@/context/AuthContext';

export const useFollowUps = () => {
  const { user } = useAuth();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const result = await followUpsService.getByUserId(user.id);
      setFollowUps(result.documents as FollowUp[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerContact = async (followUpId: string, notes: string) => {
    try {
      const followUp = followUps.find(f => f.id === followUpId);
      if (!followUp) return { success: false, error: 'Follow-up não encontrado' };

      // Update follow-up with contact info
      await followUpsService.update(followUpId, {
        lastContact: new Date(),
        notes: notes,
        status: 'completed'
      });

      // Create communication record
      await communicationsService.create({
        organizationId: followUp.organizationId,
        leadId: followUp.leadId,
        type: 'call',
        direction: 'outbound',
        content: notes,
        status: 'completed'
      });

      // Update lead's last contact
      await leadsService.update(followUp.leadId, {
        lastContact: new Date().toISOString()
      });

      // Refresh follow-ups
      await fetchFollowUps();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error registering contact:', err);
      return { success: false, error: err.message };
    }
  };

  const scheduleNextFollowUp = async (leadId: string, dueDate: Date, notes: string) => {
    if (!user?.id || !user?.organizationId) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const followUpData = {
        organizationId: user.organizationId,
        leadId,
        userId: user.id,
        dueDate,
        status: 'pending' as const,
        notes
      };

      await followUpsService.create(followUpData);
      
      // Update lead's next follow-up date
      await leadsService.update(leadId, {
        nextFollowUp: dueDate.toISOString()
      });

      // Refresh follow-ups
      await fetchFollowUps();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error scheduling follow-up:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [user?.id]);

  return {
    followUps,
    loading,
    error,
    registerContact,
    scheduleNextFollowUp,
    refetch: fetchFollowUps
  };
};
