
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types';
import { profilesService } from '@/firebase';

export const mapFirebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Get additional user profile from Firestore
    const profile = await profilesService.getByUserId(firebaseUser.uid);
    
    // Create user with Firebase Auth and profile data
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Usuário',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || (profile ? profile.avatar : '') || '',
      profile: profile ? (profile.profile as 'SALT' | 'GHF' | 'NEOIN') : 'SALT',
      tenant: profile ? (profile.tenant as 'SALT_GHF' | 'NEOIN') : 'SALT_GHF',
      isAdmin: profile ? !!profile.isAdmin : false
    };
  } catch (error) {
    console.error('Error mapping Firebase user:', error);
    
    // Return basic user in case of error
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Usuário',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || '',
      profile: 'SALT',
      tenant: 'SALT_GHF'
    };
  }
};
