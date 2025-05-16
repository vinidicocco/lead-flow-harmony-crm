
import { storageService } from './storage';
import { Query } from 'appwrite';

// Knowledge base buckets
const BUCKET_ID = 'knowledge-base';

export const knowledgeBaseService = {
  async uploadDocument(fileName: string, file: File, organizationId: string) {
    // Create a structured path for organization documents
    const fileId = `${organizationId}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    try {
      return await storageService.uploadFile(BUCKET_ID, file, fileId);
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
  
  async listDocuments(organizationId: string) {
    try {
      // Query files that belong to this organization
      const result = await storageService.listFiles(BUCKET_ID, [
        Query.contains('$id', organizationId)
      ]);
      
      return result.files;
    } catch (error) {
      console.error('Error listing documents:', error);
      return [];
    }
  },
  
  async deleteDocument(fileId: string) {
    try {
      await storageService.deleteFile(BUCKET_ID, fileId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },
  
  getPublicUrl(fileId: string) {
    return storageService.getFileView(BUCKET_ID, fileId);
  }
};

// Function to check if knowledge base bucket exists
export async function checkStorageBucket() {
  try {
    // There's no direct method to check if a bucket exists in Appwrite
    // So we'll try to list files from the bucket
    await storageService.listFiles(BUCKET_ID, []);
    return true;
  } catch (error) {
    console.error("Storage bucket doesn't exist:", error);
    return false;
  }
}
