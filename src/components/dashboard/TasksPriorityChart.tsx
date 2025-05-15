
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface TaskPriority {
  name: string;
  value: number;
  color: string;
}

interface TasksPriorityChartProps {
  tasksByPriority: TaskPriority[];
}

const TasksPriorityChart: React.FC<TasksPriorityChartProps> = ({ tasksByPriority }) => {
  return (
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
  );
};

export default TasksPriorityChart;
