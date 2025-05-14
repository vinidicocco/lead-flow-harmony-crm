
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockData';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, Phone, FileText, FileSignature, ArrowRight, Handshake, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const KanbanBoard = () => {
  const { currentProfile } = useProfile();
  const allLeads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  // Estados para o quadro kanban
  const [leads, setLeads] = useState<Lead[]>(allLeads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Definir colunas unificadas do kanban para ambos os perfis
  const columns = useMemo(() => [
    { id: 'qualified', title: 'Lead Qualificado', icon: <Check className="w-4 h-4" /> },
    { id: 'contact_attempt', title: 'Tentativa de Contato', icon: <Phone className="w-4 h-4" /> },
    { id: 'contacted', title: 'Contato Realizado', icon: <Phone className="w-4 h-4 text-green-500" /> },
    { id: 'proposal', title: 'Proposta', icon: <FileText className="w-4 h-4" /> },
    { id: 'contract', title: 'Ass. de Contrato', icon: <FileSignature className="w-4 h-4" /> },
    { id: 'payment', title: 'Transferência/Pagamento', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'closed', title: 'Negócio Fechado', icon: <Handshake className="w-4 h-4" /> },
  ], []);

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Lidar com o início do arrasto
  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  // Lidar com o arrasto sobre
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Lidar com a soltura
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    
    if (draggedLead) {
      const updatedLeads = leads.map(lead => {
        if (lead.id === draggedLead.id) {
          toast.success(`Movido ${lead.name} para ${status}`);
          return { ...lead, status: status as Lead['status'] };
        }
        return lead;
      });
      
      setLeads(updatedLeads);
      setDraggedLead(null);
    }
  };

  // Abrir o diálogo com detalhes do lead
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  // Filtrar leads por status
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Calcular totais para cada coluna
  const calculateColumnTotal = (status: string) => {
    return getLeadsByStatus(status).reduce((total, lead) => total + lead.value, 0);
  };

  // Obter o nome do status mais legível
  const getStatusLabel = (status: string) => {
    const column = columns.find(col => col.id === status);
    return column ? column.title : status;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} CRM</h1>
        <Button onClick={() => setLeads(allLeads)}>Resetar Quadro</Button>
      </div>
      
      <div className="kanban-board overflow-x-auto pb-6">
        {columns.map(column => (
          <div 
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {column.icon}
                <h2 className="font-bold">{column.title}</h2>
              </div>
              <span className="text-sm text-gray-500">{getLeadsByStatus(column.id).length}</span>
            </div>
            
            <div className="text-xs text-gray-500 mb-2">
              {calculateColumnTotal(column.id) > 0 && (
                <>Total: {formatCurrency(calculateColumnTotal(column.id))}</>
              )}
            </div>
            
            <div className="space-y-2">
              {getLeadsByStatus(column.id).map(lead => (
                <div
                  key={lead.id}
                  className={`kanban-card ${
                    currentProfile === 'SALT' 
                      ? 'border-l-[#9b87f5]' 
                      : 'border-l-[#0EA5E9]'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                >
                  <h3 
                    className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openLeadDetails(lead)}
                  >
                    {lead.name}
                  </h3>
                  <p className="text-xs text-gray-500">{lead.company}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium">
                      {formatCurrency(lead.value)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(lead.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Diálogo de detalhes do lead */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Lead - {selectedLead.name}</DialogTitle>
                <DialogDescription>
                  {selectedLead.company} | {selectedLead.position}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Email:</span> {selectedLead.email}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Telefone:</span> {selectedLead.phone}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Valor:</span> {formatCurrency(selectedLead.value)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Status Atual:</span> {getStatusLabel(selectedLead.status)}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Último Contato:</span> {selectedLead.lastContact ? new Date(selectedLead.lastContact).toLocaleDateString('pt-BR') : 'Não registrado'}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Próximo Acompanhamento:</span> {selectedLead.nextFollowUp ? new Date(selectedLead.nextFollowUp).toLocaleDateString('pt-BR') : 'Não agendado'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" /> 
                  Acompanhamento de Situação
                </h3>
                <div className="p-4 rounded-md bg-gray-50 border">
                  <div className="font-semibold mb-2">Histórico de Status:</div>
                  <div className="space-y-3">
                    {columns.map((column, index) => {
                      const isActive = selectedLead.status === column.id;
                      const isPast = columns.findIndex(c => c.id === selectedLead.status) > index;
                      
                      return (
                        <div 
                          key={column.id} 
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            isActive 
                              ? 'bg-blue-50 border border-blue-200' 
                              : isPast 
                                ? 'text-green-700' 
                                : 'text-gray-500'
                          }`}
                        >
                          <div className={`rounded-full p-1 ${
                            isActive 
                              ? 'bg-blue-100 text-blue-700' 
                              : isPast 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {column.icon}
                          </div>
                          <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                            {column.title}
                          </span>
                          {isActive && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Status Atual
                            </span>
                          )}
                          {isPast && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Concluído
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Notas:</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md border">
                  {selectedLead.notes}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
