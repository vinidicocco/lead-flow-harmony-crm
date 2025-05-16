
import { storage, ID } from './client';

export const storageService = {
  async uploadFile(bucketId: string, file: File, fileId?: string) {
    const id = fileId || ID.unique();
    return await storage.createFile(
      bucketId,
      id,
      file
    );
  },
  
  async getFilePreview(bucketId: string, fileId: string) {
    return storage.getFilePreview(
      bucketId,
      fileId
    );
  },
  
  async listFiles(bucketId: string, queries: any[] = []) {
    return await storage.listFiles(
      bucketId,
      queries
    );
  },
  
  async deleteFile(bucketId: string, fileId: string) {
    return await storage.deleteFile(
      bucketId,
      fileId
    );
  },
  
  getFileView(bucketId: string, fileId: string) {
    return storage.getFileView(
      bucketId,
      fileId
    );
  }
};
