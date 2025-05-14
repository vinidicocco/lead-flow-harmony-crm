import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMeetingsByProfile } from '@/data/mockData';
import { Meeting } from '@/types';
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const Meetings = () => {
  const { currentProfile, getProfileForDataFunctions } = useProfile() as any;
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    const meetings = getMeetingsByProfile(getProfileForDataFunctions(currentProfile));
    
    // Assume the date already includes the time in timestamp format
    const today = new Date();
    const upcoming = meetings.filter(m => new Date(m.date) > today);
    const past = meetings.filter(m => new Date(m.date) <= today);
    
    setUpcomingMeetings(upcoming);
    setPastMeetings(past);
  };

  useEffect(() => {
    fetchData();
  }, [currentProfile]);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const formatDateTime = (dateString: string) => {
    // Supposing dateString already be an ISO complete timestamp with date and time
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderMeetingCard = (meeting: Meeting) => (
    <Card key={meeting.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{meeting.title}</CardTitle>
            <CardDescription>
              {meeting.lead_name || "Sem lead associado"}
            </CardDescription>
          </div>
          {/*<MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground" />*/}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Data: {formatDate(meeting.date)}
        </p>
      </CardContent>
    </Card>
  );

  const renderMeetingDialog = () => {
    if (!selectedMeeting) return null;
    
    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedMeeting.title}</DialogTitle>
          <DialogDescription className="text-base pt-1">
            {formatDateTime(selectedMeeting.date)}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col space-y-4">
            <div>
              <p className="text-sm text-gray-500">Lead</p>
              <p className="font-medium">{selectedMeeting.lead_name || "Sem lead associado"}</p>
            </div>
            {selectedMeeting.notes && (
              <div>
                <p className="text-sm text-gray-500">Anotações</p>
                <p className="font-medium">{selectedMeeting.notes}</p>
              </div>
            )}
          </div>
        </div>
        {/*<DialogFooter>
          <Button>Salvar</Button>
        </DialogFooter>*/}
      </DialogContent>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Reuniões</h1>

      {/* Upcoming Meetings */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Próximas Reuniões</h2>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agendar Reunião</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMeetings.map(meeting => (
            <div key={meeting.id} onClick={() => handleMeetingClick(meeting)}>
              {renderMeetingCard(meeting)}
            </div>
          ))}
        </div>
      </section>

      {/* Past Meetings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Reuniões Anteriores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastMeetings.map(meeting => (
            <div key={meeting.id} onClick={() => handleMeetingClick(meeting)}>
              {renderMeetingCard(meeting)}
            </div>
          ))}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        {renderMeetingDialog()}
      </Dialog>
    </div>
  );
};

export default Meetings;
