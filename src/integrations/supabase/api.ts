
import { supabase } from './client';
import { User, Profile, Tenant } from '@/types';

// Profile Service
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async updateProfile(userId: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    return data;
  },
};

// Organization Service
export const organizationService = {
  async getOrganization(organizationId: string) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async getAllOrganizations() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');
      
    if (error) throw error;
    return data || [];
  },
};

// Agent Config Service
export const agentConfigService = {
  async getAgentConfigs(organizationId?: string) {
    let query = supabase.from('agent_configs').select('*');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },
  
  async getAgentConfig(id: string) {
    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async updateAgentConfig(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('agent_configs')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
    return data;
  },
  
  async createAgentConfig(config: any) {
    const { data, error } = await supabase
      .from('agent_configs')
      .insert([config])
      .select();
      
    if (error) throw error;
    return data?.[0];
  },
};

// Knowledge Base Service (using Storage)
export const knowledgeBaseService = {
  async uploadDocument(fileName: string, file: File, organizationId: string) {
    // Create a structured path for organization documents
    const filePath = `${organizationId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('knowledge-base')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });
    
    if (error) throw error;
    return data;
  },
  
  async listDocuments(organizationId: string) {
    const { data, error } = await supabase.storage
      .from('knowledge-base')
      .list(organizationId);
    
    if (error) throw error;
    return data || [];
  },
  
  async deleteDocument(filePath: string) {
    const { data, error } = await supabase.storage
      .from('knowledge-base')
      .remove([filePath]);
    
    if (error) throw error;
    return data;
  },
  
  getPublicUrl(filePath: string) {
    const { data } = supabase.storage
      .from('knowledge-base')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },
};

// Export a function to check if we have storage buckets configured
export async function checkStorageBucket() {
  try {
    await supabase.storage.getBucket('knowledge-base');
    return true;
  } catch (error) {
    console.error("Storage bucket doesn't exist:", error);
    return false;
  }
}
