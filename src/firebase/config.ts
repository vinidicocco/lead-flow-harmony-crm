
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-mode-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-mode.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-mode",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-mode.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug mode flag
const debugMode = import.meta.env.VITE_FIREBASE_DEBUG === 'true';

// Debug information
if (debugMode) {
  console.log('Firebase Configuration:');
  console.log('- Project ID:', firebaseConfig.projectId);
  console.log('- Auth Domain:', firebaseConfig.authDomain);
}

// Initialize Firebase with error handling and prevent multiple initializations
let app: FirebaseApp;
let auth;
let firestore;
let storage;

try {
  // Check if Firebase app is already initialized
  const existingApps = getApps();
  if (existingApps.length === 0) {
    app = initializeApp(firebaseConfig);
    if (debugMode) console.log('Firebase app initialized successfully');
  } else {
    app = existingApps[0];
    if (debugMode) console.log('Using existing Firebase app instance');
  }
  
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Export Firebase services
export { app, auth, firestore, storage };

// Export Firebase configuration for reference in other files
export const firebaseAppConfig = {
  projectId: firebaseConfig.projectId,
  debugMode
};

// Collection names for consistent usage
export const collections = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  LEADS: 'leads',
  MEETINGS: 'meetings',
  COMMUNICATIONS: 'communications',
  AGENT_CONFIGS: 'agent_configs'
};

// Debug logger
export const logDebug = (message: string, data?: any) => {
  if (debugMode) {
    console.log(`[Firebase Debug] ${message}`, data || '');
  }
};

// Health check function to test Firebase connectivity
export const checkFirebaseConnection = async () => {
  try {
    // A simple health check by trying to get auth state
    const auth = getAuth();
    await auth.authStateReady();
    
    if (debugMode) console.log('Firebase connection successful');
    return {
      success: true,
      message: 'Conexão com Firebase estabelecida com sucesso'
    };
  } catch (error: any) {
    console.error('Firebase connection failed:', error);
    
    // Informações mais detalhadas sobre o erro
    let errorMessage = 'Falha na conexão com o Firebase';
    
    if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Erro de autenticação: API Key inválida. Verifique suas variáveis de ambiente.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Erro de autenticação: Credenciais Firebase inválidas.';
    } else if (error.code === 'auth/invalid-app-id') {
      errorMessage = 'ID do aplicativo Firebase inválido.';
    } else if (error.code?.includes('network')) {
      errorMessage = 'Erro de rede: Verifique sua conexão com a internet.';
    }
    
    return {
      success: false,
      message: errorMessage,
      details: error.message,
      code: error.code || '0'
    };
  }
};

// Get organization ID from URL or subdomain
export const getOrganizationId = (): string | null => {
  // Try to get from URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const orgFromUrl = urlParams.get('org');
  
  if (orgFromUrl) {
    return orgFromUrl;
  }
  
  // Try to get from subdomain
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  // Map known subdomains to organization IDs
  const subdomainMap: Record<string, string> = {
    'salt': 'salt-org-id',
    'ghf': 'ghf-org-id',
    'neoin': 'neoin-org-id'
  };
  
  return subdomainMap[subdomain] || 'default-org-id';
};
