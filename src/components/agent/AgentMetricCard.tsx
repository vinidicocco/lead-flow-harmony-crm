
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface AgentMetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  trendUp?: boolean;
}

export const AgentMetricCard: React.FC<AgentMetricCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendUp,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex items-center gap-1">
            {trend && (
              <>
                {trendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-xs ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {trend}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm text-muted-foreground font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
