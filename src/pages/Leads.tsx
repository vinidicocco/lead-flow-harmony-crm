import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { Lead } from '@/types';
import { getLeadsByProfile } from '@/data/mockData';
import { useProfile } from '@/context/ProfileContext';
import { Calendar } from 'lucide-react';

const Leads = () => {
  const { currentProfile, getProfileForDataFunctions } = useProfile() as any;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterValue, setFilterValue] = useState<number | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setLeads(getLeadsByProfile(getProfileForDataFunctions(currentProfile)));
    }
  }, [currentProfile]);

  const sortedLeads = useMemo(() => {
    if (!leads) return [];
    let result = [...leads];
    
    // Aplicar ordenação
    result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Aplicar filtro de pesquisa
    if (searchTerm) {
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (filterStatus && filterStatus !== '') {
      result = result.filter(lead => lead.status === filterStatus);
    }

    // Aplicar filtro de valor
    if (filterValue !== null) {
      result = result.filter(lead => lead.value >= filterValue);
    }

    return result;
  }, [leads, sortOrder, searchTerm, filterStatus, filterValue]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      {/* Filters and Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Pesquisar por nome ou empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="contact_attempt">Tentativa de contato</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="proposal">Proposta</SelectItem>
            <SelectItem value="contract">Contrato</SelectItem>
            <SelectItem value="payment">Pagamento</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <Label htmlFor="valueFilter">Valor mínimo</Label>
          <Input
            type="number"
            id="valueFilter"
            placeholder="Valor mínimo"
            value={filterValue === null ? '' : filterValue.toString()}
            onChange={(e) => setFilterValue(e.target.value ? parseInt(e.target.value, 10) : null)}
          />
        </div>

        <Select onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Mais antigos</SelectItem>
            <SelectItem value="desc">Mais recentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Table>
        <TableCaption>Lista de leads.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.value}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(lead.updated_at)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right">
              Total de leads: {sortedLeads.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Leads;
