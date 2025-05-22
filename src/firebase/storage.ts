
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  uploadString
} from 'firebase/storage';
import { storage, logDebug } from './config';

// Storage service
export const storageService = {
  /**
   * Uploads a file
   */
  async uploadFile(path: string, file: File) {
    try {
      logDebug(`Uploading file to ${path}`, { fileName: file.name, fileSize: file.size });
      
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      logDebug('File uploaded successfully', { path, downloadURL });
      return { path, downloadURL };
    } catch (error) {
      logDebug('Error uploading file', error);
      throw error;
    }
  },
  
  /**
   * Gets a download URL for a file
   */
  async getFileURL(path: string) {
    try {
      logDebug(`Getting URL for ${path}`);
      
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      
      return url;
    } catch (error) {
      logDebug(`Error getting URL for ${path}`, error);
      throw error;
    }
  },
  
  /**
   * Deletes a file
   */
  async deleteFile(path: string) {
    try {
      logDebug(`Deleting file ${path}`);
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      
      logDebug('File deleted successfully');
      return true;
    } catch (error) {
      logDebug(`Error deleting file ${path}`, error);
      throw error;
    }
  }
};
