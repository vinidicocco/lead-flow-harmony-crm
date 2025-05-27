
// Re-export Firebase services and configuration
export * from '../../firebase/config';
export * from '../../firebase/auth';
export * from '../../firebase/firestore';
export * from '../../firebase/storage';
export * from '../../firebase/connection';

// Export types
export type { AuthErrorResponse } from '../../firebase/auth';
export type { ConnectionResult } from '../../firebase/connection';
