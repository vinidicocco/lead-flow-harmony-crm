
import { useState, useEffect } from 'react';
import { agentConfigsService } from '@/services/firebaseService';
import { AgentConfig } from '@/types/firestore';
import { getOrganizationId } from '@/firebase/config';

export const useAgentConfig = () => {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const result = await agentConfigsService.getByOrganization();
      setConfig(result as AgentConfig);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching agent config:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (configData: Partial<AgentConfig>) => {
    try {
      setSaving(true);
      
      if (config?.id) {
        // Update existing config
        const updatedConfig = await agentConfigsService.update(config.id, configData);
        setConfig({ ...config, ...updatedConfig });
      } else {
        // Create new config
        const newConfig = await agentConfigsService.create({
          ...configData,
          organizationId: getOrganizationId() || 'default-org-id'
        });
        setConfig(newConfig as AgentConfig);
      }
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    saving,
    error,
    saveConfig,
    refetch: fetchConfig
  };
};
