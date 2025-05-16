
import { databases, ID } from './client';
import { Query } from 'appwrite';

// Collection IDs - replace with your actual collection IDs
const COLLECTION_IDS = {
  PROFILES: 'profiles',
  ORGANIZATIONS: 'organizations',
  AGENT_CONFIGS: 'agent_configs',
  PERMISSIONS: 'permissions',
  ROLE_PERMISSIONS: 'role_permissions',
};

// Database service for handling CRUD operations
export const dbService = {
  // Generic methods
  async create(collectionId: string, data: any, id?: string) {
    return await databases.createDocument(
      'default',
      collectionId,
      id || ID.unique(),
      data
    );
  },
  
  async getById(collectionId: string, id: string) {
    return await databases.getDocument(
      'default',
      collectionId,
      id
    );
  },
  
  async query(collectionId: string, queries: any[] = []) {
    return await databases.listDocuments(
      'default',
      collectionId,
      queries
    );
  },
  
  async update(collectionId: string, id: string, data: any) {
    return await databases.updateDocument(
      'default',
      collectionId,
      id,
      data
    );
  },
  
  async delete(collectionId: string, id: string) {
    return await databases.deleteDocument(
      'default',
      collectionId,
      id
    );
  },
  
  // Specific entity methods
  profiles: {
    async getByUserId(userId: string) {
      try {
        return await databases.getDocument(
          'default',
          COLLECTION_IDS.PROFILES,
          userId
        );
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    },
    
    async create(profileData: any) {
      return await databases.createDocument(
        'default',
        COLLECTION_IDS.PROFILES,
        profileData.id,
        profileData
      );
    },
    
    async update(id: string, updates: any) {
      return await databases.updateDocument(
        'default',
        COLLECTION_IDS.PROFILES,
        id,
        updates
      );
    }
  },
  
  organizations: {
    async getById(id: string) {
      return await databases.getDocument(
        'default',
        COLLECTION_IDS.ORGANIZATIONS,
        id
      );
    },
    
    async getByCode(code: string) {
      const result = await databases.listDocuments(
        'default',
        COLLECTION_IDS.ORGANIZATIONS,
        [Query.equal('code', code)]
      );
      
      return result.documents.length > 0 ? result.documents[0] : null;
    },
    
    async getAll() {
      const result = await databases.listDocuments(
        'default',
        COLLECTION_IDS.ORGANIZATIONS,
        []
      );
      
      return result.documents;
    }
  },
  
  agentConfigs: {
    async getByOrganizationId(organizationId: string) {
      const result = await databases.listDocuments(
        'default',
        COLLECTION_IDS.AGENT_CONFIGS,
        [Query.equal('organization_id', organizationId)]
      );
      
      return result.documents;
    },
    
    async getById(id: string) {
      return await databases.getDocument(
        'default',
        COLLECTION_IDS.AGENT_CONFIGS,
        id
      );
    },
    
    async update(id: string, updates: any) {
      return await databases.updateDocument(
        'default',
        COLLECTION_IDS.AGENT_CONFIGS,
        id,
        updates
      );
    },
    
    async create(config: any) {
      return await databases.createDocument(
        'default',
        COLLECTION_IDS.AGENT_CONFIGS,
        ID.unique(),
        config
      );
    }
  }
};
