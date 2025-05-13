
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getLeadsByProfile } from '@/data/mockData';
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
  
  // Filter leads by search query
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leads, searchQuery]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Handle opening the dialog for viewing a lead
  const handleViewLead = (lead: Lead) => {
    setViewLead(lead);
  };
  
  // Close the view dialog
  const handleCloseViewDialog = () => {
    setViewLead(null);
  };
  
  // Show add dialog
  const handleShowAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  
  // Handle add lead form submission
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('This would add a new lead (demo only)');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} Leads</h1>
        <Button onClick={handleShowAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
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
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(lead.value)}
                    </TableCell>
                    <TableCell>
                      {new Date(lead.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLead(lead)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLeads.length === 0 && (
              <div className="text-center p-4">
                <p className="text-gray-500">No leads found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewLead?.name}</DialogTitle>
          </DialogHeader>
          
          {viewLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Company</div>
                  <div>{viewLead.company}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Position</div>
                  <div>{viewLead.position}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{viewLead.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div>{viewLead.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div>{viewLead.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Value</div>
                  <div>{formatCurrency(viewLead.value)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Notes</div>
                  <div className="p-2 bg-gray-50 rounded-md mt-1">{viewLead.notes}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>Close</Button>
            <Button>Edit Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddLead}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input placeholder="Enter company" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input placeholder="Enter position" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input type="number" placeholder="Enter value" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input placeholder="Enter notes" />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;
