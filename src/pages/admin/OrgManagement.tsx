
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/context/ProfileContext';
import { Plus, Pencil, Trash, Save } from 'lucide-react';
import { toast } from 'sonner';

const OrgManagement = () => {
  const { organizations } = useProfile();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  
  const handleAddOrg = () => {
    setShowAddDialog(false);
    toast.success('New organization would be added here (demo only)');
  };

  const handleEditOrg = (orgId: string) => {
    setSelectedOrg(orgId);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    setShowEditDialog(false);
    toast.success('Organization updated successfully (demo only)');
  };

  const handleDeleteOrg = (orgId: string) => {
    toast.success('Organization would be deleted here (demo only)');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus size={16} />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input id="name" placeholder="Enter organization name" className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" placeholder="Enter logo URL" className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input id="primaryColor" type="text" placeholder="#000000" className="bg-gray-800 border-gray-700" />
                  <Input type="color" className="w-12 p-1 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" placeholder="admin@example.com" className="bg-gray-800 border-gray-700" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button onClick={handleAddOrg} className="bg-blue-600 hover:bg-blue-700">
                  Add Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {organizations.map((org) => (
          <Card key={org.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{org.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditOrg(org.id)} className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteOrg(org.id)} className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <Trash size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Organization ID</p>
                  <p className="text-sm">{org.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-sm">{new Date(org.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400">Logo</p>
                  <div className="mt-2 w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No Logo</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input 
                id="edit-name" 
                defaultValue={organizations.find(o => o.id === selectedOrg)?.name || ''}
                className="bg-gray-800 border-gray-700" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input 
                id="edit-logo" 
                defaultValue={organizations.find(o => o.id === selectedOrg)?.logo || ''}
                className="bg-gray-800 border-gray-700" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="edit-color" 
                  defaultValue={organizations.find(o => o.id === selectedOrg)?.primaryColor || '#000000'}
                  className="bg-gray-800 border-gray-700" 
                />
                <Input 
                  type="color" 
                  className="w-12 p-1 h-10"
                  defaultValue={organizations.find(o => o.id === selectedOrg)?.primaryColor || '#000000'}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgManagement;
