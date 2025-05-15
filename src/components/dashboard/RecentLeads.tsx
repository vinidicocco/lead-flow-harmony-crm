
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface RecentLeadsProps {
  leads: Lead[];
  formatDate: (dateString: string) => string;
  translateStatus: (status: string) => string;
}

const RecentLeads: React.FC<RecentLeadsProps> = ({ leads, formatDate, translateStatus }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Leads Recentes</CardTitle>
        <CardDescription>
          Os 5 leads mais recentemente adicionados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.map((lead) => (
            <div 
              key={lead.id}
              className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.company}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {formatDate(lead.created_at)}
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
  );
};

export default RecentLeads;
