
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavMenu = () => {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={20} />, label: 'Kanban' },
    { to: '/leads', icon: <Users size={20} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={20} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={20} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={20} />, label: 'Gestão Agente IA' },
    { to: '/settings', icon: <Cog size={20} />, label: 'Configurações' },
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
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
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

export default NavMenu;
