
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
      avatar: firebaseUser.photoURL || profile?.avatar || '',
      profile: profile?.profile || 'SALT',
      tenant: profile?.tenant || 'SALT_GHF',
      isAdmin: profile?.isAdmin || false
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
