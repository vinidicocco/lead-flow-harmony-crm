import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Clock, ListChecks, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getTasksByProfile, getLeadsByProfile } from '@/data/mockData';
import { Task, Lead } from '@/types';
import { useProfile } from '@/context/ProfileContext';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { currentProfile } = useProfile();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simula o carregamento de dados
    setTimeout(() => {
      const fetchedTasks = getTasksByProfile(currentProfile);
      const fetchedLeads = getLeadsByProfile(currentProfile);
      setTasks(fetchedTasks);
      setLeads(fetchedLeads);
      setIsLoading(false);
    }, 500);
  }, [currentProfile]);

  const completedTasks = useMemo(() => {
    if (!tasks) return 0;
    return tasks.filter(task => task.status === 'done').length;
  }, [tasks]);

  const taskProgress = useMemo(() => {
    if (!tasks) return 0;
    return (completedTasks / tasks.length) * 100;
  }, [tasks, completedTasks]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.slice(0, 5);
  }, [tasks]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.slice(0, 5);
  }, [leads]);

  const renderTasksList = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!tasks || tasks.length === 0) {
      return <p>Nenhuma tarefa encontrada.</p>;
    }

    // Ordene tasks por data de vencimento (mais próximas primeiro)
    const sortedTasks = filteredTasks.sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    return (
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {task.description || "Sem descrição"}
                    </p>
                    <div className="flex items-center mt-2">
                      <Clock className="mr-1 h-4 w-4" />
                      <span className="text-xs text-gray-500">
                        {formatDueDate(task)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{task.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );

    const formatDueDate = (task: Task) => {
      if (!task.due_date) return "Sem prazo";

      const dueDate = new Date(task.due_date);
      const now = new Date();

      const diffInDays = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );

      if (diffInDays === 0) {
        return "Hoje";
      } else if (diffInDays === 1) {
        return "Amanhã";
      } else {
        return `Em ${diffInDays} dias`;
      }
    };
  };

  const renderRecentLeads = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!leads || leads.length === 0) {
      return <p>Nenhum lead encontrado.</p>;
    }

    // Ordenar leads por data de criação (mais recentes primeiro)
    const sortedLeads = filteredLeads.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {sortedLeads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{lead.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                    <div className="flex items-center mt-2">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      <span className="text-xs text-gray-500">
                        Criado em {formatDate(lead.created_at)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{lead.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita Mensal
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              formatCurrency(45000)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            +20.1% do mês passado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              "+12"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            +19% da semana passada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Conversão
          </CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              "32%"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            +11% do mês passado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Progresso das Tasks
          </CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              `${completedTasks}/${tasks?.length || 0}`
            )}
          </div>
          <Progress value={taskProgress} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-3 w-20" />
            ) : (
              `${taskProgress?.toFixed(0)}% completo`
            )}
          </p>
        </CardContent>
      </Card>

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>
              Seus leads mais recentes. Mantenha-se atualizado.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderRecentLeads()}</CardContent>
        </Card>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Tasks</CardTitle>
            <CardDescription>
              Acompanhe suas tasks. Visualize, priorize e organize.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderTasksList()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
