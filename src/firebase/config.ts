
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

// Initialize Firebase and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { app, auth, firestore, storage };

// Export Firebase configuration for reference in other files
export const firebaseAppConfig = {
  projectId: firebaseConfig.projectId,
  debugMode
};

// Collection names for consistent usage
export const collections = {
  PROFILES: 'profiles',
  ORGANIZATIONS: 'organizations',
  AGENT_CONFIGS: 'agent_configs',
  LEADS: 'leads',
  CONVERSATIONS: 'conversations'
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
    
    if (error.code === 'app/invalid-credential') {
      errorMessage = 'Erro de autenticação: Credenciais Firebase inválidas.';
    } else if (error.code === 'app/invalid-app-id') {
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
