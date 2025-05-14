import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';

const AgentManagement = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      role: 'Atendente',
      status: 'Ativo',
      skills: ['Vendas', 'Suporte ao Cliente'],
      avatar: 'https://github.com/shadcn.png',
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      role: 'Supervisor',
      status: 'Inativo',
      skills: ['Gestão', 'Qualidade'],
      avatar: 'https://avatars.githubusercontent.com/u/10407377?v=4',
    },
  ]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    role: 'Atendente',
    status: 'Ativo',
    skills: '',
    avatar: '',
  });
  const [editAgentId, setEditAgentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      // Replace '/login' with your actual login route
      window.location.href = '/login';
    }
  }, [user]);

  if (!user || !(user.role === 'org_admin' || user.role === 'super_admin')) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Acesso Negado</h1>
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  const handleAddAgent = () => {
    const newId = String(agents.length + 1);
    const skillsArray = newAgent.skills.split(',').map((skill) => skill.trim());
    const agentToAdd = { ...newAgent, id: newId, skills: skillsArray };
    setAgents([...agents, agentToAdd]);
    setNewAgent({
      name: '',
      email: '',
      role: 'Atendente',
      status: 'Ativo',
      skills: '',
      avatar: '',
    });
    toast.success('Agente adicionado com sucesso!');
  };

  const handleEditAgent = (id) => {
    setEditAgentId(id);
    const agentToEdit = agents.find((agent) => agent.id === id);
    if (agentToEdit) {
      setNewAgent({
        name: agentToEdit.name,
        email: agentToEdit.email,
        role: agentToEdit.role,
        status: agentToEdit.status,
        skills: agentToEdit.skills.join(', '),
        avatar: agentToEdit.avatar || '',
      });
    }
  };

  const handleUpdateAgent = () => {
    const skillsArray = newAgent.skills.split(',').map((skill) => skill.trim());
    const updatedAgents = agents.map((agent) =>
      agent.id === editAgentId ? { ...newAgent, id: editAgentId, skills: skillsArray } : agent
    );
    setAgents(updatedAgents);
    setEditAgentId(null);
    setNewAgent({
      name: '',
      email: '',
      role: 'Atendente',
      status: 'Ativo',
      skills: '',
      avatar: '',
    });
    toast.success('Agente atualizado com sucesso!');
  };

  const handleDeleteAgent = (id) => {
    const updatedAgents = agents.filter((agent) => agent.id !== id);
    setAgents(updatedAgents);
    toast.success('Agente excluído com sucesso!');
  };

  const filteredAgents = agents.filter((agent) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(agent.name) ||
      searchRegex.test(agent.email) ||
      searchRegex.test(agent.role) ||
      searchRegex.test(agent.status) ||
      agent.skills.some((skill) => searchRegex.test(skill))
    );
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    return null;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gerenciamento de Agentes de IA</h1>
      <p className="text-gray-500 mb-6">
        Gerencie e configure seus agentes de IA para otimizar o atendimento e suporte.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Agente</CardTitle>
            <CardDescription>
              Preencha os detalhes do novo agente para adicionar ao sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newAgent.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={newAgent.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select value={newAgent.role} onValueChange={(value) => handleInputChange({ target: { name: 'role', value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atendente">Atendente</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newAgent.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={newAgent.skills}
                  onChange={handleInputChange}
                  placeholder="Vendas, Suporte, Atendimento"
                />
              </div>
              <div>
                <Label htmlFor="avatar">URL do Avatar</Label>
                <Input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={newAgent.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              {editAgentId ? (
                <Button onClick={handleUpdateAgent}>Atualizar Agente</Button>
              ) : (
                <Button onClick={handleAddAgent}>Adicionar Agente</Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Agente</CardTitle>
            <CardDescription>
              Encontre agentes por nome, email, função ou habilidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="search">Termo de Busca</Label>
              <Input
                type="text"
                id="search"
                placeholder="Digite o termo de busca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Agentes</CardTitle>
          <CardDescription>
            Visualize e gerencie os agentes de IA existentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Nome {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    Email {getSortIcon('email')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    Função {getSortIcon('role')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <Avatar>
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>{agent.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAgent(agent.id)}
                        className="mr-2"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentManagement;
