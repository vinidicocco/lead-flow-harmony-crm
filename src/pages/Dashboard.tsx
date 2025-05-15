
import React, { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { 
  getLeadsByProfile, 
  getMeetingsByProfile,
  getTasksByProfile,
  getStatsByProfile
} from '@/data/mockDataWrapper';
import { Lead } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowUpRight, Banknote, Users, Target, Calendar, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentProfile } = useProfile();
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  const meetings = useMemo(() => getMeetingsByProfile(currentProfile), [currentProfile]);
  const tasks = useMemo(() => getTasksByProfile(currentProfile), [currentProfile]);
  const stats = useMemo(() => getStatsByProfile(currentProfile), [currentProfile]);
  
  // Formatar valores monetários para BRL (Real brasileiro)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calcular o valor total de leads por status
  const calculateValueByStatus = () => {
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
  
  // Traduzir status para português
  const translateStatus = (status: string): string => {
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
  
  // Calcular quantidade de leads por status
  const calculateLeadsByStatus = () => {
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
  
  // Calcular fases do funil (para gráfico de funil)
  const funnelStages = useMemo(() => {
    const stageOrder = ['qualified', 'contact_attempt', 'contacted', 'proposal', 'contract', 'payment', 'closed'];
    const counts = stageOrder.map(stage => {
      const count = leads.filter(lead => lead.status === stage).length;
      return {
        stage: translateStatus(stage),
        count
      };
    });
    return counts;
  }, [leads]);
  
  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Calcular tarefas por prioridade
  const tasksByPriority = useMemo(() => {
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
  }, [tasks]);
  
  // Cálculo de próximos e leads recentes (mais recentes primeiro)
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [leads]);
  
  // Reuniões próximas (ordenadas por data)
  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return meetings
      .filter(meeting => new Date(meeting.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [meetings]);
  
  // Formatação de data para padrão brasileiro
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard {currentProfile}</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Leads</p>
                <h2 className="text-3xl font-bold">{stats.totalLeads}</h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="text-green-500 mr-1 h-4 w-4" />
              <span className="text-green-500 font-medium">{stats.newLeadsThisMonth} novos</span>
              <span className="text-gray-500 ml-1">neste mês</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Receita do Mês</p>
                <h2 className="text-3xl font-bold">{formatCurrency(stats.revenueThisMonth)}</h2>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Banknote className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="text-green-500 mr-1 h-4 w-4" />
              <span className="text-green-500 font-medium">{stats.wonDealsThisMonth} negócios</span>
              <span className="text-gray-500 ml-1">fechados</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                <h2 className="text-3xl font-bold">{stats.conversionRate}%</h2>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Média do valor</span>
              <span className="text-purple-500 font-medium ml-1">{formatCurrency(stats.averageDealSize)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reuniões Agendadas</p>
                <h2 className="text-3xl font-bold">{upcomingMeetings.length}</h2>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Próxima:</span>
              {upcomingMeetings.length > 0 ? (
                <span className="text-amber-500 font-medium ml-1">
                  {formatDate(upcomingMeetings[0].date)}
                </span>
              ) : (
                <span className="text-gray-500 ml-1">Nenhuma</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Valor por Etapa do Funil</CardTitle>
            <CardDescription>
              Valor total de negócios em cada etapa do funil de vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={calculateValueByStatus()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="status" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        notation: 'compact',
                        compactDisplay: 'short',
                        maximumFractionDigits: 1,
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), "Valor"]}
                    labelFormatter={(label) => `Status: ${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={currentProfile === 'SALT' ? '#8884d8' : '#0EA5E9'} 
                    name="Valor Total"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leads por Etapa</CardTitle>
            <CardDescription>
              Distribuição de leads no funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculateLeadsByStatus()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                  >
                    {calculateLeadsByStatus().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} leads`, "Quantidade"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>
              Os 5 leads mais recentemente adicionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{lead.name}</h3>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {formatDate(lead.createdAt)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lead.status === 'closed' 
                          ? 'bg-green-100 text-green-800' 
                          : lead.status === 'qualified' || lead.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {translateStatus(lead.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(lead.value)}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Próximas Reuniões e Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>
              Por prioridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefas`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center py-2 border-t">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Alta Prioridade</span>
                </div>
                <span>{tasksByPriority[0].value}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Média Prioridade</span>
                </div>
                <span>{tasksByPriority[1].value}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Baixa Prioridade</span>
                </div>
                <span>{tasksByPriority[2].value}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Ver Todas as Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
