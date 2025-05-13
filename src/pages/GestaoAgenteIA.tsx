
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { BotMessageSquare, SendHorizontal, User, BarChart2, MessageSquare, Calendar, Users, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AgentMetricCard } from '@/components/agent/AgentMetricCard';
import { AgentChat } from '@/components/agent/AgentChat';
import { AgentPerformanceChart } from '@/components/agent/AgentPerformanceChart';
import { AgentActivityList } from '@/components/agent/AgentActivityList';
import { AgentConfigPanel } from '@/components/agent/AgentConfigPanel';
import { useAuth } from '@/context/AuthContext';

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
  
  // Dados simulados para a lista de atividades recentes - corrigido para o tipo adequado
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

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <AgentMetricCard 
              title="Mensagens Enviadas"
              value={agentMetrics.mensagensEnviadas}
              icon={<MessageSquare className="h-5 w-5" />}
              description="Total desde a ativação"
              trend="+12% esta semana"
              trendUp={true}
            />
            <AgentMetricCard 
              title="Conversas Ativas"
              value={agentMetrics.conversasAtivas}
              icon={<Users className="h-5 w-5" />}
              description="Leads em conversação"
              trend="+3 desde ontem"
              trendUp={true}
            />
            <AgentMetricCard 
              title="Leads Qualificados"
              value={agentMetrics.leadsQualificados}
              icon={<Users className="h-5 w-5" />}
              description="Total desde a ativação"
              trend="+5 esta semana"
              trendUp={true}
            />
            <AgentMetricCard 
              title="Reuniões Marcadas"
              value={agentMetrics.reunioesMarcadas}
              icon={<Calendar className="h-5 w-5" />}
              description="Total desde a ativação"
              trend="+2 esta semana"
              trendUp={true}
            />
            <AgentMetricCard 
              title="Taxa de Conversão"
              value={`${agentMetrics.taxaConversao}%`}
              icon={<BarChart2 className="h-5 w-5" />}
              description="Leads qualificados/reuniões"
              trend="+2% esta semana"
              trendUp={true}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Desempenho do Agente</CardTitle>
                <CardDescription>Atividade dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentPerformanceChart data={performanceData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas ações do agente</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentActivityList activities={recentActivities} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat com Agente */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat com Agente IA SDR</CardTitle>
              <CardDescription>
                Converse diretamente com o agente para treinamento e testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgentChat onDocumentUpload={handleDocumentUpload} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base de Conhecimento */}
        <TabsContent value="conhecimento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Base de Conhecimento</CardTitle>
              <CardDescription>
                Gerencie os documentos e informações que o agente pode acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Documentos na Base</h3>
                  <Button onClick={handleDocumentUpload}>Adicionar Documento</Button>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-center text-muted-foreground py-8">
                      Esta funcionalidade requer a integração com Supabase para gestão completa da base de conhecimento.
                      <br/>
                      Por favor, configure a integração nas configurações de API.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
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
