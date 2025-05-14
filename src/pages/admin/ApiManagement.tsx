
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Key } from 'lucide-react';
import { toast } from 'sonner';

const ApiManagement = () => {
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);
  const [showCreateWebhookDialog, setShowCreateWebhookDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('keys');
  
  // Mock API keys for demo
  const mockApiKeys = [
    {
      id: 'key1',
      name: 'Example API Key 1',
      key: 'sk_test_12345678901234567890',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      permissions: ['read:leads', 'write:leads', 'read:users']
    }
  ];
  
  // Mock API webhook endpoints for demo
  const mockWebhooks = [
    {
      id: 'wh1',
      name: 'Lead Created Webhook',
      url: 'https://example.com/webhook/leads',
      event: 'lead.created',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastTriggered: new Date().toISOString()
    }
  ];

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleCreateApiKey = () => {
    setShowCreateKeyDialog(false);
    toast.success('New API key would be created here (demo only)');
  };

  const handleCreateWebhook = () => {
    setShowCreateWebhookDialog(false);
    toast.success('New webhook would be created here (demo only)');
  };

  const handleRevokeApiKey = (keyId: string) => {
    toast.success(`API key would be revoked here (demo only)`);
  };

  const handleDeleteWebhook = (webhookId: string) => {
    toast.success(`Webhook would be deleted here (demo only)`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-800">
          <TabsTrigger value="keys" className="data-[state=active]:bg-gray-700">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-gray-700">Webhooks</TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-gray-700">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-medium">API Keys</h2>
            <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} />
                  Create New API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">API Key Name</Label>
                    <Input id="key-name" placeholder="Enter a name for this API key" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="salt-org">SALT</SelectItem>
                        <SelectItem value="ghf-org">GHF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="read-leads" />
                        <Label htmlFor="read-leads">Read Leads</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="write-leads" />
                        <Label htmlFor="write-leads">Write Leads</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="read-users" />
                        <Label htmlFor="read-users">Read Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="write-users" />
                        <Label htmlFor="write-users">Write Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="read-meetings" />
                        <Label htmlFor="read-meetings">Read Meetings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="write-meetings" />
                        <Label htmlFor="write-meetings">Write Meetings</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowCreateKeyDialog(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateApiKey} className="bg-blue-600 hover:bg-blue-700">
                      Create API Key
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {mockApiKeys.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8 flex flex-col items-center justify-center">
              <Key size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No API Keys</h3>
              <p className="text-gray-400 text-center mb-4">You haven't created any API keys yet.</p>
              <Button 
                onClick={() => setShowCreateKeyDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create your first API key
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockApiKeys.map(apiKey => (
                <Card key={apiKey.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">{apiKey.name}</CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeApiKey(apiKey.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">API Key</p>
                        <div className="flex items-center bg-gray-900 p-3 rounded-md">
                          <div className="font-mono text-sm overflow-hidden text-ellipsis mr-3 flex-1">
                            {apiKey.key.substring(0, 8)}••••••••••••{apiKey.key.substring(apiKey.key.length - 4)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyApiKey(apiKey.key)}
                            className="text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created</p>
                          <p className="text-sm">{new Date(apiKey.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Last Used</p>
                          <p className="text-sm">{new Date(apiKey.lastUsed).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Permissions</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.permissions.map(permission => (
                              <span 
                                key={permission} 
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="webhooks">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-medium">Webhook Endpoints</h2>
            <Dialog open={showCreateWebhookDialog} onOpenChange={setShowCreateWebhookDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Add Webhook Endpoint</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-name">Name</Label>
                    <Input id="webhook-name" placeholder="Enter webhook name" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL</Label>
                    <Input id="webhook-url" placeholder="https://example.com/webhook" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="lead.created">Lead Created</SelectItem>
                        <SelectItem value="lead.updated">Lead Updated</SelectItem>
                        <SelectItem value="meeting.scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="task.completed">Task Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="salt-org">SALT</SelectItem>
                        <SelectItem value="ghf-org">GHF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="active" defaultChecked />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowCreateWebhookDialog(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWebhook} className="bg-blue-600 hover:bg-blue-700">
                      Create Webhook
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {mockWebhooks.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 p-8 flex flex-col items-center justify-center">
              <div className="mb-4 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <Key size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Webhooks</h3>
              <p className="text-gray-400 text-center mb-4">You haven't set up any webhooks yet.</p>
              <Button 
                onClick={() => setShowCreateWebhookDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add your first webhook
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockWebhooks.map(webhook => (
                <Card key={webhook.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">{webhook.name}</CardTitle>
                        <p className="text-sm text-gray-400">{webhook.event}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          Test
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">URL</p>
                        <div className="font-mono text-sm bg-gray-900 p-3 rounded-md break-all">
                          {webhook.url}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Status</p>
                          <div className={`inline-flex items-center gap-1.5 ${webhook.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${webhook.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span>{webhook.status === 'active' ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created</p>
                          <p className="text-sm">{new Date(webhook.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Last Triggered</p>
                          <p className="text-sm">{new Date(webhook.lastTriggered).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="docs">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Introduction</h3>
                <p>
                  Our API allows you to programmatically access and manage your CRM data.
                  You can create, read, update, and delete leads, meetings, tasks, and more.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Base URL</h3>
                <div className="font-mono text-sm bg-gray-900 p-3 rounded-md">
                  https://api.example.com/v1
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Authentication</h3>
                <p className="mb-2">
                  All API requests require authentication using an API key.
                  Include your API key in the Authorization header:
                </p>
                <div className="font-mono text-sm bg-gray-900 p-3 rounded-md">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Endpoints</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium">Leads</h4>
                    <div className="space-y-2 mt-2">
                      <div>
                        <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded mr-2">GET</span>
                        <code className="font-mono text-sm">/leads</code>
                        <p className="text-sm text-gray-400 mt-1">List all leads</p>
                      </div>
                      <div>
                        <span className="inline-block bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded mr-2">POST</span>
                        <code className="font-mono text-sm">/leads</code>
                        <p className="text-sm text-gray-400 mt-1">Create a new lead</p>
                      </div>
                      <div>
                        <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded mr-2">GET</span>
                        <code className="font-mono text-sm">/leads/:id</code>
                        <p className="text-sm text-gray-400 mt-1">Get a specific lead</p>
                      </div>
                      <div>
                        <span className="inline-block bg-yellow-900 text-yellow-200 text-xs px-2 py-0.5 rounded mr-2">PUT</span>
                        <code className="font-mono text-sm">/leads/:id</code>
                        <p className="text-sm text-gray-400 mt-1">Update a lead</p>
                      </div>
                      <div>
                        <span className="inline-block bg-red-900 text-red-200 text-xs px-2 py-0.5 rounded mr-2">DELETE</span>
                        <code className="font-mono text-sm">/leads/:id</code>
                        <p className="text-sm text-gray-400 mt-1">Delete a lead</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium">Meetings</h4>
                    <div className="space-y-2 mt-2">
                      <div>
                        <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded mr-2">GET</span>
                        <code className="font-mono text-sm">/meetings</code>
                        <p className="text-sm text-gray-400 mt-1">List all meetings</p>
                      </div>
                      <div>
                        <span className="inline-block bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded mr-2">POST</span>
                        <code className="font-mono text-sm">/meetings</code>
                        <p className="text-sm text-gray-400 mt-1">Create a new meeting</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium">Users</h4>
                    <div className="space-y-2 mt-2">
                      <div>
                        <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded mr-2">GET</span>
                        <code className="font-mono text-sm">/users</code>
                        <p className="text-sm text-gray-400 mt-1">List all users</p>
                      </div>
                      <div>
                        <span className="inline-block bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded mr-2">POST</span>
                        <code className="font-mono text-sm">/users</code>
                        <p className="text-sm text-gray-400 mt-1">Create a new user</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Download Full API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiManagement;
