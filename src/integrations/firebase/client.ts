
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDfake-key-for-development",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-app-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789"
};

const debugMode = import.meta.env.VITE_FIREBASE_DEBUG === 'true';

// Debug information
if (debugMode) {
  console.log('Firebase Configuration:');
  console.log('- Project ID:', firebaseConfig.projectId);
  console.log('- Auth Domain:', firebaseConfig.authDomain);
}

// Firebase app instance
let app;
let auth;
let firestore;
let storage;

// Initialize Firebase
try {
  app = initializeApp(firebaseConfig);
  if (debugMode) console.log('Firebase app initialized successfully');
  
  // Initialize Firebase services
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
  
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Export Firebase services
export { app, auth, firestore, storage };

// Firebase configuration for reference in other files
export const firebaseAppConfig = {
  projectId: firebaseConfig.projectId,
  debugMode
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
