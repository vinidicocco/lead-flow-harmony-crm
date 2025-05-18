
import { Account, Client, Databases, Storage, ID, Teams, Functions } from 'appwrite';

// Appwrite configuration
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-appwrite-project-id'; // Replace with your Appwrite project ID
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'your-appwrite-database-id'; // Replace with your database ID

// Initialize Appwrite client
const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

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
