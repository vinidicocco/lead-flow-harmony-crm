import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  addDoc
} from 'firebase/firestore';
import { firestore, collections, logDebug, getOrganizationId } from '@/firebase/config';
import { Lead, Meeting, User, Profile, Tenant } from '@/types';
import { FirestoreLead, FirestoreMeeting, FirestoreUser, FollowUp, UserSettings } from '@/types/firestore';

// Generic database service
export const dbService = {
  /**
   * Creates a new document
   */
  async create(collectionId: string, data: any, id?: string) {
    try {
      logDebug(`Creating document in ${collectionId}`, data);
      
      // Add timestamps and organization
      const dataWithMeta = {
        ...data,
        organizationId: getOrganizationId(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Create document reference
      let docRef;
      if (id) {
        docRef = doc(firestore, collectionId, id);
        await setDoc(docRef, dataWithMeta);
      } else {
        docRef = await addDoc(collection(firestore, collectionId), dataWithMeta);
      }
      
      // Return document with ID
      const newDoc = {
        id: docRef.id,
        ...data,
        organizationId: getOrganizationId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      logDebug(`Document created successfully in ${collectionId}`, newDoc);
      return newDoc;
    } catch (error) {
      logDebug(`Error creating document in ${collectionId}`, error);
      throw error;
    }
  },
  
  /**
   * Gets a document by ID
   */
  async getById(collectionId: string, id: string) {
    try {
      logDebug(`Getting document ${id} from collection ${collectionId}`);
      
      const docRef = doc(firestore, collectionId, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          // Convert Timestamp to Date
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp 
            ? data.updatedAt.toDate() 
            : data.updatedAt
        };
      }
      
      logDebug(`Document ${id} not found`);
      return null;
    } catch (error) {
      logDebug(`Error getting document ${id} from collection ${collectionId}`, error);
      throw error;
    }
  },
  
  /**
   * Updates a document
   */
  async update(collectionId: string, id: string, data: any) {
    try {
      logDebug(`Updating document ${id} in ${collectionId}`, data);
      
      // Add update timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      const docRef = doc(firestore, collectionId, id);
      await updateDoc(docRef, dataWithTimestamp);
      
      // Return updated document
      const updatedDoc = {
        id,
        ...data,
        updatedAt: new Date()
      };
      
      logDebug(`Document ${id} updated successfully`, updatedDoc);
      return updatedDoc;
    } catch (error) {
      logDebug(`Error updating document ${id} in ${collectionId}`, error);
      throw error;
    }
  },

  /**
   * Deletes a document
   */
  async delete(collectionId: string, id: string) {
    try {
      logDebug(`Deleting document ${id} from ${collectionId}`);
      
      const docRef = doc(firestore, collectionId, id);
      await deleteDoc(docRef);
      
      logDebug(`Document ${id} deleted successfully`);
      return true;
    } catch (error) {
      logDebug(`Error deleting document ${id} from ${collectionId}`, error);
      throw error;
    }
  },
  
  /**
   * Queries for documents with filters
   */
  async query(collectionId: string, constraints: QueryConstraint[] = []) {
    try {
      logDebug(`Querying documents in ${collectionId}`);
      
      // Add organization filter
      const orgId = getOrganizationId();
      const allConstraints = [
        where('organizationId', '==', orgId),
        ...constraints
      ];
      
      const q = query(collection(firestore, collectionId), ...allConstraints);
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Timestamp to Date
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp 
            ? data.updatedAt.toDate() 
            : data.updatedAt
        };
      });
      
      return {
        documents,
        total: documents.length
      };
    } catch (error) {
      logDebug(`Error querying documents in ${collectionId}`, error);
      throw error;
    }
  }
};

// Leads service
export const leadsService = {
  async getAll() {
    return await dbService.query(collections.LEADS, [orderBy('createdAt', 'desc')]);
  },

  async getById(id: string): Promise<FirestoreLead | null> {
    return await dbService.getById(collections.LEADS, id) as FirestoreLead | null;
  },

  async create(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.create(collections.LEADS, leadData);
  },

  async update(id: string, updates: Partial<Lead>) {
    return await dbService.update(collections.LEADS, id, updates);
  },

  async delete(id: string) {
    return await dbService.delete(collections.LEADS, id);
  },

  async getByProfile(profile: Profile) {
    return await dbService.query(collections.LEADS, [
      where('profile', '==', profile),
      orderBy('createdAt', 'desc')
    ]);
  },

  async getByStatus(status: string) {
    return await dbService.query(collections.LEADS, [
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    ]);
  }
};

// Meetings service
export const meetingsService = {
  async getAll() {
    return await dbService.query(collections.MEETINGS, [orderBy('date', 'asc')]);
  },

  async getById(id: string): Promise<FirestoreMeeting | null> {
    return await dbService.getById(collections.MEETINGS, id) as FirestoreMeeting | null;
  },

  async create(meetingData: Omit<Meeting, 'id'>) {
    return await dbService.create(collections.MEETINGS, meetingData);
  },

  async update(id: string, updates: Partial<Meeting>) {
    return await dbService.update(collections.MEETINGS, id, updates);
  },

  async delete(id: string) {
    return await dbService.delete(collections.MEETINGS, id);
  },

  async getByProfile(profile: Profile) {
    return await dbService.query(collections.MEETINGS, [
      where('profile', '==', profile),
      orderBy('date', 'asc')
    ]);
  },

  async getUpcoming() {
    const today = new Date().toISOString().split('T')[0];
    return await dbService.query(collections.MEETINGS, [
      where('date', '>=', today),
      where('status', '==', 'scheduled'),
      orderBy('date', 'asc')
    ]);
  }
};

// Users service
export const usersService = {
  async getById(id: string): Promise<FirestoreUser | null> {
    return await dbService.getById(collections.USERS, id) as FirestoreUser | null;
  },

  async create(userData: Omit<User, 'id'> & { organizationId: string }) {
    return await dbService.create(collections.USERS, userData, userData.email);
  },

  async update(id: string, updates: Partial<User>) {
    return await dbService.update(collections.USERS, id, updates);
  },

  async getByEmail(email: string): Promise<FirestoreUser | null> {
    const result = await dbService.query(collections.USERS, [
      where('email', '==', email)
    ]);
    return (result.documents[0] as FirestoreUser) || null;
  }
};

// Follow-ups service
export const followUpsService = {
  async getAll() {
    return await dbService.query(collections.FOLLOW_UPS, [orderBy('dueDate', 'asc')]);
  },

  async getById(id: string): Promise<FollowUp | null> {
    return await dbService.getById(collections.FOLLOW_UPS, id) as FollowUp | null;
  },

  async create(followUpData: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.create(collections.FOLLOW_UPS, followUpData);
  },

  async update(id: string, updates: Partial<FollowUp>) {
    return await dbService.update(collections.FOLLOW_UPS, id, updates);
  },

  async getByUserId(userId: string) {
    return await dbService.query(collections.FOLLOW_UPS, [
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    ]);
  },

  async getOverdue() {
    const now = new Date();
    return await dbService.query(collections.FOLLOW_UPS, [
      where('dueDate', '<', now),
      where('status', '==', 'pending'),
      orderBy('dueDate', 'asc')
    ]);
  }
};

// User Settings service
export const userSettingsService = {
  async getByUserId(userId: string): Promise<UserSettings | null> {
    const result = await dbService.query(collections.USER_SETTINGS, [
      where('userId', '==', userId)
    ]);
    return (result.documents[0] as UserSettings) || null;
  },

  async create(settingsData: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await dbService.create(collections.USER_SETTINGS, settingsData);
  },

  async update(id: string, updates: Partial<UserSettings>) {
    return await dbService.update(collections.USER_SETTINGS, id, updates);
  }
};

// Communications service for WhatsApp integration
export const communicationsService = {
  async getAll() {
    return await dbService.query(collections.COMMUNICATIONS, [orderBy('createdAt', 'desc')]);
  },

  async create(messageData: any) {
    return await dbService.create(collections.COMMUNICATIONS, messageData);
  },

  async getByLeadId(leadId: string) {
    return await dbService.query(collections.COMMUNICATIONS, [
      where('leadId', '==', leadId),
      orderBy('createdAt', 'asc')
    ]);
  }
};

// Agent configs service
export const agentConfigsService = {
  async getByOrganization() {
    const orgId = getOrganizationId();
    const result = await dbService.query(collections.AGENT_CONFIGS, [
      where('organizationId', '==', orgId)
    ]);
    return result.documents[0] || null;
  },

  async create(configData: any) {
    return await dbService.create(collections.AGENT_CONFIGS, configData);
  },

  async update(id: string, updates: any) {
    return await dbService.update(collections.AGENT_CONFIGS, id, updates);
  }
};

export { collections };
