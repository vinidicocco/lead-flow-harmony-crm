
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

import { FirestoreCollections } from '@/types/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Enable authentication with Google
const googleAuthProvider = new GoogleAuthProvider();

// Connect to emulator in development
if (import.meta.env.DEV) {
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { app, auth, db, firestore, storage, functions, googleAuthProvider };

export const logDebug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.debug(message, data ? JSON.stringify(data, null, 2) : '');
  }
};

export const getOrganizationId = (): string | null => {
  // @ts-ignore
  return auth?.currentUser?.tenantId || localStorage.getItem('organizationId') || import.meta.env.VITE_DEFAULT_ORG_ID || null;
};

export const collections: FirestoreCollections = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  LEADS: 'leads',
  MEETINGS: 'meetings',
  COMMUNICATIONS: 'communications',
  AGENT_CONFIGS: 'agent_configs',
  WHATSAPP_SESSIONS: 'whatsapp_sessions',
  FOLLOW_UPS: 'follow_ups',
  USER_SETTINGS: 'user_settings',
  PROFILES: 'profiles'
};

export const firebaseAppConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'crm-assistu',
  debugMode: import.meta.env.DEV
};
