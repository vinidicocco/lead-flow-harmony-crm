
// Define organization profiles (no longer just limited to SALT and GHF)
export type Profile = 'SALT' | 'GHF' | string;

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
  ownerId: string;
}

// Extended user roles
export type UserRole = 'super_admin' | 'org_admin' | 'org_user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: Profile;
  role: UserRole;
  orgId: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  status: 'qualified' | 'contact_attempt' | 'contacted' | 'proposal' | 'contract' | 'payment' | 'closed';
  value: number;
  notes: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
  orgId: string;
  nextFollowUp?: string;
  lastContact?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  leadId: string;
  leadName: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'canceled';
  profile: Profile;
  orgId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  leadId?: string;
  profile: Profile;
  orgId: string;
}

export interface Stats {
  totalLeads: number;
  newLeadsThisMonth: number;
  wonDealsThisMonth: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface ApiIntegration {
  id: string;
  name: string;
  type: 'oauth' | 'api_key' | 'webhook';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  orgId: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  orgId: string;
  timestamp: string;
  metadata: Record<string, any>;
}
