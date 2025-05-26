
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/context/ProfileContext';
import { useStats, useLeads, useMeetings } from '@/hooks/useFirebaseData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Calendar, DollarSign, Target, Clock } from 'lucide-react';

const Index = () => {
  const { currentProfile } = useProfile();
  const { stats, loading: statsLoading } = useStats();
  const { leads, loading: leadsLoading } = useLeads();
  const { meetings, loading: meetingsLoading } = useMeetings();

  if (statsLoading || leadsLoading || meetingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const statusData = [
    { name: 'Qualificado', value: leads.filter(l => l.status === 'qualified').length, color: '#3b82f6' },
    { name: 'Contato', value: leads.filter(l => l.status === 'contacted').length, color: '#06b6d4' },
    { name: 'Proposta', value: leads.filter(l => l.status === 'proposal').length, color: '#8b5cf6' },
    { name: 'Contrato', value: leads.filter(l => l.status === 'contract').length, color: '#10b981' },
    { name: 'Fechado', value: leads.filter(l => l.status === 'closed').length, color: '#22c55e' }
  ];

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate.getMonth() === date.getMonth() && 
             leadDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short' }),
      leads: monthLeads.length,
      revenue: monthLeads.filter(l => l.status === 'closed').reduce((sum, l) => sum + l.value, 0) / 1000
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard {currentProfile}</h1>
          <p className="text-muted-foreground">Visão geral das suas vendas e atividades</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newLeadsThisMonth || 0} este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.wonDealsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {((stats?.revenueThisMonth || 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">
              este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              lead para fechamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {((stats?.averageDealSize || 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">
              por negócio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reuniões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {meetings.filter(m => m.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              agendadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Performance Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="leads" fill="#3b82f6" name="Leads" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Receita (k)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Próximas reuniões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Reuniões
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.filter(m => m.status === 'scheduled').slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {meetings.filter(m => m.status === 'scheduled').slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {meeting.leadName} • {meeting.date} às {meeting.time}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {meeting.duration}min
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma reunião agendada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
