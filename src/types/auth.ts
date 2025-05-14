
import { User, Organization, UserRole } from '@/types';

export interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  session: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, organizationId: string, role?: UserRole) => Promise<any>; // Changed return type to Promise<any>
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permissionCode: string) => Promise<boolean>;
}
