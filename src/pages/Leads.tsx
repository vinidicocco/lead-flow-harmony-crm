
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockDataWrapper';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

const LeadsPage = () => {
  const { currentProfile } = useProfile();
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  
  // Filtrar leads pela consulta de pesquisa
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leads, searchQuery]);
  
  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Manipular a abertura do diálogo para visualizar um lead
  const handleViewLead = (lead: Lead) => {
    setViewLead(lead);
  };
  
  // Fechar o diálogo de visualização
  const handleCloseViewDialog = () => {
    setViewLead(null);
  };
  
  // Mostrar diálogo de adição
  const handleShowAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  
  // Manipular o envio do formulário de adição de lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Isso adicionaria um novo lead (apenas demonstração)');
    setIsAddDialogOpen(false);
  };

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads {currentProfile}</h1>
        <Button onClick={handleShowAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Lead
        </Button>
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
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lead.status === 'qualified' || lead.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'proposal' || lead.status === 'contract'
                          ? 'bg-yellow-100 text-yellow-800'
                          : lead.status === 'payment' || lead.status === 'closed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {translateStatus(lead.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(lead.value)}
                    </TableCell>
                    <TableCell>
                      {new Date(lead.updatedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLead(lead)}>
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLeads.length === 0 && (
              <div className="text-center p-4">
                <p className="text-gray-500">Nenhum lead encontrado correspondente à sua busca.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Diálogo de Visualização de Lead */}
      <Dialog open={!!viewLead} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewLead?.name}</DialogTitle>
          </DialogHeader>
          
          {viewLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Empresa</div>
                  <div>{viewLead.company}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cargo</div>
                  <div>{viewLead.position}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{viewLead.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Telefone</div>
                  <div>{viewLead.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div>{translateStatus(viewLead.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Valor</div>
                  <div>{formatCurrency(viewLead.value)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Notas</div>
                  <div className="p-2 bg-gray-50 rounded-md mt-1">{viewLead.notes}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>Fechar</Button>
            <Button>Editar Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
};

export default LeadsPage;
