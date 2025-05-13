
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  type: 'message' | 'qualification' | 'meeting' | 'document';
  content: string;
  time: string;
  status: 'success' | 'failed' | 'pending';
}

interface AgentActivityListProps {
  activities: Activity[];
}

export const AgentActivityList: React.FC<AgentActivityListProps> = ({ activities }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getActivityClass = (type: string) => {
    switch (type) {
      case 'message':
        return 'border-l-blue-500';
      case 'qualification':
        return 'border-l-purple-500';
      case 'meeting':
        return 'border-l-green-500';
      case 'document':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className={cn(
            "pl-3 py-2 border-l-2 flex justify-between items-start",
            getActivityClass(activity.type)
          )}
        >
          <div>
            <p className="text-sm">{activity.content}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          <div>{getStatusIcon(activity.status)}</div>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-center text-muted-foreground py-4">Nenhuma atividade recente</p>
      )}
    </div>
  );
};
