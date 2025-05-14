
export type Profile = 'SALT' | 'GHF';

export type UserRole = 'MASTER' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  organization_id?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  code: Profile;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  code: string;
  created_at: string;
}

export interface RolePermission {
  id: string;
  organization_id: string;
  role: UserRole;
  permission_id: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  position?: string;
  email?: string;
  phone?: string;
  status: 'qualified' | 'contact_attempt' | 'contacted' | 'proposal' | 'contract' | 'payment' | 'closed';
  value: number;
  notes?: string;
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  next_follow_up?: string;
  last_contact?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  lead_id?: string;
  lead_name?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'canceled';
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  lead_id?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface AgentConfig {
  id: string;
  organization_id: string;
  name: string;
  personality: string;
  welcome_message?: string;
  qualification_flow: string;
  openai_api_key?: string;
  n8n_webhook_url?: string;
  whatsapp_instance: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  totalLeads: number;
  newLeadsThisMonth: number;
  wonDealsThisMonth: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}
