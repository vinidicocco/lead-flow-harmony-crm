
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';

const UserManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { organizations } = useProfile();
  
  // Mock users (in a real app, this would come from context/API)
  const mockUsers = [
    {
      id: '1',
      name: 'System Admin',
      email: 'admin@system.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'super_admin',
      orgId: '0',
      isActive: true,
      lastLogin: new Date().toISOString()
    },
    {
      id: '2',
      name: 'SALT Admin',
      email: 'salt@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salt',
      role: 'org_admin',
      orgId: 'salt-org',
      isActive: true,
      lastLogin: new Date().toISOString()
    },
    {
      id: '3',
      name: 'GHF Admin',
      email: 'ghf@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghf',
      role: 'org_admin',
      orgId: 'ghf-org',
      isActive: true,
      lastLogin: new Date().toISOString()
    },
    {
      id: '4',
      name: 'SALT User',
      email: 'saltuser@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saltuser',
      role: 'org_user',
      orgId: 'salt-org',
      isActive: true,
      lastLogin: new Date().toISOString()
    },
    {
      id: '5',
      name: 'GHF User',
      email: 'ghfuser@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghfuser',
      role: 'org_user',
      orgId: 'ghf-org',
      isActive: true,
      lastLogin: new Date().toISOString()
    }
  ];

  const handleAddUser = () => {
    setShowAddDialog(false);
    toast.success('New user would be created here (demo only)');
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    toast.success(`User status would be updated to ${currentStatus ? 'inactive' : 'active'} (demo only)`);
  };

  const getOrgName = (orgId: string) => {
    return organizations.find(org => org.id === orgId)?.name || 'System';
  };

  const getRoleBadgeClass = (role: string) => {
    switch(role) {
      case 'super_admin':
        return 'bg-red-900 text-red-100';
      case 'org_admin':
        return 'bg-blue-900 text-blue-100';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'super_admin':
        return 'Super Admin';
      case 'org_admin':
        return 'Org Admin';
      default:
        return 'User';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-9 w-72 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus size={16} />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter full name" className="bg-gray-800 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="user@example.com" className="bg-gray-800 border-gray-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="org_admin">Organization Admin</SelectItem>
                      <SelectItem value="org_user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input id="password" type="password" placeholder="Enter temporary password" className="bg-gray-800 border-gray-700" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Organization</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Last Login</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-700">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-gray-900">
                            <User size={16} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>{getOrgName(user.orgId)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${getRoleBadgeClass(user.role)}`}>
                      {user.role === 'super_admin' && <ShieldCheck size={12} className="mr-1" />}
                      {getRoleLabel(user.role)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1.5 ${user.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{new Date(user.lastLogin).toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success('Edit user (demo only)')}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={`${user.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} hover:bg-gray-700`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
