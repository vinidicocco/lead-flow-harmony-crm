
import { db } from './config';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export interface ConnectionResult {
  success: boolean;
  message: string;
  details?: string;
  code?: string | number;
}

export const checkFirebaseConnection = async (): Promise<ConnectionResult> => {
  try {
    // Teste simples de conexão tentando acessar uma coleção
    const testQuery = query(collection(db, 'organizations'), limit(1));
    await getDocs(testQuery);
    
    return {
      success: true,
      message: 'Conexão com Firebase estabelecida com sucesso'
    };
  } catch (error: any) {
    console.error('Erro de conexão com Firebase:', error);
    
    return {
      success: false,
      message: 'Falha na conexão com Firebase',
      details: error.message,
      code: error.code
    };
  }
};

export const firebaseAppConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'crm-assistu',
  debugMode: import.meta.env.DEV
};
