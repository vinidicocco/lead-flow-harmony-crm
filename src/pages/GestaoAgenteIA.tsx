
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Imported refactored components
import { AgentDashboard } from '@/components/agent/AgentDashboard';
import { AgentChatTab } from '@/components/agent/AgentChatTab';
import { AgentKnowledgeBase } from '@/components/agent/AgentKnowledgeBase';
import { AgentConfigPanel } from '@/components/agent/AgentConfigPanel';

const GestaoAgenteIA = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Estado simulado para as métricas do agente
  const agentMetrics = {
    mensagensEnviadas: 1248,
    conversasAtivas: 17,
    leadsQualificados: 43,
    reunioesMarcadas: 28,
    taxaConversao: 64,
  };
  
  // Dados simulados para o gráfico de desempenho
  const performanceData = [
    { data: "01/05", mensagens: 42, leads: 4, reunioes: 1 },
    { data: "02/05", mensagens: 38, leads: 3, reunioes: 2 },
    { data: "03/05", mensagens: 45, leads: 5, reunioes: 3 },
    { data: "04/05", mensagens: 37, leads: 2, reunioes: 1 },
    { data: "05/05", mensagens: 50, leads: 6, reunioes: 4 },
    { data: "06/05", mensagens: 43, leads: 4, reunioes: 2 },
    { data: "07/05", mensagens: 58, leads: 7, reunioes: 3 },
  ];
  
  // Dados simulados para a lista de atividades recentes
  const recentActivities = [
    { id: 1, type: "message" as const, content: 'Respondeu a 3 perguntas de Amanda Silva sobre financiamento', time: '14:32', status: 'success' as const },
    { id: 2, type: "qualification" as const, content: 'Qualificou João Mendes como lead interessado', time: '13:45', status: 'success' as const },
    { id: 3, type: "meeting" as const, content: 'Agendou reunião com Rafael Santos para amanhã às 10h', time: '11:20', status: 'pending' as const },
    { id: 4, type: "document" as const, content: 'Enviou contrato para Mariana Oliveira', time: '09:15', status: 'success' as const },
    { id: 5, type: "message" as const, content: 'Não conseguiu qualificar o lead Pedro Alves', time: 'Ontem', status: 'failed' as const },
  ];

  const handleConfigSave = (config) => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do agente foram atualizadas com sucesso.",
    });
  };

  const handleDocumentUpload = () => {
    toast({
      title: "Documento recebido",
      description: "Documento adicionado à base de conhecimento do agente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão Agente IA</h1>
          <p className="text-muted-foreground">Monitoramento e configuração do agente IA SDR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({
            title: "Agente reiniciado",
            description: "O agente IA SDR foi reiniciado com sucesso.",
          })}>
            Reiniciar Agente
          </Button>
          <Button onClick={() => setActiveTab("config")}>Configurar Agente</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2 w-full md:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chat">Chat com Agente</TabsTrigger>
          <TabsTrigger value="conhecimento">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <AgentDashboard 
            agentMetrics={agentMetrics}
            performanceData={performanceData}
            recentActivities={recentActivities}
          />
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <AgentChatTab onDocumentUpload={handleDocumentUpload} />
        </TabsContent>

        {/* Base de Conhecimento Tab */}
        <TabsContent value="conhecimento" className="space-y-4">
          <AgentKnowledgeBase onDocumentUpload={handleDocumentUpload} />
        </TabsContent>

        {/* Configurações Tab */}
        <TabsContent value="config" className="space-y-4">
          <AgentConfigPanel 
            onSave={handleConfigSave} 
            isAdmin={user?.isAdmin} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoAgenteIA;
