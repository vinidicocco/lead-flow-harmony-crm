
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PerformanceDataPoint {
  data: string;
  mensagens: number;
  leads: number;
  reunioes: number;
}

interface AgentPerformanceChartProps {
  data: PerformanceDataPoint[];
}

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="mensagens" 
            name="Mensagens" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="leads" 
            name="Leads Qualificados" 
            stroke="#82ca9d" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="reunioes" 
            name="Reuniões Marcadas" 
            stroke="#ffc658" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
