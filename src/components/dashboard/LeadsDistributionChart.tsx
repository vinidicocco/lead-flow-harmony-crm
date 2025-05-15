
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface LeadsDistributionChartProps {
  data: Array<{ status: string; count: number }>;
  colors: string[];
}

const LeadsDistributionChart: React.FC<LeadsDistributionChartProps> = ({ data, colors }) => {
  return (
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
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
  );
};

export default LeadsDistributionChart;
