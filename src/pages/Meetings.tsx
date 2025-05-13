
import React, { useMemo, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { getMeetingsByProfile } from '@/data/mockData';
import { Meeting } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const MeetingsPage = () => {
  const { currentProfile } = useProfile();
  const meetings = useMemo(() => getMeetingsByProfile(currentProfile), [currentProfile]);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'upcoming' | 'calendar'>('upcoming');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter meetings by selected date
  const filteredMeetings = useMemo(() => {
    if (!selectedDate) return meetings;
    
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.date === formattedSelectedDate);
  }, [meetings, selectedDate]);
  
  // Group upcoming meetings by date
  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return meetings
      .filter(meeting => new Date(meeting.date) >= today)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [meetings]);
  
  // Get dates with meetings for calendar highlighting
  const datesWithMeetings = useMemo(() => {
    return meetings.map(meeting => new Date(meeting.date));
  }, [meetings]);
  
  // Format meeting time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Handle add meeting
  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('This would add a new meeting (demo only)');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} Meetings</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>
      
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'upcoming' | 'calendar')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-6">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                      <div className="min-w-[80px] text-center p-2 border rounded-md">
                        <div className="text-sm font-medium">
                          {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">{formatTime(meeting.time)}</div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-gray-500">Lead: {meeting.leadName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {meeting.duration} minutes • Status: {meeting.status}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No upcoming meetings scheduled.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                  modifiersStyles={{
                    selected: {
                      backgroundColor: currentProfile === 'SALT' ? '#0891b2' : '#9333ea',
                      color: 'white'
                    }
                  }}
                  modifiers={{
                    hasMeeting: datesWithMeetings
                  }}
                  modifiersClassNames={{
                    hasMeeting: "bg-secondary"
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? `Meetings on ${selectedDate.toLocaleDateString()}`
                    : 'Select a date to view meetings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  filteredMeetings.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMeetings.map((meeting) => (
                        <div key={meeting.id} className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{meeting.title}</h3>
                            <span className="text-sm">
                              {formatTime(meeting.time)} - {formatTime(
                                (() => {
                                  const [hours, minutes] = meeting.time.split(':');
                                  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + meeting.duration;
                                  const newHours = Math.floor(totalMinutes / 60);
                                  const newMinutes = totalMinutes % 60;
                                  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
                                })()
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Lead: {meeting.leadName}</p>
                          <p className="text-sm mt-2">{meeting.notes}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No meetings scheduled for this date.</p>
                  )
                ) : (
                  <p className="text-center text-gray-500 py-8">Select a date from the calendar to view meetings.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Meeting Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddMeeting} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Meeting title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={30}
                  min={15}
                  step={15}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lead</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead1">John Smith</SelectItem>
                    <SelectItem value="lead2">Sarah Johnson</SelectItem>
                    <SelectItem value="lead3">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                placeholder="Meeting agenda and notes"
              ></textarea>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Meeting</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsPage;
