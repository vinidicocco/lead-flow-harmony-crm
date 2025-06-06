
export type Profile = 'SALT' | 'GHF' | 'NEOIN';

export type Tenant = 'SALT_GHF' | 'NEOIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: Profile;
  tenant: Tenant;
  isAdmin?: boolean;
  organizationId: string;
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
  organizationId: string;
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
  organizationId: string;
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
  organizationId: string;
}

export interface Stats {
  totalLeads: number;
  newLeadsThisMonth: number;
  wonDealsThisMonth: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageDealSize: number;
}
