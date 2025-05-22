
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
  QueryConstraint
} from 'firebase/firestore';
import { firestore, collections, logDebug } from './config';

// Database service
export const dbService = {
  /**
   * Creates a new document
   */
  async create(collectionId: string, data: any, id?: string) {
    try {
      logDebug(`Creating document in ${collectionId}`, data);
      
      // Add timestamps
      const dataWithTimestamps = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Create document reference
      const docRef = id 
        ? doc(firestore, collectionId, id) 
        : doc(collection(firestore, collectionId));
      
      // Save document
      await setDoc(docRef, dataWithTimestamps);
      
      // Return document with ID
      const newDoc = {
        id: docRef.id,
        ...data,
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
   * Queries for documents with filters
   */
  async query(collectionId: string, constraints: QueryConstraint[] = []) {
    try {
      logDebug(`Querying documents in ${collectionId}`);
      
      const q = query(collection(firestore, collectionId), ...constraints);
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

/**
 * Service for managing user profiles
 */
export const profilesService = {
  /**
   * Gets a profile by user ID
   */
  async getByUserId(userId: string) {
    return await dbService.getById(collections.PROFILES, userId);
  },
  
  /**
   * Creates a new profile
   */
  async create(profileData: any) {
    return await dbService.create(
      collections.PROFILES, 
      profileData, 
      profileData.id
    );
  },
  
  /**
   * Updates a profile
   */
  async update(id: string, updates: any) {
    return await dbService.update(collections.PROFILES, id, updates);
  }
};
