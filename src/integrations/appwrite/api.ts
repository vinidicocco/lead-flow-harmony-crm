
import { dbService } from './database';
import { knowledgeBaseService, checkStorageBucket } from './knowledgebase';
import { User, Profile, Tenant } from '@/types';

// Profile Service
export const profileService = {
  async getProfile(userId: string) {
    try {
      return await dbService.profiles.getByUserId(userId);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  
  async updateProfile(userId: string, updates: Partial<any>) {
    try {
      return await dbService.profiles.update(userId, updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

// Organization Service
export const organizationService = {
  async getOrganization(organizationId: string) {
    try {
      return await dbService.organizations.getById(organizationId);
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  },
  
  async getAllOrganizations() {
    try {
      return await dbService.organizations.getAll();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
  },
};

// Agent Config Service
export const agentConfigService = {
  async getAgentConfigs(organizationId?: string) {
    try {
      if (organizationId) {
        return await dbService.agentConfigs.getByOrganizationId(organizationId);
      } else {
        const result = await dbService.query('agent_configs');
        return result.documents;
      }
    } catch (error) {
      console.error('Error fetching agent configs:', error);
      return [];
    }
  },
  
  async getAgentConfig(id: string) {
    try {
      return await dbService.agentConfigs.getById(id);
    } catch (error) {
      console.error('Error fetching agent config:', error);
      throw error;
    }
  },
  
  async updateAgentConfig(id: string, updates: Partial<any>) {
    try {
      return await dbService.agentConfigs.update(id, updates);
    } catch (error) {
      console.error('Error updating agent config:', error);
      throw error;
    }
  },
  
  async createAgentConfig(config: any) {
    try {
      return await dbService.agentConfigs.create(config);
    } catch (error) {
      console.error('Error creating agent config:', error);
      throw error;
    }
  },
};

// Export the knowledge base service
export { knowledgeBaseService, checkStorageBucket };
