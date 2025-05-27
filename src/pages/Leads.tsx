import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Lead, Profile } from '@/types';
import { useLeads } from '@/hooks/useFirebaseData';
import { leadsService } from '@/services/firebaseService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Leads = () => {
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'qualified' as Lead['status'],
    value: 0,
    notes: ''
  });
  const { leads, loading, error, refetch } = useLeads();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = async () => {
    if (!user?.organizationId) return;
    
    try {
      const leadData = {
        profile: user.profile as Profile,
        assignedTo: user.id,
        organizationId: user.organizationId,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        company: newLead.company,
        position: newLead.position,
        status: newLead.status,
        value: newLead.value,
        notes: newLead.notes
      };

      await leadsService.create(leadData);
      
      toast.success('Lead criado com sucesso!');
      setNewLead({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'qualified',
        value: 0,
        notes: ''
      });
      await refetch();
    } catch (error: any) {
      toast.error('Erro ao criar lead: ' + error.message);
    }
  };

  if (loading) {
    return <div>Carregando leads...</div>;
  }

  if (error) {
    return <div>Erro ao carregar leads: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Criar Novo Lead</CardTitle>
          <CardDescription>Adicione um novo lead ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input type="text" id="name" name="name" value={newLead.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={newLead.email} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input type="text" id="phone" name="phone" value={newLead.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input type="text" id="company" name="company" value={newLead.company} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input type="text" id="position" name="position" value={newLead.position} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" className="w-full px-3 py-2 border rounded-md" value={newLead.status} onChange={handleChange}>
                <option value="qualified">Qualificado</option>
                <option value="contact_attempt">Tentativa de Contato</option>
                <option value="contacted">Contactado</option>
                <option value="proposal">Proposta</option>
                <option value="contract">Contrato</option>
                <option value="payment">Pagamento</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input type="number" id="value" name="value" value={newLead.value} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Input type="text" id="notes" name="notes" value={newLead.notes} onChange={handleChange} />
            </div>
          </div>
          <Button onClick={handleCreateLead}>Criar Lead</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>Todos os leads cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
