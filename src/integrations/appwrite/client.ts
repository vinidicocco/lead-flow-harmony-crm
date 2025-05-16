
import { Account, Client, Databases, Storage, ID, Teams, Functions } from 'appwrite';

// Appwrite configuration
const endpoint = 'https://cloud.appwrite.io/v1';
const projectId = 'your-appwrite-project-id'; // Replace with your Appwrite project ID
const databaseId = 'your-appwrite-database-id'; // Replace with your database ID

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
