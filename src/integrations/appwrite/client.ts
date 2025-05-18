
import { Account, Client, Databases, Storage, ID, Teams, Functions } from 'appwrite';

// Appwrite configuration
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'assistu'; 
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'assistu-aiv';

// Debug information
console.log('Appwrite Configuration:');
console.log('- Endpoint:', endpoint);
console.log('- Project ID:', projectId);
console.log('- Database ID:', databaseId);

// Initialize Appwrite client
const client = new Client();

try {
  client.setEndpoint(endpoint).setProject(projectId);
  console.log('Appwrite client initialized successfully');
} catch (error) {
  console.error('Error initializing Appwrite client:', error);
}

// Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const functions = new Functions(client);

// Helper to generate unique IDs
export { ID };

// Export config for reference in other files
export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId
};

// Health check function to test connectivity
export const checkAppwriteConnection = async () => {
  try {
    // A simple health check by trying to list teams (which will fail if connection is not working)
    await teams.list();
    console.log('Appwrite connection successful');
    return true;
  } catch (error) {
    console.error('Appwrite connection failed:', error);
    return false;
  }
};

