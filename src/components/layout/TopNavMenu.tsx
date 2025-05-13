
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useProfile } from '@/context/ProfileContext';

const TopNavMenu = () => {
  const { currentProfile } = useProfile();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';

  const links = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={18} />, label: 'Kanban' },
    { to: '/leads', icon: <Users size={18} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={18} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={18} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={18} />, label: 'Agente IA' },
    { to: '/settings', icon: <Cog size={18} />, label: 'Configurações' },
  ];

  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors",
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavMenu;
