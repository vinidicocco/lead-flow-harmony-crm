import { Profile, Tenant } from './index';

export interface FirestoreCollections {
  USERS: string;
  ORGANIZATIONS: string;
  LEADS: string;
  MEETINGS: string;
  COMMUNICATIONS: string;
  AGENT_CONFIGS: string;
  WHATSAPP_SESSIONS: string;
  FOLLOW_UPS: string;
  USER_SETTINGS: string;
  PROFILES: string; // Adicionado PROFILES
}

export interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: Profile;
  tenant: Tenant;
  isAdmin?: boolean;
  organizationId: string;
  createdAt: any;
  updatedAt: any;
}

export interface FirestoreLead {
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
  profile: Profile;
  organizationId: string;
  nextFollowUp?: string;
  lastContact?: string;
  createdAt: any;
  updatedAt: any;
}

export interface FirestoreMeeting {
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
  createdAt: any;
  updatedAt: any;
}

export interface FollowUp {
  id: string;
  organizationId: string;
  leadId: string;
  userId: string;
  dueDate: any;
  status: 'pending' | 'completed' | 'overdue';
  notes: string;
  lastContact?: any;
  createdAt: any;
  updatedAt: any;
}

export interface UserSettings {
  id: string;
  userId: string;
  organizationId: string;
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    meetingReminders: boolean;
    leadUpdates: boolean;
    taskReminders: boolean;
    dailyDigest: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    denseMode: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  createdAt: any;
  updatedAt: any;
}

export interface Communication {
  id: string;
  organizationId: string;
  leadId: string;
  type: 'whatsapp' | 'email' | 'call';
  direction: 'inbound' | 'outbound';
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'active';
  createdAt: any;
  updatedAt: any;
}

export interface WhatsAppSession {
  id: string;
  organizationId: string;
  sessionId: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrCode?: string;
  lastActivity: any;
  createdAt: any;
  updatedAt: any;
}

export interface AgentConfig {
  id: string;
  organizationId: string;
  name: string;
  personality: string;
  welcomeMessage: string;
  qualificationFlow: string;
  whatsappInstance: string;
  n8nWebhookUrl?: string;
  openaiApiKey?: string;
  createdAt: any;
  updatedAt: any;
}

export interface FirestoreProfile {
  id: string;
  userId: string;
  organizationId: string;
  profile: Profile;
  tenant: Tenant;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}
