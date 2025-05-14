
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from '@/context/ProfileContext';
import { getStatsByProfile, getLeadsByProfile, getTasksByProfile } from '@/data/mockData';
import { 
  Bar, BarChart, 
  Pie, PieChart, 
  Cell, 
  ResponsiveContainer, 
  XAxis, YAxis, 
  Tooltip, 
  Legend,
  LineChart, Line,
  FunnelChart, Funnel,
  LabelList
} from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter
} from 'lucide-react';

const Dashboard = () => {
  const { currentProfile } = useProfile();
  const stats = useMemo(() => getStatsByProfile(currentProfile), [currentProfile]);
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  const tasks = useMemo(() => getTasksByProfile(currentProfile), [currentProfile]);

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Traduzir status para portugês
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'qualified': 'Lead Qualificado',
      'contact_attempt': 'Tentativa de Contato',
      'contacted': 'Contato Realizado',
      'proposal': 'Proposta',
      'contract': 'Ass. de Contrato',
      'payment': 'Transferência/Pagamento',
      'closed': 'Negócio Fechado'
    };
    return statusMap[status] || status;
  };

  // Gerar dados do gráfico baseado no perfil
  const leadsByStatus = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(statusCounts).map(status => ({
      name: translateStatus(status),
      count: statusCounts[status]
    }));
  }, [leads]);

  // Dados do funil de vendas
  const funnelData = useMemo(() => {
    if (currentProfile === 'SALT') {
      return [
        { name: 'Novo Lead', value: leads.filter(lead => lead.status === 'qualified').length, fill: '#0088FE' },
        { name: 'Contato Iniciado', value: leads.filter(lead => lead.status === 'contacted').length, fill: '#00C49F' },
        { name: 'Simulação Enviada', value: leads.filter(lead => lead.status === 'proposal').length, fill: '#FFBB28' },
        { name: 'Aguardando Documentos', value: leads.filter(lead => lead.status === 'contract').length, fill: '#FF8042' },
        { name: 'Encaminhado à Administradora', value: leads.filter(lead => lead.status === 'payment').length, fill: '#8884d8' },
        { name: 'Finalizado', value: leads.filter(lead => lead.status === 'closed').length, fill: '#82ca9d' },
      ];
    } else {
      return [
        { name: 'Contato Estabelecido', value: leads.filter(lead => lead.status === 'contacted').length, fill: '#0088FE' },
        { name: 'Análise do Contrato', value: leads.filter(lead => lead.status === 'qualified').length, fill: '#00C49F' },
        { name: 'Negociação', value: leads.filter(lead => lead.status === 'proposal').length, fill: '#FFBB28' },
        { name: 'Aguardando Pagamento', value: leads.filter(lead => lead.status === 'payment').length, fill: '#FF8042' },
        { name: 'Finalizado', value: leads.filter(lead => lead.status === 'closed').length, fill: '#8884d8' },
      ];
    }
  }, [leads, currentProfile]);

  // Dados de desempenho mensal (dados fictícios para ilustração)
  const monthlyPerformance = useMemo(() => {
    return [
      { month: 'Jan', leads: 5, deals: 2 },
      { month: 'Fev', leads: 7, deals: 3 },
      { month: 'Mar', leads: 10, deals: 4 },
      { month: 'Abr', leads: 8, deals: 3 },
      { month: 'Mai', leads: 12, deals: 5 },
      { month: 'Jun', leads: 15, deals: 6 },
    ];
  }, []);

  // Dados de distribuição de receita
  const revenueDistribution = useMemo(() => {
    return [
      { name: 'Crédito Consignado', value: 35 },
      { name: 'Empréstimo Pessoal', value: 25 },
      { name: 'Financiamento', value: 20 },
      { name: 'Outros', value: 20 },
    ];
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const getCustomKPIs = () => {
    if (currentProfile === 'SALT') {
      return (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Simulações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(lead => lead.status === 'qualified').length}</div>
              <p className="text-xs text-gray-500 mt-1">Este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Encaminhados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(lead => lead.status === 'payment').length}</div>
              <p className="text-xs text-gray-500 mt-1">Às administradoras</p>
            </CardContent>
          </Card>
        </>
      );
    } else { // GHF
      return (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Contratos em Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(lead => lead.status === 'qualified').length}</div>
              <p className="text-xs text-gray-500 mt-1">Este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Aguardando Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(lead => lead.status === 'payment').length}</div>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard {currentProfile}</h1>
        <p className="text-gray-500">Hoje: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Receita Total (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</div>
            <p className="text-xs text-gray-500 mt-1">De {stats.wonDealsThisMonth} negócios</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Lead para negócio</p>
          </CardContent>
        </Card>
        
        {getCustomKPIs()}
      </div>
      
      <Tabs defaultValue="distribution" className="mb-8">
        <TabsList>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChartIcon size={16} />
            Distribuição de Leads
          </TabsTrigger>
          <TabsTrigger value="funnel" className="flex items-center gap-2">
            <Filter size={16} />
            Funil de Vendas
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <LineChartIcon size={16} />
            Desempenho Mensal
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <PieChartIcon size={16} />
            Distribuição de Receita
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Leads por Status</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStatus}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill={currentProfile === 'SALT' ? '#0891b2' : '#9333ea'} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="funnel" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip formatter={(value) => `${value} leads`} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive={true}
                    labelLine={false}
                  >
                    <LabelList 
                      position="right" 
                      fill="#000" 
                      stroke="none" 
                      dataKey="name" 
                      fontSize={12}
                    />
                    <LabelList
                      position="center"
                      fill="#fff"
                      stroke="none"
                      dataKey="value"
                      fontSize={14}
                      fontWeight="bold"
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformance}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#0891b2" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Leads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deals" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    name="Negócios"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Receita</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status !== 'done')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description.slice(0, 50)}{task.description.length > 50 ? '...' : ''}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              }
              {tasks.filter(task => task.status !== 'done').length === 0 && (
                <p className="text-gray-500 text-center py-6">Sem tarefas pendentes</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Empresa</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {leads
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map(lead => (
                      <tr key={lead.id} className="border-b">
                        <td className="py-3 px-4">{lead.name}</td>
                        <td className="py-3 px-4">{lead.company}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lead.status === 'qualified' || lead.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'proposal' || lead.status === 'contract'
                              ? 'bg-yellow-100 text-yellow-800'
                              : lead.status === 'payment' || lead.status === 'closed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {translateStatus(lead.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">{formatCurrency(lead.value)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
