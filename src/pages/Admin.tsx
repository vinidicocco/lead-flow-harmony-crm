import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Organization, UserRole } from '@/types';
import { toast } from 'sonner';
import { Loader2, Check, X, RefreshCw, Edit, Shield, Building, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/context/ProfileContext';
import CreateUserForm from '@/components/admin/CreateUserForm';

const Admin = () => {
  const { user: currentUser } = useAuth();
  const { currentProfile } = useProfile();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para formulários
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Formulário de edição de usuário
  const [editUserFormData, setEditUserFormData] = useState({
    firstName: '',
    lastName: '',
    organizationId: '',
    role: '' as UserRole,
    is_active: true,
  });
  
  // Formulário de nova organização
  const [newOrgFormData, setNewOrgFormData] = useState({
    name: '',
    code: '',
  });
  
  // Carregar dados
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar organizações
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      
      if (orgsError) throw orgsError;
      
      // Converter dados recebidos para o tipo Organization
      const typedOrgs: Organization[] = orgs.map(org => ({
        id: org.id,
        name: org.name,
        code: org.code as any, // Cast to the Profile type
        created_at: org.created_at,
        updated_at: org.updated_at
      }));
      
      setOrganizations(typedOrgs);
      
      // Buscar usuários com organização
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations:organization_id (name, code)
        `)
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;
      
      // Cast each user to ensure role is of type UserRole
      const typedUsers: User[] = usersData.map(user => ({
        ...user,
        role: user.role as UserRole
      }));
      
      setUsers(typedUsers);
    } catch (error: any) {
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      const { firstName, lastName, organizationId, role, is_active } = editUserFormData;
      
      // Validar campos
      if (!firstName || !lastName || !organizationId || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          organization_id: organizationId,
          role,
          is_active
        })
        .eq('id', selectedUser.id);
      
      if (profileError) throw profileError;
      
      toast.success('Usuário atualizado com sucesso!');
      setEditUserDialog(false);
      setSelectedUser(null);
      
      // Atualizar lista de usuários
      fetchData();
    } catch (error: any) {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success(`Usuário ${isActive ? 'desativado' : 'ativado'} com sucesso!`);
      
      // Atualizar lista de usuários
      fetchData();
    } catch (error: any) {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  };
  
  // Funções para manipulação de organizações
  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { name, code } = newOrgFormData;
      
      // Validar campos
      if (!name || !code) {
        throw new Error('Nome e código são obrigatórios');
      }
      
      // Criar organização
      const { error } = await supabase
        .from('organizations')
        .insert({ name, code });
      
      if (error) throw error;
      
      toast.success('Organização criada com sucesso!');
      setNewOrgFormData({
        name: '',
        code: '',
      });
      
      // Buscar organizações e atualizar permissões
      const { data: newOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('code', code)
        .single();
        
      // Inserir permissões padrão
      if (newOrg?.id) {
        // ADMIN permissions
        const { data: adminPermissions } = await supabase
          .from('permissions')
          .select('id')
          .neq('code', 'system:admin');
          
        if (adminPermissions && adminPermissions.length > 0) {
          const adminRolePermissions = adminPermissions.map(p => ({
            organization_id: newOrg.id,
            role: 'ADMIN' as UserRole,
            permission_id: p.id
          }));
          
          await supabase
            .from('role_permissions')
            .insert(adminRolePermissions);
        }
          
        // USER permissions
        const { data: userPermissions } = await supabase
          .from('permissions')
          .select('id')
          .in('code', ['leads:read', 'meetings:read', 'ai_agent:read']);
          
        if (userPermissions && userPermissions.length > 0) {
          const userRolePermissions = userPermissions.map(p => ({
            organization_id: newOrg.id,
            role: 'USER' as UserRole,
            permission_id: p.id
          }));
          
          await supabase
            .from('role_permissions')
            .insert(userRolePermissions);
        }
          
        // Criar configuração do agente
        await supabase
          .from('agent_configs')
          .insert({
            organization_id: newOrg.id,
            name: 'Agente AI',
            welcome_message: `Olá, sou o assistente virtual da ${name}. Como posso ajudar você hoje?`
          });
      }
      
      // Atualizar lista de organizações
      fetchData();
    } catch (error: any) {
      toast.error(`Erro ao criar organização: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Preparar edição de usuário
  const prepareEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      organizationId: user.organization_id || '',
      role: user.role,
      is_active: user.is_active,
    });
    setEditUserDialog(true);
  };
  
  // Renderizar tabela de usuários
  const renderUsersTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Organização</th>
              <th className="py-3 px-4 text-left">Perfil</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Criado em</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{(user as any).organizations?.name || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'MASTER' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'ADMIN' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => prepareEditUser(user)}
                      title="Editar"
                    >
                      <Edit size={16} className="text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                      title={user.is_active ? 'Desativar' : 'Ativar'}
                      disabled={user.id === currentUser?.id} // Não pode desativar a si mesmo
                    >
                      {user.is_active ? (
                        <X size={16} className="text-red-500" />
                      ) : (
                        <Check size={16} className="text-green-500" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Renderizar tabela de organizações
  const renderOrganizationsTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Código</th>
              <th className="py-3 px-4 text-left">Criado em</th>
              <th className="py-3 px-4 text-center">Usuários</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{org.name}</td>
                <td className="py-3 px-4">{org.code}</td>
                <td className="py-3 px-4">
                  {new Date(org.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4 text-center">
                  {users.filter(u => u.organization_id === org.id).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Administração do Sistema</h1>
          <p className="text-gray-500 mt-1">
            Gerencie usuários, organizações e configurações
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={fetchData}
          >
            <RefreshCw size={16} />
            Atualizar
          </Button>
          
          <CreateUserForm 
            organizations={organizations}
            onSuccess={fetchData}
          />
        </div>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building size={16} />
            Organizações
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield size={16} />
            Permissões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Gerencie todos os usuários do sistema, independente da organiza��ão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUsersTable()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="organizations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Organizações</CardTitle>
                <CardDescription>
                  Gerencie as organizações que utilizam o sistema.
                </CardDescription>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Building size={16} />
                    Nova Organização
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Organização</DialogTitle>
                    <DialogDescription>
                      Crie uma nova organização no sistema.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateOrganization} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Nome</Label>
                      <Input 
                        id="orgName" 
                        value={newOrgFormData.name}
                        onChange={e => setNewOrgFormData({...newOrgFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="orgCode">Código</Label>
                      <Input 
                        id="orgCode" 
                        value={newOrgFormData.code}
                        onChange={e => setNewOrgFormData({...newOrgFormData, code: e.target.value})}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        O código será usado como identificador único para a organização.
                      </p>
                    </div>
                    
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          'Criar Organização'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderOrganizationsTable()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Permissões</CardTitle>
              <CardDescription>
                Gerencie as permissões dos papéis no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Permissões por Perfil</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    As permissões a seguir são configuradas automaticamente para cada perfil:
                  </p>
                  
                  <div className="space-y-6">
                    {/* MASTER */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                        <Shield size={16} />
                        MASTER
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Administradores com acesso total ao sistema, incluindo todas as organizações.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Acesso Total ao Sistema</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Usuários</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Organizações</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Permissões</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* ADMIN */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                        <Shield size={16} />
                        ADMIN
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Administradores de organização, com acesso total à sua organização.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Leads</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Reuniões</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Configurar Agente IA</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Gerenciar Usuários (da organização)</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <X size={16} className="text-red-600 mr-2" />
                          <span className="text-sm">Administração do Sistema</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* USER */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <Shield size={16} />
                        USER
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Usuários regulares, com acesso de visualização.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Visualizar Leads</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Visualizar Reuniões</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">Visualizar Agente IA</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <X size={16} className="text-red-600 mr-2" />
                          <span className="text-sm">Gerenciar Leads</span>
                        </div>
                        <div className="flex items-center border rounded-md p-2 bg-gray-50">
                          <X size={16} className="text-red-600 mr-2" />
                          <span className="text-sm">Gerenciar Usuários</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog para edição de usuário */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">Nome</Label>
                  <Input 
                    id="editFirstName" 
                    value={editUserFormData.firstName}
                    onChange={e => setEditUserFormData({...editUserFormData, firstName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Sobrenome</Label>
                  <Input 
                    id="editLastName" 
                    value={editUserFormData.lastName}
                    onChange={e => setEditUserFormData({...editUserFormData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editOrganization">Organização</Label>
                <Select 
                  value={editUserFormData.organizationId}
                  onValueChange={value => setEditUserFormData({...editUserFormData, organizationId: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma organização" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editRole">Perfil</Label>
                <Select 
                  value={editUserFormData.role}
                  onValueChange={value => setEditUserFormData({...editUserFormData, role: value as UserRole})}
                  required
                  disabled={selectedUser.id === currentUser?.id} // Não pode alterar seu próprio papel
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASTER">MASTER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="is-active"
                  checked={editUserFormData.is_active}
                  onCheckedChange={value => setEditUserFormData({...editUserFormData, is_active: value})}
                  disabled={selectedUser.id === currentUser?.id} // Não pode desativar a si mesmo
                />
                <Label htmlFor="is-active">Usuário ativo</Label>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditUserDialog(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
