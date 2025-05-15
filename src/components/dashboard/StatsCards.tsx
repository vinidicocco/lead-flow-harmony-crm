
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Banknote, Users, Target, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Stats } from '@/types';

interface StatsCardsProps {
  stats: Stats;
  upcomingMeetings: any[];
  formatDate: (dateString: string) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, upcomingMeetings, formatDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Leads</p>
              <h2 className="text-3xl font-bold">{stats?.totalLeads || 0}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="text-green-500 mr-1 h-4 w-4" />
            <span className="text-green-500 font-medium">{stats?.newLeadsThisMonth || 0} novos</span>
            <span className="text-gray-500 ml-1">neste mês</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita do Mês</p>
              <h2 className="text-3xl font-bold">{formatCurrency(stats?.revenueThisMonth || 0)}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Banknote className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="text-green-500 mr-1 h-4 w-4" />
            <span className="text-green-500 font-medium">{stats?.wonDealsThisMonth || 0} negócios</span>
            <span className="text-gray-500 ml-1">fechados</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
              <h2 className="text-3xl font-bold">{stats?.conversionRate || 0}%</h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Média do valor</span>
            <span className="text-purple-500 font-medium ml-1">{formatCurrency(stats?.averageDealSize || 0)}</span>
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
  );
};

export default StatsCards;
