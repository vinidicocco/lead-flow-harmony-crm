
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { useProfile } from '@/context/ProfileContext';

const TopNavMenu = () => {
  const { currentProfile } = useProfile();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';

  const links = [
    { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={16} />, label: 'CRM' },
    { to: '/leads', icon: <Users size={16} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={16} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={16} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={16} />, label: 'Gestão Agente IA' },
    { to: '/whatsapp', icon: <MessageCircle size={16} />, label: 'WhatsApp' },
  ];

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
