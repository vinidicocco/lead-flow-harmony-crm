
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
  
  // Filter leads with follow-up dates
  const followUpLeads = useMemo(() => {
    return leads
      .filter(lead => lead.nextFollowUp && new Date(lead.nextFollowUp) >= new Date())
      .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime());
  }, [leads]);
  
  // Filter by search
  const filteredFollowUps = useMemo(() => {
    if (!searchQuery) return followUpLeads;
    
    return followUpLeads.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [followUpLeads, searchQuery]);
  
  // Format date relative to today (e.g., "Today", "Tomorrow", "In 3 days")
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (diffDays < 7) {
      return `In ${diffDays} days`;
    } else {
      return new Date(dateString).toLocaleDateString();
    }
  };
  
  // Handle lead selection
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };
  
  // Generate AI response
  const handleGenerateAI = () => {
    if (!selectedLead) return;
    setAiPrompt('');
    setIsAIDialogOpen(true);
  };
  
  // Submit AI prompt
  const handleSubmitAIPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI');
      return;
    }
    
    toast.success('AI SDR agent would generate content based on your prompt');
    toast.info('This is a demo feature - integration with a real AI agent would be implemented here');
    setIsAIDialogOpen(false);
  };
  
  // Mark as done
  const handleMarkAsDone = () => {
    if (!selectedLead) return;
    toast.success(`Follow-up with ${selectedLead.name} marked as complete`);
    setSelectedLead(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} Follow-Up</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Follow-Up
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Scheduled Follow-Ups</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search leads..."
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
                          formatRelativeDate(lead.nextFollowUp!) === 'Today'
                            ? 'bg-red-100 text-red-800'
                            : formatRelativeDate(lead.nextFollowUp!) === 'Tomorrow'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {formatRelativeDate(lead.nextFollowUp!)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{lead.company}</p>
                      {lead.lastContact && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last contact: {new Date(lead.lastContact).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No follow-ups scheduled.</p>
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
                        AI Assist
                      </Button>
                      <Button size="sm" onClick={handleMarkAsDone}>
                        Mark as Done
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedLead.company} • Follow-up: {new Date(selectedLead.nextFollowUp!).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Lead Details</TabsTrigger>
                      <TabsTrigger value="history">Contact History</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium">Email</div>
                            <div className="text-gray-700">{selectedLead.email}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Phone</div>
                            <div className="text-gray-700">{selectedLead.phone}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Position</div>
                            <div className="text-gray-700">{selectedLead.position}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Status</div>
                            <div className="text-gray-700 capitalize">{selectedLead.status}</div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-sm font-medium mb-2">Suggested Follow-up Actions</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span>Send a personalized email</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>Schedule a follow-up call</span>
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
                              {new Date(selectedLead.lastContact).toLocaleDateString()}
                            </div>
                            <p className="text-gray-700">
                              Initial discovery call with {selectedLead.name}. Discussed their current challenges and our potential solutions.
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No contact history available.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes">
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Add your notes about this lead here..." 
                          className="min-h-[200px]"
                          defaultValue={selectedLead.notes}
                        />
                        <Button className="w-full">Save Notes</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full py-20">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">Select a lead</h3>
                  <p className="text-gray-500 mt-1">Choose a lead from the list to view follow-up details.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* AI Assistant Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI SDR Assistant</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitAIPrompt} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What would you like the AI to help with?</label>
              <Textarea
                placeholder="E.g., Generate a follow-up email to ask about their interest in our enterprise solution..."
                className="min-h-[100px]"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="font-medium mb-2">AI will use these lead details:</p>
              <ul className="space-y-1 text-gray-600">
                <li>Name: {selectedLead?.name}</li>
                <li>Company: {selectedLead?.company}</li>
                <li>Position: {selectedLead?.position}</li>
                <li>Last Contact: {selectedLead?.lastContact ? new Date(selectedLead.lastContact).toLocaleDateString() : 'None'}</li>
                <li>Lead Status: {selectedLead?.status}</li>
              </ul>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAIDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpPage;
