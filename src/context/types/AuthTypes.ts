
import { User } from '@/types';
import { Tenant } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
  currentTenant: Tenant;
  connectionError: string | null;
  retryConnection?: () => Promise<void>;
}
