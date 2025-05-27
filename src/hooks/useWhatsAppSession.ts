
import { useState, useEffect } from 'react';
import { getOrganizationId } from '@/firebase/config';
import { dbService } from '@/services/firebaseService';
import { collections } from '@/services/firebaseService';
import { WhatsAppSession as WhatsAppSessionType } from '@/types/firestore';

interface WhatsAppSession {
  status: 'connected' | 'disconnected' | 'connecting';
  qrCode?: string;
  lastConnection?: Date;
  phoneNumber?: string;
}

export const useWhatsAppSession = () => {
  const [session, setSession] = useState<WhatsAppSession>({
    status: 'disconnected',
    qrCode: undefined,
    lastConnection: undefined,
    phoneNumber: undefined
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const orgId = getOrganizationId();
      
      if (!orgId) {
        throw new Error('Organization ID not found');
      }
      
      const result = await dbService.query(collections.WHATSAPP_SESSIONS, [
        // Note: Using organization filter from dbService
      ]);
      
      if (result.documents.length > 0) {
        const sessionData = result.documents[0] as WhatsAppSessionType;
        setSession({
          status: sessionData.status || 'disconnected',
          qrCode: sessionData.qrCode,
          lastConnection: sessionData.lastActivity ? new Date(sessionData.lastActivity) : undefined,
          phoneNumber: sessionData.phoneNumber
        });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching WhatsApp session:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectWhatsApp = async () => {
    try {
      setLoading(true);
      // This would typically call a Cloud Function to initiate WhatsApp connection
      console.log('Connecting WhatsApp...');
      // For now, simulate connection
      setSession(prev => ({ ...prev, status: 'connecting' }));
      
      // Simulate delay
      setTimeout(() => {
        setSession(prev => ({ 
          ...prev, 
          status: 'connected',
          lastConnection: new Date(),
          phoneNumber: '+55 11 99999-9999'
        }));
        setLoading(false);
      }, 3000);
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      setSession(prev => ({ ...prev, status: 'disconnected', qrCode: undefined }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    session,
    loading,
    error,
    connectWhatsApp,
    disconnectWhatsApp,
    refetch: fetchSession
  };
};
