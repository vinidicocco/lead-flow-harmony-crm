
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, Tenant } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
  currentTenant: Tenant;
}
