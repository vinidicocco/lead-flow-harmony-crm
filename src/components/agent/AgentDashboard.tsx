
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AgentMetricCard } from '@/components/agent/AgentMetricCard';
import { AgentPerformanceChart } from '@/components/agent/AgentPerformanceChart';
import { AgentActivityList } from '@/components/agent/AgentActivityList';
import { BarChart2, MessageSquare, Users, Calendar } from 'lucide-react';

interface AgentDashboardProps {
  agentMetrics: {
    mensagensEnviadas: number;
    conversasAtivas: number;
    leadsQualificados: number;
    reunioesMarcadas: number;
    taxaConversao: number;
  };
  performanceData: Array<{
    data: string;
    mensagens: number;
    leads: number;
    reunioes: number;
  }>;
  recentActivities: Array<{
    id: number;
    type: "message" | "qualification" | "meeting" | "document";
    content: string;
    time: string;
    status: "success" | "pending" | "failed";
  }>;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  agentMetrics,
  performanceData,
  recentActivities
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
