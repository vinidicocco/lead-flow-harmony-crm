
// Serviço para dados do agente IA
export interface AgentMetrics {
  mensagensEnviadas: number;
  conversasAtivas: number;
  leadsQualificados: number;
  reunioesMarcadas: number;
  taxaConversao: number;
}

export interface AgentPerformanceData {
  data: string;
  mensagens: number;
  leads: number;
  reunioes: number;
}

export interface AgentActivity {
  id: number;
  type: "message" | "qualification" | "meeting" | "document";
  content: string;
  time: string;
  status: "success" | "pending" | "failed";
}

export interface AgentConfig {
  agentName: string;
  personality: string;
  openaiApiKey: string;
  n8nWebhookUrl: string;
  whatsappInstance: string;
  welcomeMessage: string;
  qualificationFlow: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  organizationId: string;
}

class AgentService {
  private readonly CONFIG_STORAGE_KEY = 'agent_config';
  private readonly DOCUMENTS_STORAGE_KEY = 'agent_documents';

  async getMetrics(organizationId: string): Promise<AgentMetrics> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dados em tempo real baseados na data atual
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    return {
      mensagensEnviadas: dayOfMonth * 12 + Math.floor(Math.random() * 50),
      conversasAtivas: Math.floor(Math.random() * 15) + 5,
      leadsQualificados: dayOfMonth * 2 + Math.floor(Math.random() * 10),
      reunioesMarcadas: Math.floor(dayOfMonth / 3) + Math.floor(Math.random() * 5),
      taxaConversao: Math.floor(Math.random() * 30) + 15,
    };
  }

  async getPerformanceData(organizationId: string): Promise<AgentPerformanceData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data: AgentPerformanceData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        data: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        mensagens: Math.floor(Math.random() * 50) + 20,
        leads: Math.floor(Math.random() * 15) + 5,
        reunioes: Math.floor(Math.random() * 8) + 1,
      });
    }
    
    return data;
  }

  async getRecentActivities(organizationId: string): Promise<AgentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const activities: AgentActivity[] = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const time = new Date(now.getTime() - (i * 15 * 60 * 1000)); // 15 min intervals
      activities.push({
        id: i + 1,
        type: ['message', 'qualification', 'meeting', 'document'][Math.floor(Math.random() * 4)] as any,
        content: `Atividade ${i + 1} realizada pelo agente`,
        time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
      });
    }
    
    return activities;
  }

  async getConfig(organizationId: string): Promise<AgentConfig> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stored = localStorage.getItem(this.CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing agent config:', error);
      }
    }

    const defaultConfig: AgentConfig = {
      agentName: 'Assistente IA',
      personality: 'professional',
      openaiApiKey: '',
      n8nWebhookUrl: '',
      whatsappInstance: 'default',
      welcomeMessage: 'Olá! Sou seu assistente IA. Como posso ajudá-lo hoje?',
      qualificationFlow: 'default',
    };

    localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  }

  async updateConfig(organizationId: string, config: Partial<AgentConfig>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const current = await this.getConfig(organizationId);
    const updated = { ...current, ...config };
    
    localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(updated));
    console.log('Agent config updated:', config);
  }

  async sendMessage(organizationId: string, message: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      'Olá! Como posso ajudá-lo hoje?',
      'Entendi sua solicitação. Vou processar as informações.',
      'Baseado nos dados que tenho, posso sugerir algumas opções.',
      'Preciso de mais detalhes para fornecer uma resposta mais precisa.',
      'Vou verificar as informações na base de conhecimento.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async getDocuments(organizationId: string): Promise<KnowledgeDocument[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stored = localStorage.getItem(this.DOCUMENTS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing documents:', error);
      }
    }
    
    return [];
  }

  async uploadDocument(organizationId: string, file: File): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDoc: KnowledgeDocument = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      organizationId,
    };
    
    const existing = await this.getDocuments(organizationId);
    const updated = [...existing, newDoc];
    
    localStorage.setItem(this.DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
  }

  async deleteDocument(organizationId: string, documentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existing = await this.getDocuments(organizationId);
    const updated = existing.filter(doc => doc.id !== documentId);
    
    localStorage.setItem(this.DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
  }
}

export const agentService = new AgentService();
