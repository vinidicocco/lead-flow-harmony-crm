
import React, { useMemo } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { 
  getLeadsByProfile, 
  getMeetingsByProfile,
  getTasksByProfile,
  getStatsByProfile
} from '@/data/mockData';
import StatsCards from '@/components/dashboard/StatsCards';
import SalesFunnelChart from '@/components/dashboard/SalesFunnelChart';
import LeadsDistributionChart from '@/components/dashboard/LeadsDistributionChart';
import RecentLeads from '@/components/dashboard/RecentLeads';
import TasksPriorityChart from '@/components/dashboard/TasksPriorityChart';
import { 
  calculateValueByStatus, 
  calculateLeadsByStatus,
  calculateTasksByPriority,
  formatDate,
  translateStatus,
  getRecentLeads,
  getUpcomingMeetings
} from '@/components/dashboard/dashboardUtils';

const Dashboard = () => {
  const { currentProfile, getProfileForDataFunctions } = useProfile() as any;
  const leads = useMemo(() => getLeadsByProfile(getProfileForDataFunctions(currentProfile)) || [], [currentProfile]);
  const meetings = useMemo(() => getMeetingsByProfile(getProfileForDataFunctions(currentProfile)) || [], [currentProfile]);
  const tasks = useMemo(() => getTasksByProfile(getProfileForDataFunctions(currentProfile)) || [], [currentProfile]);
  
  // Add a default empty stats object to prevent undefined errors
  const stats = useMemo(() => {
    const fetchedStats = getStatsByProfile(getProfileForDataFunctions(currentProfile));
    return fetchedStats || {
      totalLeads: 0,
      newLeadsThisMonth: 0,
      wonDealsThisMonth: 0,
      revenueThisMonth: 0,
      conversionRate: 0,
      averageDealSize: 0
    };
  }, [currentProfile]);
  
  // Compute data for charts
  const valueByStatus = useMemo(() => calculateValueByStatus(leads), [leads]);
  const leadsByStatus = useMemo(() => calculateLeadsByStatus(leads), [leads]);
  const tasksByPriority = useMemo(() => calculateTasksByPriority(tasks), [tasks]);
  const recentLeads = useMemo(() => getRecentLeads(leads, 5), [leads]);
  const upcomingMeetings = useMemo(() => getUpcomingMeetings(meetings, 3), [meetings]);
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Determine profile color for charts
  const getProfileColor = () => {
    switch(currentProfile) {
      case 'SALT':
        return '#8884d8';
      case 'GHF':
        return '#82ca9d';
      case 'NEOIN':
        return '#0EA5E9';
      default:
        return '#0EA5E9';
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard {currentProfile}</h1>
      
      {/* Stats Cards */}
      <StatsCards 
        stats={stats} 
        upcomingMeetings={upcomingMeetings} 
        formatDate={formatDate} 
      />
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalesFunnelChart data={valueByStatus} profileColor={getProfileColor()} />
        <LeadsDistributionChart data={leadsByStatus} colors={COLORS} />
      </div>
      
      {/* Leads and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentLeads 
          leads={recentLeads} 
          formatDate={formatDate} 
          translateStatus={translateStatus} 
        />
        <TasksPriorityChart tasksByPriority={tasksByPriority} />
      </div>
    </div>
  );
};

export default Dashboard;
