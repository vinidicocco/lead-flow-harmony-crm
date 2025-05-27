
import { User, Tenant } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  isLoading: boolean;
  currentTenant: Tenant;
  connectionError: string | null;
  retryConnection?: () => Promise<void>;
}
