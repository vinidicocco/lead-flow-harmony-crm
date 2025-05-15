
import { Lead } from "@/types";

// Traduzir status para português
export const translateStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'qualified': 'Lead Qualificado',
    'contact_attempt': 'Tentativa de Contato',
    'contacted': 'Contato Realizado',
    'proposal': 'Proposta',
    'contract': 'Ass. de Contrato',
    'payment': 'Pagamento',
    'closed': 'Negócio Fechado'
  };
  
  return statusMap[status] || status;
};

// Calcular o valor total de leads por status
export const calculateValueByStatus = (leads: Lead[]) => {
  const statusValues: { [key: string]: number } = {};
  
  leads.forEach(lead => {
    if (!statusValues[lead.status]) {
      statusValues[lead.status] = 0;
    }
    statusValues[lead.status] += lead.value;
  });
  
  return Object.entries(statusValues).map(([status, value]) => ({
    status: translateStatus(status),
    value
  }));
};

// Calcular quantidade de leads por status
export const calculateLeadsByStatus = (leads: Lead[]) => {
  const counts: { [key: string]: number } = {};
  
  leads.forEach(lead => {
    if (!counts[lead.status]) {
      counts[lead.status] = 0;
    }
    counts[lead.status]++;
  });
  
  return Object.entries(counts).map(([status, count]) => ({
    status: translateStatus(status),
    count
  }));
};

// Formatação de data para padrão brasileiro
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Calcular fases do funil (para gráfico de funil)
export const calculateFunnelStages = (leads: Lead[]) => {
  const stageOrder = ['qualified', 'contact_attempt', 'contacted', 'proposal', 'contract', 'payment', 'closed'];
  const counts = stageOrder.map(stage => {
    const count = leads.filter(lead => lead.status === stage).length;
    return {
      stage: translateStatus(stage),
      count
    };
  });
  return counts;
};

// Calcular tarefas por prioridade
export const calculateTasksByPriority = (tasks: any[]) => {
  const counts = { high: 0, medium: 0, low: 0 };
  tasks.forEach(task => {
    if (task.status !== 'done') {
      counts[task.priority]++;
    }
  });
  
  return [
    { name: 'Alta', value: counts.high, color: '#ef4444' },
    { name: 'Média', value: counts.medium, color: '#f59e0b' },
    { name: 'Baixa', value: counts.low, color: '#10b981' }
  ];
};

// Calcular vendas por dia
export const calculateSalesByDay = (leads: Lead[]) => {
  if (!leads) return [];

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Filtra leads do mês atual que foram fechados
  const thisMonthClosedLeads = leads.filter(lead => 
    lead.status === 'closed' && 
    new Date(lead.created_at) >= startOfMonth && 
    new Date(lead.created_at) <= today
  );
  
  return thisMonthClosedLeads.map(lead => ({
    date: formatDate(lead.created_at),
    value: lead.value
  }));
};

// Calcular leads recentes
export const getRecentLeads = (leads: Lead[], limit = 5) => {
  return [...leads]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

// Obter reuniões próximas
export const getUpcomingMeetings = (meetings: any[], limit = 3) => {
  const now = new Date();
  return meetings
    .filter(meeting => new Date(meeting.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
};
