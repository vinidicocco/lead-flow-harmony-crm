
import { Account, Client, Databases, Storage, ID, Teams, Functions } from 'appwrite';

// Appwrite configuration
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://alias.assistu.com.br/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'assistu'; 
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'assistu-aiv';
const debugMode = import.meta.env.VITE_APPWRITE_DEBUG === 'true';
const useFirebaseFallback = import.meta.env.VITE_USE_FIREBASE_FALLBACK === 'true';

// Debug information
if (debugMode) {
  console.log('Appwrite Configuration:');
  console.log('- Endpoint:', endpoint);
  console.log('- Project ID:', projectId);
  console.log('- Database ID:', databaseId);
  console.log('- Firebase Fallback:', useFirebaseFallback);
}

// Initialize Appwrite client
const client = new Client();

try {
  client.setEndpoint(endpoint).setProject(projectId);
  if (debugMode) console.log('Appwrite client initialized successfully');
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
  databaseId,
  debugMode,
  useFirebaseFallback
};

// Health check function to test connectivity with detailed error information
export const checkAppwriteConnection = async () => {
  try {
    // A simple health check by trying to list teams (which will fail if connection is not working)
    await teams.list();
    if (debugMode) console.log('Appwrite connection successful');
    return {
      success: true,
      message: 'Conexão com Appwrite estabelecida com sucesso'
    };
  } catch (error: any) {
    console.error('Appwrite connection failed:', error);
    
    // Informações mais detalhadas sobre o erro
    let errorMessage = 'Falha na conexão com o servidor Appwrite';
    
    if (error.message?.includes('Network')) {
      errorMessage = 'Erro de rede: O servidor Appwrite não está acessível. Verifique se a URL está correta e se o CORS está configurado adequadamente.';
    } else if (error.code === 401) {
      errorMessage = 'Erro de autenticação: Credenciais inválidas para o projeto Appwrite.';
    } else if (error.code === 403) {
      errorMessage = 'Erro de permissão: Sem acesso ao projeto Appwrite especificado.';
    } else if (error.code === 404) {
      errorMessage = 'O projeto Appwrite especificado não foi encontrado.';
    }
    
    return {
      success: false,
      message: errorMessage,
      details: error.message,
      code: error.code || 0
    };
  }
};
