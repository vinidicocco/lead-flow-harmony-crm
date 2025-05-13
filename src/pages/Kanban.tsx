
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockData';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, Phone, FileText, FileSignature, ArrowRight, Handshake } from 'lucide-react';

const KanbanBoard = () => {
  const { currentProfile } = useProfile();
  const allLeads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  // Estados para o quadro kanban
  const [leads, setLeads] = useState<Lead[]>(allLeads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

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

  // Filtrar leads por status
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Calcular totais para cada coluna
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
