
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockData';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, MessageSquare, Calendar, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const FollowUpPage = () => {
  const { currentProfile } = useProfile();
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Filtrar leads com datas de acompanhamento
  const followUpLeads = useMemo(() => {
    return leads
      .filter(lead => lead.nextFollowUp && new Date(lead.nextFollowUp) >= new Date())
      .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime());
  }, [leads]);
  
  // Filtrar por busca
  const filteredFollowUps = useMemo(() => {
    if (!searchQuery) return followUpLeads;
    
    return followUpLeads.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [followUpLeads, searchQuery]);
  
  // Formatar data relativa a hoje (ex.: "Hoje", "Amanhã", "Em 3 dias")
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else if (diffDays < 7) {
      return `Em ${diffDays} dias`;
    } else {
      return new Date(dateString).toLocaleDateString('pt-BR');
    }
  };
  
  // Manipular seleção de lead
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };
  
  // Gerar resposta de IA
  const handleGenerateAI = () => {
    if (!selectedLead) return;
    setAiPrompt('');
    setIsAIDialogOpen(true);
  };
  
  // Enviar prompt de IA
  const handleSubmitAIPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) {
      toast.error('Por favor, insira um prompt para a IA');
      return;
    }
    
    toast.success('O agente SDR de IA geraria conteúdo baseado no seu prompt');
    toast.info('Este é um recurso de demonstração - a integração com um agente de IA real seria implementada aqui');
    setIsAIDialogOpen(false);
  };
  
  // Marcar como concluído
  const handleMarkAsDone = () => {
    if (!selectedLead) return;
    toast.success(`Acompanhamento com ${selectedLead.name} marcado como concluído`);
    setSelectedLead(null);
  };

  // Traduzir status
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
        <h1 className="text-3xl font-bold">Acompanhamento {currentProfile}</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Acompanhamento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Acompanhamentos Agendados</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFollowUps.length > 0 ? (
                <div className="space-y-3">
                  {filteredFollowUps.map((lead) => (
                    <div
                      key={lead.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id 
                          ? currentProfile === 'SALT' 
                            ? 'border-salt bg-salt/5' 
                            : 'border-ghf bg-ghf/5'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectLead(lead)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{lead.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          formatRelativeDate(lead.nextFollowUp!) === 'Hoje'
                            ? 'bg-red-100 text-red-800'
                            : formatRelativeDate(lead.nextFollowUp!) === 'Amanhã'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {formatRelativeDate(lead.nextFollowUp!)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{lead.company}</p>
                      {lead.lastContact && (
                        <p className="text-xs text-gray-500 mt-1">
                          Último contato: {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum acompanhamento agendado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedLead ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedLead.name}</CardTitle>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={handleGenerateAI}
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Assistente IA
                      </Button>
                      <Button size="sm" onClick={handleMarkAsDone}>
                        Marcar como Concluído
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedLead.company} • Acompanhamento: {new Date(selectedLead.nextFollowUp!).toLocaleDateString('pt-BR')}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Detalhes do Lead</TabsTrigger>
                      <TabsTrigger value="history">Histórico de Contatos</TabsTrigger>
                      <TabsTrigger value="notes">Notas</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium">Email</div>
                            <div className="text-gray-700">{selectedLead.email}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Telefone</div>
                            <div className="text-gray-700">{selectedLead.phone}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Cargo</div>
                            <div className="text-gray-700">{selectedLead.position}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Status</div>
                            <div className="text-gray-700 capitalize">{translateStatus(selectedLead.status)}</div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-sm font-medium mb-2">Ações de Acompanhamento Sugeridas</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span>Enviar um email personalizado</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>Agendar uma ligação de acompanhamento</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div className="space-y-4">
                        {selectedLead.lastContact ? (
                          <div className="border-l-2 border-gray-200 pl-4 ml-4 relative">
                            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                            <div className="text-sm font-medium">
                              {new Date(selectedLead.lastContact).toLocaleDateString('pt-BR')}
                            </div>
                            <p className="text-gray-700">
                              Ligação inicial com {selectedLead.name}. Discutimos os desafios atuais e nossas potenciais soluções.
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Nenhum histórico de contato disponível.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes">
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Adicione suas anotações sobre este lead aqui..." 
                          className="min-h-[200px]"
                          defaultValue={selectedLead.notes}
                        />
                        <Button className="w-full">Salvar Notas</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full py-20">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">Selecione um lead</h3>
                  <p className="text-gray-500 mt-1">Escolha um lead da lista para ver detalhes do acompanhamento.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Diálogo do Assistente de IA */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assistente IA SDR</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitAIPrompt} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Com o que você gostaria que a IA ajudasse?</label>
              <Textarea
                placeholder="Ex.: Gerar um email de acompanhamento para perguntar sobre o interesse deles em nossa solução..."
                className="min-h-[100px]"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="font-medium mb-2">A IA usará estes detalhes do lead:</p>
              <ul className="space-y-1 text-gray-600">
                <li>Nome: {selectedLead?.name}</li>
                <li>Empresa: {selectedLead?.company}</li>
                <li>Cargo: {selectedLead?.position}</li>
                <li>Último Contato: {selectedLead?.lastContact ? new Date(selectedLead.lastContact).toLocaleDateString('pt-BR') : 'Nenhum'}</li>
                <li>Status do Lead: {selectedLead ? translateStatus(selectedLead.status) : ''}</li>
              </ul>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAIDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Gerar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpPage;
