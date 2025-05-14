
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog, MessageCircle, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';

const TopNavMenu = () => {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';
  
  const isMaster = user?.role === 'MASTER';
  const isAdminOrMaster = user?.role === 'MASTER' || user?.role === 'ADMIN';

  const links = [
    { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={16} />, label: 'CRM' },
    { to: '/leads', icon: <Users size={16} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={16} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={16} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={16} />, label: 'Agente IA' },
    { to: '/whatsapp', icon: <MessageCircle size={16} />, label: 'WhatsApp' },
  ];

  // Link para agente IA (se tiver permissão)
  if (isAdminOrMaster) {
    links.push({ to: '/agent-settings', icon: <Settings size={16} />, label: 'Config. IA' });
  }

  // Link para administração (apenas MASTER)
  if (isMaster) {
    links.push({ to: '/admin', icon: <Shield size={16} />, label: 'Admin' });
  }

  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList className="gap-0.5">
        {links.map((link) => (
          <NavigationMenuItem key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
                  isActive
                    ? `${profileStyle} text-white font-medium`
                    : "hover:bg-accent hover:text-accent-foreground"
                )
              }
              end={link.to === '/'}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </NavigationMenuItem>
        ))}
        {/* Settings Button - Icon Only */}
        <NavigationMenuItem>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs transition-colors",
                isActive
                  ? `${profileStyle} text-white font-medium`
                  : "hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Cog size={16} />
            <span className="sr-only">Configurações</span>
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavMenu;
