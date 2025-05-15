import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockDataWrapper';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const Kanban = () => {
  const { currentProfile } = useProfile();
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Filtrar leads pela consulta de pesquisa
  const filteredLeads = useMemo(() => {
    let filtered = leads;
    
    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }
    
    return filtered;
  }, [leads, searchQuery, filterStatus]);
  
  // Agrupar leads por status para colunas Kanban
  const groupedLeads = useMemo(() => {
    const grouped: { [key: string]: Lead[] } = {};
    
    filteredLeads.forEach(lead => {
      if (!grouped[lead.status]) {
        grouped[lead.status] = [];
      }
      grouped[lead.status].push(lead);
    });
    
    return grouped;
  }, [filteredLeads]);
  
  // Tradução dos status
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'qualified': 'Lead Qualificado',
      'contact_attempt': 'Tentativa de Contato',
      'contacted': 'Contato Realizado',
      'proposal': 'Proposta',
      'contract': 'Ass. de Contrato',
      'payment': 'Transferência/Pagamento',
      'closed': 'Negócio Fechado'
    };
    return statusMap[status] || status;
  };
  
  // Lista de status para filtro
  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(leads.map(lead => lead.status))];
    return uniqueStatuses.map(status => ({
      value: status,
      label: translateStatus(status)
    }));
  }, [leads]);
  
  // Manipular o envio do formulário de adição de lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Isso adicionaria um novo lead (apenas demonstração)');
    setIsAddDialogOpen(false);
  };
  
  // Limpar filtros
  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus(null);
    setIsFilterDialogOpen(false);
  };
  
  // Componente para coluna Kanban
  const KanbanColumn = ({ status }: { status: string }) => {
    const { setNodeRef } = useDroppable({
      id: status,
    });
    
    return (
      <Card ref={setNodeRef} className="w-72 rounded-md border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{translateStatus(status)}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {groupedLeads[status]?.map(lead => (
              <KanbanCard key={lead.id} lead={lead} />
            ))}
            {(!groupedLeads[status] || groupedLeads[status].length === 0) && (
              <p className="text-center text-gray-500 py-4">Nenhum lead aqui</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Componente para cartão de lead
  const KanbanCard = ({ lead }: { lead: Lead }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: lead.id,
    });
    
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;
    
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-3 rounded-md border shadow-sm">
        <h4 className="font-medium">{lead.name}</h4>
        <p className="text-sm text-gray-500">{lead.company}</p>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CRM {currentProfile}</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Lead
          </Button>
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestão de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar leads..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto">
            {statusOptions.map(status => (
              <KanbanColumn key={status.value} status={status.value} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Diálogo de Adição de Lead */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddLead}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input placeholder="Digite o nome" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Empresa</label>
                <Input placeholder="Digite a empresa" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo</label>
                <Input placeholder="Digite o cargo" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Digite o email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input placeholder="Digite o número de telefone" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor</label>
                <Input type="number" placeholder="Digite o valor" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Notas</label>
                <Input placeholder="Digite notas" />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Filtro */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrar Leads</DialogTitle>
            <DialogDescription>
              Selecione os critérios de filtro
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button type="submit" onClick={() => setIsFilterDialogOpen(false)}>
              Aplicar Filtro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kanban;

