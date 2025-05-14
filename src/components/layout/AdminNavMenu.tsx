
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Users, Database, Api, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminNavMenu = () => {
  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/organizations', icon: <Database size={20} />, label: 'Organizations' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/api', icon: <Api size={20} />, label: 'API Management' },
    { to: '/admin/audit-logs', icon: <Shield size={20} />, label: 'Audit Logs' },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              'flex items-center px-3 py-2 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )
          }
          end={link.to === '/admin'}
        >
          <span className="flex items-center gap-2">
            {link.icon}
            <span className="hidden md:inline">{link.label}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminNavMenu;
