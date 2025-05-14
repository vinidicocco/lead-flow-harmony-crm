
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Settings, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/context/ProfileContext';

const AdminNavMenu = () => {
  const { currentProfile } = useProfile();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={20} />, label: 'CRM' },
    { to: '/leads', icon: <Users size={20} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={20} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={20} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={20} />, label: 'Gestão Agente IA' },
    { to: '/whatsapp', icon: <MessageCircle size={20} />, label: 'WhatsApp' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    <nav className="px-2 py-4">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? `${profileStyle} text-white font-medium`
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )
              }
              end={link.to === '/'}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNavMenu;
