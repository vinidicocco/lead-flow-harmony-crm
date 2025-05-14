
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { getLeadsByProfile, getTasksByProfile } from '@/data/mockData';
import { Lead, Task } from '@/types';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const FollowUp = () => {
  const { currentProfile, getProfileForDataFunctions } = useProfile() as any;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openLeadDialog, setOpenLeadDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const today = new Date();

  useEffect(() => {
    if (currentProfile) {
      setLeads(getLeadsByProfile(getProfileForDataFunctions(currentProfile)));
      setTasks(getTasksByProfile(getProfileForDataFunctions(currentProfile)));
    }
  }, [currentProfile]);
  
  const upcomingLeads = React.useMemo(() => {
    if (!leads) return [];
    
    return leads
      .filter(lead => lead.next_follow_up && new Date(lead.next_follow_up) >= today)
      .sort((a, b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime())
      .slice(0, 5);
  }, [leads]);
  
  const upcomingTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => task.due_date && new Date(task.due_date) >= today)
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);
  }, [tasks]);
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const getLeadName = (leadId: string): string => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : "Lead não encontrado";
  };
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenLeadDialog(true);
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setOpenTaskDialog(true);
  };
  
  const renderUpcomingLeadsList = () => {
    if (!upcomingLeads || upcomingLeads.length === 0) {
      return <p>Nenhum lead agendado para os próximos dias.</p>;
    }
    
    return (
      <ul>
        {upcomingLeads.map(lead => (
          <li 
            key={lead.id} 
            className="mb-2 p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => handleLeadClick(lead)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-500" />
                <span className="font-medium">{lead.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {lead.next_follow_up
                  ? formatDate(lead.next_follow_up)
                  : "Sem data definida"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  const renderUpcomingTasksList = () => {
    if (!upcomingTasks || upcomingTasks.length === 0) {
      return <p>Nenhuma tarefa pendente para os próximos dias.</p>;
    }
    
    return (
      <ul>
        {upcomingTasks.map(task => (
          <li 
            key={task.id}
            className="mb-2 p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span className="font-medium">{task.title}</span>
              </div>
              <span className="text-xs text-gray-500">
                {task.due_date ? formatDate(task.due_date) : "Sem prazo"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  const renderLeadDetails = (lead: Lead) => (
    <div className="space-y-2 p-4">
      <h4 className="text-lg font-semibold">{lead.name}</h4>
      <p className="text-gray-600">{lead.company}</p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Próximo contato:</span>
        <span>
          {lead.next_follow_up
            ? formatDate(lead.next_follow_up)
            : "Não agendado"}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Último contato:</span>
        <span>
          {lead.last_contact
            ? formatDate(lead.last_contact)
            : "Nenhum contato registrado"}
        </span>
      </div>
      <p className="text-sm text-gray-700">{lead.notes}</p>
    </div>
  );
  
  // Fixed: use description property instead of notes for Task
  const renderTaskDetails = (task: Task) => (
    <div className="space-y-2 p-4">
      <h4 className="text-lg font-semibold">{task.title}</h4>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Data Limite:</span>
        <span>
          {task.due_date ? formatDate(task.due_date) : "Sem prazo"}
        </span>
      </div>
      {task.lead_id && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Lead associado:</span>
          <span>{getLeadName(task.lead_id)}</span>
        </div>
      )}
      {/* Fixed: Using description instead of notes */}
    </div>
  );
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Acompanhamento</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximos Leads</CardTitle>
              <CardDescription>Leads agendados para os próximos dias.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderUpcomingLeadsList()}
            </CardContent>
          </Card>
        </div>
        
        {/* Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximas Tarefas</CardTitle>
              <CardDescription>Tarefas com prazo para os próximos dias.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderUpcomingTasksList()}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Lead Details Dialog */}
      <Dialog open={openLeadDialog} onOpenChange={setOpenLeadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas sobre o lead selecionado.</DialogDescription>
          </DialogHeader>
          {selectedLead && renderLeadDetails(selectedLead)}
        </DialogContent>
      </Dialog>
      
      {/* Task Details Dialog */}
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
            <DialogDescription>Informações completas sobre a tarefa selecionada.</DialogDescription>
          </DialogHeader>
          {selectedTask && renderTaskDetails(selectedTask)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUp;
