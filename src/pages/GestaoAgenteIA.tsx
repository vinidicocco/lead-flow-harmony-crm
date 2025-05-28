
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { agentService, AgentMetrics, AgentPerformanceData, AgentActivity } from '@/services/agentService';

// Imported refactored components
import { AgentDashboard } from '@/components/agent/AgentDashboard';
import { AgentChatTab } from '@/components/agent/AgentChatTab';
import { AgentKnowledgeBase } from '@/components/agent/AgentKnowledgeBase';
import { AgentConfigPanel } from '@/components/agent/AgentConfigPanel';

const GestaoAgenteIA = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics>({
    mensagensEnviadas: 0,
    conversasAtivas: 0,
    leadsQualificados: 0,
    reunioesMarcadas: 0,
    taxaConversao: 0,
  });
  const [performanceData, setPerformanceData] = useState<AgentPerformanceData[]>([]);
  const [recentActivities, setRecentActivities] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    setIsLoading(true);
    try {
      // Usando um ID de organização fixo para demonstração
      const organizationId = 'demo-org';
      
      const [metrics, performance, activities] = await Promise.all([
        agentService.getMetrics(organizationId),
        agentService.getPerformanceData(organizationId),
        agentService.getRecentActivities(organizationId)
      ]);

      setAgentMetrics(metrics);
      setPerformanceData(performance);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading agent data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do agente"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSave = async (config: any) => {
    try {
      const organizationId = 'demo-org';
      await agentService.updateConfig(organizationId, config);
      toast({
        title: "Configurações salvas",
        description: "As configurações do agente foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as configurações."
      });
    }
  };

  const handleDocumentUpload = () => {
    toast({
      title: "Documento recebido",
      description: "Documento adicionado à base de conhecimento do agente.",
    });
  };

  const handleRestartAgent = () => {
    toast({
      title: "Agente reiniciado",
      description: "O agente IA SDR foi reiniciado com sucesso.",
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
          <Button variant="outline" onClick={handleRestartAgent}>
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
            isLoading={isLoading}
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
            isAdmin={true} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoAgenteIA;
