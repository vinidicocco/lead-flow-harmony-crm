
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile, getTasksByProfile } from '@/data/mockDataWrapper';
import { Lead, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Clock, CheckCircle, ArrowRight, Phone } from 'lucide-react';

const FollowUpPage = () => {
  const { currentProfile } = useProfile();
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  const tasks = useMemo(() => getTasksByProfile(currentProfile), [currentProfile]);
  
  const [activeTab, setActiveTab] = useState<'followups' | 'tasks'>('followups');
  
  // Filtrar leads que têm data de próximo follow-up
  const leadsWithFollowUp = useMemo(() => {
    return leads.filter(lead => lead.nextFollowUp);
  }, [leads]);
  
  // Ordenar leads por data de próximo follow-up (mais próximos primeiro)
  const sortedLeadsByFollowUp = useMemo(() => {
    return [...leadsWithFollowUp].sort((a, b) => {
      return new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime();
    });
  }, [leadsWithFollowUp]);
  
  // Verificar se um follow-up está próximo (nos próximos 3 dias)
  const isFollowUpSoon = (date: string) => {
    const followUpDate = new Date(date);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    return followUpDate <= threeDaysFromNow && followUpDate >= now;
  };
  
  // Verificar se um follow-up está atrasado
  const isFollowUpOverdue = (date: string) => {
    const followUpDate = new Date(date);
    const now = new Date();
    
    return followUpDate < now;
  };
  
  // Ordenar tarefas por prioridade e prazo
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Primeiro por status (não concluída -> concluída)
      if (a.status !== 'done' && b.status === 'done') return -1;
      if (a.status === 'done' && b.status !== 'done') return 1;
      
      // Depois por prioridade
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Por último, por prazo
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);
  
  // Marcar uma tarefa como concluída
  const markTaskAsDone = (taskId: string) => {
    toast.success('Tarefa marcada como concluída');
    // Aqui seria implementada a lógica para atualizar o status da tarefa no backend
  };
  
  // Registrar um contato com um lead
  const logContact = (leadId: string) => {
    toast.success('Contato registrado com sucesso');
    // Aqui seria implementada a lógica para registrar o contato no backend
  };
  
  // Formatar data para o formato brasileiro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Formatar data e hora para o formato brasileiro
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Acompanhamentos {currentProfile}</h1>
        <p className="text-gray-500 mt-1">
          Gerencie seus follow-ups e tarefas pendentes
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'followups' | 'tasks')}>
        <TabsList className="mb-6">
          <TabsTrigger value="followups">Follow-Ups Agendados</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="followups">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Acompanhamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedLeadsByFollowUp.length > 0 ? (
                  <div className="space-y-4">
                    {sortedLeadsByFollowUp.map((lead) => (
                      <div 
                        key={lead.id} 
                        className={`p-4 border rounded-lg ${
                          isFollowUpOverdue(lead.nextFollowUp!) 
                            ? 'border-red-300 bg-red-50' 
                            : isFollowUpSoon(lead.nextFollowUp!)
                            ? 'border-yellow-300 bg-yellow-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{lead.name}</h3>
                            <p className="text-sm text-gray-500">{lead.company}</p>
                            <div className="mt-2 flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              <span className={`text-sm ${
                                isFollowUpOverdue(lead.nextFollowUp!) 
                                  ? 'text-red-600 font-medium' 
                                  : isFollowUpSoon(lead.nextFollowUp!)
                                  ? 'text-yellow-600 font-medium'
                                  : 'text-gray-500'
                              }`}>
                                {isFollowUpOverdue(lead.nextFollowUp!)
                                  ? `Atrasado: ${formatDateTime(lead.nextFollowUp!)}`
                                  : `Agendado para: ${formatDateTime(lead.nextFollowUp!)}`
                                }
                              </span>
                            </div>
                            
                            {lead.lastContact && (
                              <div className="mt-1 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Último contato: {formatDate(lead.lastContact)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => logContact(lead.id)}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Registrar Contato
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => {
                                toast.success(`Agendado follow-up para ${lead.name}`);
                              }}
                            >
                              <ArrowRight className="w-4 h-4 mr-1" />
                              Agendar Próximo
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Textarea 
                            placeholder="Adicionar notas do contato..." 
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum follow-up agendado. Adicione follow-ups a partir da página de leads.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tarefas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`p-4 border rounded-lg ${
                          task.status === 'done'
                            ? 'border-green-200 bg-green-50'
                            : new Date(task.dueDate) < new Date()
                            ? 'border-red-300 bg-red-50'
                            : task.priority === 'high'
                            ? 'border-yellow-300 bg-yellow-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <p className={`text-sm ${task.status === 'done' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {task.description}
                            </p>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' 
                                  ? 'bg-red-100 text-red-800' 
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'high' 
                                  ? 'Alta Prioridade' 
                                  : task.priority === 'medium'
                                  ? 'Média Prioridade'
                                  : 'Baixa Prioridade'
                                }
                              </span>
                              
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                new Date(task.dueDate) < new Date() && task.status !== 'done'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                Prazo: {formatDate(task.dueDate)}
                              </span>
                              
                              {task.leadId && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                  {leads.find(lead => lead.id === task.leadId)?.name || 'Lead'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {task.status !== 'done' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markTaskAsDone(task.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Concluir
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Nenhuma tarefa pendente.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowUpPage;
