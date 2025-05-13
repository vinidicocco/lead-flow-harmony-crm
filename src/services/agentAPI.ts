
// Arquivo para serviços de API relacionados ao agente
// Esta é uma implementação simulada que posteriormente será integrada com backend real

import { useToast } from '@/hooks/use-toast';

// Tipos de dados para a API do agente
export interface AgentMetrics {
  messagesCount: number;
  activeConversations: number;
  qualifiedLeads: number;
  scheduledMeetings: number;
  conversionRate: number;
}

export interface AgentConfig {
  name: string;
  personality: string;
  welcomeMessage: string;
  qualificationFlow: string;
  apiKeys: {
    openai?: string;
    n8nWebhook?: string;
  };
  integrations: {
    whatsappInstance: string;
  };
}

export interface AgentActivity {
  id: number;
  type: 'message' | 'qualification' | 'meeting' | 'document';
  content: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

// Serviços simulados para a API do agente
export const agentAPI = {
  // Obter métricas do agente
  getMetrics: async (): Promise<AgentMetrics> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messagesCount: 1248,
          activeConversations: 17,
          qualifiedLeads: 43,
          scheduledMeetings: 28,
          conversionRate: 64,
        });
      }, 500);
    });
  },

  // Obter atividades recentes do agente
  getRecentActivities: async (): Promise<AgentActivity[]> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, type: 'message', content: 'Respondeu a 3 perguntas de Amanda Silva sobre financiamento', timestamp: '14:32', status: 'success' },
          { id: 2, type: 'qualification', content: 'Qualificou João Mendes como lead interessado', timestamp: '13:45', status: 'success' },
          { id: 3, type: 'meeting', content: 'Agendou reunião com Rafael Santos para amanhã às 10h', timestamp: '11:20', status: 'pending' },
          { id: 4, type: 'document', content: 'Enviou contrato para Mariana Oliveira', timestamp: '09:15', status: 'success' },
          { id: 5, type: 'message', content: 'Não conseguiu qualificar o lead Pedro Alves', timestamp: 'Ontem', status: 'failed' },
        ]);
      }, 500);
    });
  },

  // Obter configuração do agente
  getConfig: async (): Promise<AgentConfig> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Leandro',
          personality: 'professional',
          welcomeMessage: 'Olá, sou o assistente virtual da [Empresa]. Como posso ajudar você hoje?',
          qualificationFlow: 'default',
          apiKeys: {
            openai: '',
            n8nWebhook: '',
          },
          integrations: {
            whatsappInstance: 'default',
          },
        });
      }, 500);
    });
  },

  // Atualizar configuração do agente
  updateConfig: async (config: Partial<AgentConfig>): Promise<boolean> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Configuração do agente atualizada:', config);
        resolve(true);
      }, 800);
    });
  },

  // Enviar mensagem para o agente
  sendMessage: async (message: string): Promise<{response: string}> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        
        // Respostas simples baseadas em palavras-chave
        const lowercaseMessage = message.toLowerCase();
        if (lowercaseMessage.includes('métricas') || lowercaseMessage.includes('desempenho')) {
          response = 'Nas últimas 24 horas, processamos 78 mensagens, qualifiquei 5 leads e agendei 2 reuniões. A taxa de conversão está em 40%, um aumento de 5% em relação à semana passada.';
        } else if (lowercaseMessage.includes('documento') || lowercaseMessage.includes('contrato')) {
          response = 'Para enviar um documento para a base de conhecimento ou para um lead, você pode anexá-lo diretamente neste chat ou fazer upload na seção de Base de Conhecimento. Depois disso, eu posso referenciá-lo nas minhas conversas com os leads.';
        } else {
          response = 'Estou aqui para ajudar com a gestão de leads e automação de processos de vendas. Posso fornecer informações sobre métricas de desempenho, processos de qualificação de leads, ou ajudar com configurações específicas. O que mais gostaria de saber?';
        }
        
        resolve({ response });
      }, 1000);
    });
  },

  // Adicionar documento à base de conhecimento
  addDocument: async (document: File): Promise<boolean> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Documento adicionado à base de conhecimento:', document.name);
        resolve(true);
      }, 1500);
    });
  },

  // Reiniciar o agente
  restartAgent: async (): Promise<boolean> => {
    // Simulação de chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Agente reiniciado');
        resolve(true);
      }, 1000);
    });
  },
};
