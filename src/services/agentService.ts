
// Serviço para gerenciar dados do agente IA
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
  type: string;
}

class AgentService {
  // Métricas do agente
  async getMetrics(organizationId: string): Promise<AgentMetrics> {
    // TODO: Implementar chamada para API real
    return {
      mensagensEnviadas: 0,
      conversasAtivas: 0,
      leadsQualificados: 0,
      reunioesMarcadas: 0,
      taxaConversao: 0,
    };
  }

  // Dados de performance
  async getPerformanceData(organizationId: string): Promise<AgentPerformanceData[]> {
    // TODO: Implementar chamada para API real
    return [];
  }

  // Atividades recentes
  async getRecentActivities(organizationId: string): Promise<AgentActivity[]> {
    // TODO: Implementar chamada para API real
    return [];
  }

  // Configurações do agente
  async getConfig(organizationId: string): Promise<AgentConfig> {
    // TODO: Implementar chamada para API real
    return {
      agentName: 'Agente IA',
      personality: 'professional',
      openaiApiKey: '',
      n8nWebhookUrl: '',
      whatsappInstance: 'default',
      welcomeMessage: 'Olá! Como posso ajudar você hoje?',
      qualificationFlow: 'default',
    };
  }

  async updateConfig(organizationId: string, config: Partial<AgentConfig>): Promise<void> {
    // TODO: Implementar chamada para API real
    console.log('Config updated:', config);
  }

  // Chat com agente
  async sendMessage(organizationId: string, message: string): Promise<string> {
    // TODO: Implementar chamada para API real
    return 'Esta é uma resposta simulada. Configure a integração com a API real.';
  }

  // Base de conhecimento
  async getDocuments(organizationId: string): Promise<KnowledgeDocument[]> {
    // TODO: Implementar chamada para API real
    return [];
  }

  async uploadDocument(organizationId: string, file: File): Promise<void> {
    // TODO: Implementar upload para storage real
    console.log('Document uploaded:', file.name);
  }

  async deleteDocument(organizationId: string, documentId: string): Promise<void> {
    // TODO: Implementar exclusão do storage real
    console.log('Document deleted:', documentId);
  }
}

export const agentService = new AgentService();
