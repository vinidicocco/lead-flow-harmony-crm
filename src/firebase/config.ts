
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

import { FirestoreCollections } from '@/types/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
if (process.env.NODE_ENV === 'development') {
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { app, auth, db, firestore, storage, functions, googleAuthProvider };

export const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(message, data ? JSON.stringify(data, null, 2) : '');
  }
};

export const getOrganizationId = (): string | null => {
  // @ts-ignore
  return auth?.currentUser?.tenantId || localStorage.getItem('organizationId') || process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || null;
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
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'crm-assistu',
  debugMode: process.env.NODE_ENV === 'development'
};
