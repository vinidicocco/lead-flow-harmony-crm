
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockData';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const KanbanBoard = () => {
  const { currentProfile } = useProfile();
  const allLeads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  // States for the kanban board
  const [leads, setLeads] = useState<Lead[]>(allLeads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Define the profile-specific kanban columns
  const columns = useMemo(() => {
    if (currentProfile === 'SALT') {
      return [
        { id: 'new', title: 'Novo Lead' },
        { id: 'contacted', title: 'Contato Iniciado' },
        { id: 'qualified', title: 'Simulação Enviada' },
        { id: 'proposal', title: 'Aguardando Documentos' },
        { id: 'negotiation', title: 'Encaminhado à Administradora' },
        { id: 'won', title: 'Finalizado' }
      ];
    } else { // GHF
      return [
        { id: 'lost', title: 'Lead Cancelado' },
        { id: 'contacted', title: 'Contato Estabelecido' },
        { id: 'qualified', title: 'Análise do Contrato' },
        { id: 'negotiation', title: 'Negociação' },
        { id: 'proposal', title: 'Aguardando Pagamento' },
        { id: 'won', title: 'Finalizado' }
      ];
    }
  }, [currentProfile]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle drag start
  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
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

  // Filter leads by status
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Calculate totals for each column
  const calculateColumnTotal = (status: string) => {
    return getLeadsByStatus(status).reduce((total, lead) => total + lead.value, 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} CRM Kanban</h1>
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
              <h2 className="font-bold">{column.title}</h2>
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
                      ? 'border-l-salt' 
                      : 'border-l-ghf'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                >
                  <h3 className="font-medium">{lead.name}</h3>
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
    </div>
  );
};

export default KanbanBoard;
