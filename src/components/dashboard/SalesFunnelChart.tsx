
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SalesFunnelChartProps {
  data: Array<{ status: string; value: number }>;
  profileColor: string;
}

const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ data, profileColor }) => {
  return (
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
              data={data}
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
                fill={profileColor} 
                name="Valor Total"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnelChart;
