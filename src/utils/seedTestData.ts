
import { dbService, collections } from '@/services/firebaseService';
import { serverTimestamp } from 'firebase/firestore';

export const seedTestData = async (organizationId: string, userId: string) => {
  try {
    console.log('Checking for existing test data...');
    
    // Check if test data already exists
    const existingLeads = await dbService.query(collections.LEADS, []);
    
    if (existingLeads.documents.length > 0) {
      console.log('Test data already exists, skipping seed');
      return { success: true, message: 'Test data already exists' };
    }
    
    console.log('Creating test data...');
    
    // Create test leads
    const testLeads = [
      {
        name: 'João Silva',
        email: 'joao.silva@embraer.com.br',
        phone: '+5511999999999',
        company: 'Embraer S.A.',
        position: 'Diretor de Tecnologia',
        status: 'qualified',
        value: 185000,
        notes: 'Interessado em soluções de automação para a linha de produção.',
        assignedTo: userId,
        organizationId,
        profile: 'SALT'
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@petrobras.com.br',
        phone: '+5521888888888',
        company: 'Petrobras',
        position: 'Gerente de Projetos',
        status: 'contact_attempt',
        value: 320000,
        notes: 'Potencial cliente para sistema de gestão de projetos.',
        assignedTo: userId,
        organizationId,
        profile: 'SALT'
      },
      {
        name: 'Carlos Oliveira',
        email: 'carlos@vale.com',
        phone: '+5531777777777',
        company: 'Vale S.A.',
        position: 'Coordenador de TI',
        status: 'contacted',
        value: 150000,
        notes: 'Reunião marcada para apresentação da solução.',
        assignedTo: userId,
        organizationId,
        profile: 'SALT'
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@bradesco.com.br',
        phone: '+5511666666666',
        company: 'Banco Bradesco',
        position: 'Analista Sênior',
        status: 'proposal',
        value: 275000,
        notes: 'Proposta enviada, aguardando retorno.',
        assignedTo: userId,
        organizationId,
        profile: 'GHF'
      },
      {
        name: 'Roberto Lima',
        email: 'roberto@magazine.com',
        phone: '+5511555555555',
        company: 'Magazine Luiza',
        position: 'Diretor de Operações',
        status: 'contract',
        value: 190000,
        notes: 'Contrato em análise jurídica.',
        assignedTo: userId,
        organizationId,
        profile: 'GHF'
      }
    ];
    
    // Create leads
    const createdLeads = [];
    for (const lead of testLeads) {
      const createdLead = await dbService.create(collections.LEADS, lead);
      createdLeads.push(createdLead);
    }
    
    // Create test follow-ups
    const testFollowUps = [
      {
        leadId: createdLeads[0].id,
        userId,
        organizationId,
        dueDate: new Date('2025-05-13T09:00:00'),
        status: 'pending',
        notes: 'Fazer contato para agendar reunião técnica',
      },
      {
        leadId: createdLeads[1].id,
        userId,
        organizationId,
        dueDate: new Date('2025-05-14T14:00:00'),
        status: 'pending',
        notes: 'Retomar contato após tentativa inicial',
      },
      {
        leadId: createdLeads[2].id,
        userId,
        organizationId,
        dueDate: new Date('2025-05-15T10:30:00'),
        status: 'pending',
        notes: 'Preparar apresentação para reunião',
      }
    ];
    
    // Create follow-ups
    for (const followUp of testFollowUps) {
      await dbService.create(collections.FOLLOW_UPS, followUp);
    }
    
    // Create test meetings
    const testMeetings = [
      {
        title: 'Reunião de Apresentação - Embraer',
        date: '2025-05-16',
        time: '10:00',
        duration: 60,
        leadId: createdLeads[0].id,
        leadName: createdLeads[0].name,
        notes: 'Apresentação da solução de automação',
        status: 'scheduled',
        profile: 'SALT',
        organizationId
      },
      {
        title: 'Follow-up - Vale',
        date: '2025-05-17',
        time: '15:00',
        duration: 30,
        leadId: createdLeads[2].id,
        leadName: createdLeads[2].name,
        notes: 'Discussão sobre próximos passos',
        status: 'scheduled',
        profile: 'SALT',
        organizationId
      }
    ];
    
    // Create meetings
    for (const meeting of testMeetings) {
      await dbService.create(collections.MEETINGS, meeting);
    }
    
    // Create test agent config
    const agentConfig = {
      organizationId,
      name: 'Assistente IA SDR',
      personality: 'Profissional, amigável e focado em resultados',
      welcomeMessage: 'Olá! Sou seu assistente de vendas IA. Como posso ajudá-lo hoje?',
      qualificationFlow: 'Identificar necessidades -> Qualificar budget -> Agendar reunião',
      whatsappInstance: '',
      n8nWebhookUrl: '',
      openaiApiKey: ''
    };
    
    await dbService.create(collections.AGENT_CONFIGS, agentConfig);
    
    // Create test communications
    const testCommunications = [
      {
        organizationId,
        leadId: createdLeads[0].id,
        type: 'email',
        direction: 'outbound',
        content: 'Email de apresentação enviado',
        status: 'sent'
      },
      {
        organizationId,
        leadId: createdLeads[1].id,
        type: 'call',
        direction: 'outbound',
        content: 'Tentativa de ligação - não atendeu',
        status: 'failed'
      }
    ];
    
    // Create communications
    for (const comm of testCommunications) {
      await dbService.create(collections.COMMUNICATIONS, comm);
    }
    
    console.log('Test data created successfully');
    return { 
      success: true, 
      message: `Created ${createdLeads.length} leads, ${testFollowUps.length} follow-ups, ${testMeetings.length} meetings, and other test data` 
    };
    
  } catch (error: any) {
    console.error('Error seeding test data:', error);
    return { success: false, error: error.message };
  }
};

export const clearTestData = async (organizationId: string) => {
  try {
    console.log('Clearing test data...');
    
    // Get all documents for this organization
    const collections_to_clear = [
      collections.LEADS,
      collections.FOLLOW_UPS,
      collections.MEETINGS,
      collections.COMMUNICATIONS,
      collections.AGENT_CONFIGS
    ];
    
    for (const collectionName of collections_to_clear) {
      const result = await dbService.query(collectionName, []);
      
      for (const doc of result.documents) {
        await dbService.delete(collectionName, doc.id);
      }
    }
    
    console.log('Test data cleared successfully');
    return { success: true, message: 'Test data cleared' };
    
  } catch (error: any) {
    console.error('Error clearing test data:', error);
    return { success: false, error: error.message };
  }
};
