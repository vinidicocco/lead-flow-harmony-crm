
import { Lead, Meeting, Task } from '@/types';

// Utilitário para gerar dados mockados completos
export const generateMockLeads = (): Lead[] => {
  const baseLeads = [
    // SALT Leads (15 leads)
    {
      id: '1', name: 'João Silva', company: 'Embraer S.A.', position: 'Diretor Financeiro',
      email: 'joao.silva@embraer.com.br', phone: '+55 (12) 99876-5432', status: 'qualified' as const,
      value: 185000, notes: 'Interessado em soluções de crédito para expansão de operações.',
      assignedTo: '1', profile: 'SALT' as const, organizationId: 'salt-org-1',
      createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z',
      nextFollowUp: '2025-05-15T09:00:00Z'
    },
    {
      id: '2', name: 'Mariana Oliveira', company: 'Banco Inter', position: 'Gerente de Parcerias',
      email: 'mariana.oliveira@bancointer.com.br', phone: '+55 (31) 98765-4321', status: 'qualified' as const,
      value: 120000, notes: 'Busca soluções para otimizar processo de análise de crédito.',
      assignedTo: '1', profile: 'SALT' as const, organizationId: 'salt-org-1',
      createdAt: '2025-04-02T11:30:00Z', updatedAt: '2025-04-02T11:30:00Z',
      nextFollowUp: '2025-05-16T10:30:00Z'
    },
    // GHF Leads (15 leads)
    {
      id: '16', name: 'Ana Beatriz Mendes', company: 'Hospital Albert Einstein', position: 'Diretora Administrativa',
      email: 'ana.mendes@einstein.br', phone: '+55 (11) 97878-5656', status: 'qualified' as const,
      value: 320000, notes: 'Interesse em sistema de gestão hospitalar integrado.',
      assignedTo: '2', profile: 'GHF' as const, organizationId: 'ghf-org-1',
      createdAt: '2025-04-03T09:15:00Z', updatedAt: '2025-04-03T09:15:00Z',
      nextFollowUp: '2025-05-19T13:00:00Z'
    }
  ];

  // Gerar os outros leads seguindo o mesmo padrão
  const allStatuses = ['qualified', 'contact_attempt', 'contacted', 'proposal', 'contract', 'payment', 'closed'] as const;
  const additionalLeads: Lead[] = [];

  // Gerar mais leads para completar o conjunto
  for (let i = 3; i <= 30; i++) {
    const isGHF = i >= 16;
    const orgId = isGHF ? 'ghf-org-1' : 'salt-org-1';
    const profile = isGHF ? 'GHF' : 'SALT';
    const statusIndex = (i - 1) % allStatuses.length;
    
    additionalLeads.push({
      id: i.toString(),
      name: `Lead ${i}`,
      company: `Empresa ${i}`,
      position: 'Diretor',
      email: `lead${i}@empresa${i}.com`,
      phone: `+55 (11) 9999-${i.toString().padStart(4, '0')}`,
      status: allStatuses[statusIndex],
      value: 100000 + (i * 10000),
      notes: `Lead ${i} - Notas de acompanhamento`,
      assignedTo: isGHF ? '2' : '1',
      profile,
      organizationId: orgId,
      createdAt: `2025-04-${(i % 30 + 1).toString().padStart(2, '0')}T10:00:00Z`,
      updatedAt: `2025-04-${(i % 30 + 1).toString().padStart(2, '0')}T10:00:00Z`,
      nextFollowUp: `2025-05-${(i % 30 + 1).toString().padStart(2, '0')}T10:00:00Z`
    });
  }

  return [...baseLeads, ...additionalLeads];
};

export const generateMockMeetings = (): Meeting[] => {
  return [
    {
      id: '1', title: 'Reunião de Descoberta Inicial', date: '2025-05-15', time: '09:00',
      duration: 30, leadId: '1', leadName: 'João Silva',
      notes: 'Discutir desafios atuais e potenciais soluções de crédito.',
      status: 'scheduled' as const, profile: 'SALT' as const, organizationId: 'salt-org-1'
    },
    {
      id: '2', title: 'Apresentação de Produtos', date: '2025-05-18', time: '14:00',
      duration: 60, leadId: '2', leadName: 'Mariana Oliveira',
      notes: 'Demonstração das soluções de análise de crédito.',
      status: 'scheduled' as const, profile: 'SALT' as const, organizationId: 'salt-org-1'
    },
    {
      id: '5', title: 'Consulta Inicial', date: '2025-05-19', time: '13:00',
      duration: 45, leadId: '16', leadName: 'Ana Beatriz Mendes',
      notes: 'Discutir necessidades de gestão hospitalar e potenciais soluções.',
      status: 'scheduled' as const, profile: 'GHF' as const, organizationId: 'ghf-org-1'
    }
  ];
};

export const generateMockTasks = (): Task[] => {
  return [
    {
      id: '1', title: 'Enviar email de acompanhamento',
      description: 'Enviar email com informações adicionais solicitadas sobre linhas de crédito.',
      status: 'todo' as const, dueDate: '2025-05-16', priority: 'high' as const,
      assignedTo: '1', leadId: '1', profile: 'SALT' as const, organizationId: 'salt-org-1'
    },
    {
      id: '5', title: 'Agendar demonstração do produto',
      description: 'Coordenar com equipe de produto para próxima demonstração.',
      status: 'todo' as const, dueDate: '2025-05-18', priority: 'medium' as const,
      assignedTo: '2', leadId: '16', profile: 'GHF' as const, organizationId: 'ghf-org-1'
    }
  ];
};
