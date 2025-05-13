
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from '@/context/ProfileContext';
import { getStatsByProfile, getLeadsByProfile, getTasksByProfile } from '@/data/mockData';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const { currentProfile } = useProfile();
  const stats = useMemo(() => getStatsByProfile(currentProfile), [currentProfile]);
  const leads = useMemo(() => getLeadsByProfile(currentProfile), [currentProfile]);
  const tasks = useMemo(() => getTasksByProfile(currentProfile), [currentProfile]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart data
  const leadsByStatus = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count: statusCounts[status]
    }));
  }, [leads]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentProfile} Dashboard</h1>
        <p className="text-gray-500">Today: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue (Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</div>
            <p className="text-xs text-gray-500 mt-1">From {stats.wonDealsThisMonth} deals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">From lead to deal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeadsThisMonth}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStatus}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill={currentProfile === 'SALT' ? '#0891b2' : '#9333ea'} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status !== 'done')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description.slice(0, 50)}{task.description.length > 50 ? '...' : ''}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                    </div>
                  </div>
                ))
              }
              {tasks.filter(task => task.status !== 'done').length === 0 && (
                <p className="text-gray-500 text-center py-6">No pending tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Company</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Value</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map(lead => (
                      <tr key={lead.id} className="border-b">
                        <td className="py-3 px-4">{lead.name}</td>
                        <td className="py-3 px-4">{lead.company}</td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4 text-right">{formatCurrency(lead.value)}</td>
                        <td className="py-3 px-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
