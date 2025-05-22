
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, logDebug } from './config';
import { profilesService } from './firestore';

// Interface for standardized error responses
export interface AuthErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// Authentication service
export const authService = {
  /**
   * Registers a new user
   */
  async signUp(email: string, password: string, name: string) {
    try {
      logDebug(`Attempting to register user: ${email}`);
      
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      logDebug('User registered successfully', userCredential.user.uid);
      
      // Create profile in Firestore
      await profilesService.create({
        id: userCredential.user.uid,
        name,
        email,
        role: 'user',
        createdAt: new Date()
      });
      
      return userCredential.user;
    } catch (error: any) {
      logDebug('Error registering user', error);
      
      // Specific error handling
      const errorResponse: AuthErrorResponse = {
        message: 'Erro ao registrar usuário',
        code: error.code
      };
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorResponse.message = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          errorResponse.message = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorResponse.message = 'A senha é muito fraca.';
          break;
        default:
          errorResponse.message = error.message || 'Erro ao registrar usuário.';
      }
      
      throw errorResponse;
    }
  },
  
  /**
   * Logs in a user
   */
  async login(email: string, password: string) {
    try {
      logDebug(`Attempting to login: ${email}`);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      logDebug('Login successful', userCredential.user.uid);
      
      return userCredential.user;
    } catch (error: any) {
      logDebug('Login error', error);
      
      // Specific error handling
      const errorResponse: AuthErrorResponse = {
        message: 'Erro ao fazer login',
        code: error.code
      };
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorResponse.message = 'Email ou senha incorretos.';
          break;
        case 'auth/invalid-email':
          errorResponse.message = 'Email inválido.';
          break;
        case 'auth/user-disabled':
          errorResponse.message = 'Este usuário foi desativado.';
          break;
        case 'auth/too-many-requests':
          errorResponse.message = 'Muitas tentativas. Por favor, tente novamente mais tarde.';
          break;
        default:
          errorResponse.message = error.message || 'Erro ao fazer login.';
      }
      
      throw errorResponse;
    }
  },
  
  /**
   * Gets the current user
   */
  getCurrentUser() {
    return auth.currentUser;
  },
  
  /**
   * Logs out the current user
   */
  async logout() {
    try {
      logDebug('Performing logout');
      
      await signOut(auth);
      logDebug('Logout successful');
      
      return true;
    } catch (error) {
      logDebug('Logout error', error);
      throw error;
    }
  },
  
  /**
   * Updates the user's avatar photo
   */
  async updatePhoto(photoURL: string) {
    try {
      logDebug(`Updating photo to: ${photoURL}`);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      await updateProfile(user, { photoURL });
      
      // Also update in Firestore
      if (user.uid) {
        await profilesService.update(user.uid, { avatar: photoURL });
      }
      
      logDebug('Photo updated successfully');
      
      return user;
    } catch (error) {
      logDebug('Error updating photo', error);
      throw error;
    }
  },
  
  /**
   * Monitors changes in authentication state
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    logDebug('Setting up auth state monitoring');
    return onAuthStateChanged(auth, callback);
  },
  
  /**
   * Checks Firebase connection
   */
  async checkConnection() {
    try {
      logDebug('Checking Firebase connection');
      
      // Simple check by getting current user
      await auth.authStateReady();
      
      logDebug('Firebase connection successful');
      
      return {
        success: true,
        message: 'Conexão com Firebase estabelecida com sucesso'
      };
    } catch (error: any) {
      logDebug('Firebase connection failed', error);
      
      let errorMessage = 'Falha na conexão com o servidor Firebase';
      
      if (error.message?.includes('network')) {
        errorMessage = 'Erro de rede: O servidor Firebase não está acessível.';
      }
      
      return {
        success: false,
        message: errorMessage,
        details: error.message,
        code: error.code
      };
    }
  }
};
