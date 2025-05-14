
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download } from 'lucide-react';

const AuditLogs = () => {
  const [timeRange, setTimeRange] = useState('today');

  // Mock audit logs for demo
  const mockAuditLogs = [
    {
      id: '1',
      userId: '1',
      userName: 'System Admin',
      action: 'login',
      resource: 'auth',
      resourceId: '',
      orgId: 'system',
      timestamp: new Date().toISOString(),
      metadata: { ip: '192.168.1.1', userAgent: 'Chrome/98.0.4758.102' }
    },
    {
      id: '2',
      userId: '1',
      userName: 'System Admin',
      action: 'view',
      resource: 'organization',
      resourceId: 'salt-org',
      orgId: 'system',
      timestamp: new Date().toISOString(),
      metadata: { ip: '192.168.1.1', userAgent: 'Chrome/98.0.4758.102' }
    },
    {
      id: '3',
      userId: '2',
      userName: 'SALT Admin',
      action: 'create',
      resource: 'lead',
      resourceId: 'lead-123',
      orgId: 'salt-org',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: { leadName: 'Acme Corp', value: 10000 }
    },
    {
      id: '4',
      userId: '3',
      userName: 'GHF Admin',
      action: 'update',
      resource: 'user',
      resourceId: '5',
      orgId: 'ghf-org',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      metadata: { changedFields: ['name', 'email'] }
    },
    {
      id: '5',
      userId: '2',
      userName: 'SALT Admin',
      action: 'delete',
      resource: 'meeting',
      resourceId: 'meeting-456',
      orgId: 'salt-org',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      metadata: { meetingTitle: 'Client Onboarding', leadId: 'lead-789' }
    }
  ];

  // Get action badge class
  const getActionBadgeClass = (action: string) => {
    switch(action) {
      case 'create':
        return 'bg-green-900 text-green-200';
      case 'update':
        return 'bg-blue-900 text-blue-200';
      case 'delete':
        return 'bg-red-900 text-red-200';
      case 'login':
      case 'logout':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
          <Download size={16} />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search logs..."
            className="pl-9 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
            <Filter size={16} />
            More Filters
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="text-left p-4 font-medium">Time</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Action</th>
                <th className="text-left p-4 font-medium">Resource</th>
                <th className="text-left p-4 font-medium">Organization</th>
                <th className="text-left p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-700">
                  <td className="p-4">
                    <div className="text-sm">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{log.userName}</div>
                    <div className="text-xs text-gray-400">ID: {log.userId}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block rounded px-2 py-1 text-xs ${getActionBadgeClass(log.action)}`}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{log.resource}</div>
                    {log.resourceId && <div className="text-xs text-gray-400">ID: {log.resourceId}</div>}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {log.orgId === 'system' ? 'System' : log.orgId === 'salt-org' ? 'SALT' : 'GHF'}
                    </div>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-400">
          Showing 1-5 of 5 logs
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="border-gray-700 text-gray-500 hover:bg-gray-800">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="border-gray-700 text-gray-500 hover:bg-gray-800">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
