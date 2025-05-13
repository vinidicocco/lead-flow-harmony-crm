
import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { currentProfile } = useProfile();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    meetingReminders: true,
    leadAssignments: true,
    statusChanges: false,
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    compactView: false,
    showClosedDeals: true,
  });
  
  const [integrationSettings, setIntegrationSettings] = useState({
    enableAiAssistant: true,
    enableCalendarSync: true,
    enableEmailIntegration: false,
  });
  
  const handleSaveNotifications = () => {
    toast.success('Notification settings saved');
  };
  
  const handleSaveDisplay = () => {
    toast.success('Display settings saved');
  };
  
  const handleSaveIntegrations = () => {
    toast.success('Integration settings saved');
  };
  
  const handleResetSettings = () => {
    toast.info('Settings have been reset to defaults');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} Settings</h1>
        <p className="text-gray-500">Configure your CRM experience and preferences</p>
      </div>
      
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications from the CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Meeting Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders for upcoming meetings</p>
                  </div>
                  <Switch
                    checked={notificationSettings.meetingReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, meetingReminders: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Lead Assignments</h3>
                    <p className="text-sm text-gray-500">Notifications when new leads are assigned to you</p>
                  </div>
                  <Switch
                    checked={notificationSettings.leadAssignments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, leadAssignments: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Status Changes</h3>
                    <p className="text-sm text-gray-500">Be notified when lead status changes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.statusChanges}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, statusChanges: checked }))
                    }
                  />
                </div>
                
                <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize your CRM's appearance and layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500">Use dark theme for the CRM interface</p>
                  </div>
                  <Switch
                    checked={displaySettings.darkMode}
                    onCheckedChange={(checked) => 
                      setDisplaySettings(prev => ({ ...prev, darkMode: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compact View</h3>
                    <p className="text-sm text-gray-500">Display more information with less spacing</p>
                  </div>
                  <Switch
                    checked={displaySettings.compactView}
                    onCheckedChange={(checked) => 
                      setDisplaySettings(prev => ({ ...prev, compactView: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Closed Deals</h3>
                    <p className="text-sm text-gray-500">Display won and lost deals in lists and dashboard</p>
                  </div>
                  <Switch
                    checked={displaySettings.showClosedDeals}
                    onCheckedChange={(checked) => 
                      setDisplaySettings(prev => ({ ...prev, showClosedDeals: checked }))
                    }
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Kanban Stage Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>New Leads</Label>
                        <Input type="color" value="#38bdf8" />
                      </div>
                      <div>
                        <Label>Qualified Leads</Label>
                        <Input type="color" value="#facc15" />
                      </div>
                      <div>
                        <Label>Proposals</Label>
                        <Input type="color" value="#fb923c" />
                      </div>
                      <div>
                        <Label>Won Deals</Label>
                        <Input type="color" value="#4ade80" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveDisplay}>Save Display Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Connect your CRM to other tools and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">AI SDR Assistant</h3>
                    <p className="text-sm text-gray-500">Enable AI-powered SDR agent for follow-ups</p>
                  </div>
                  <Switch
                    checked={integrationSettings.enableAiAssistant}
                    onCheckedChange={(checked) => 
                      setIntegrationSettings(prev => ({ ...prev, enableAiAssistant: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Calendar Sync</h3>
                    <p className="text-sm text-gray-500">Sync meetings with your calendar application</p>
                  </div>
                  <Switch
                    checked={integrationSettings.enableCalendarSync}
                    onCheckedChange={(checked) => 
                      setIntegrationSettings(prev => ({ ...prev, enableCalendarSync: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Integration</h3>
                    <p className="text-sm text-gray-500">Connect your email account for automated tracking</p>
                  </div>
                  <Switch
                    checked={integrationSettings.enableEmailIntegration}
                    onCheckedChange={(checked) => 
                      setIntegrationSettings(prev => ({ ...prev, enableEmailIntegration: checked }))
                    }
                  />
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">API Integration</h3>
                  <p className="text-sm text-gray-500 mb-4">Access your CRM data programmatically</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Input value="api_key_12345..." readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="sm" onClick={() => toast.success('API key copied to clipboard')}>
                      Copy
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={() => toast.success('New API key generated')}>
                    Regenerate API Key
                  </Button>
                </div>
                
                <Button onClick={handleSaveIntegrations}>Save Integration Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input defaultValue={currentProfile === 'SALT' ? 'SALT User' : 'GHF User'} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue={currentProfile === 'SALT' ? 'salt@example.com' : 'ghf@example.com'} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input defaultValue="Sales Representative" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
                
                <hr />
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleResetSettings}>Reset All Settings</Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
