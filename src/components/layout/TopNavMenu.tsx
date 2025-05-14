
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog, WhatsApp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TopNavMenu = () => {
  const { currentProfile } = useProfile();
  const { toast } = useToast();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';

  const links = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={18} />, label: 'CRM' },
    { to: '/leads', icon: <Users size={18} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={18} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={18} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={18} />, label: 'Gestão Agente IA' },
  ];

  const handleWhatsAppClick = () => {
    toast({
      title: "WhatsApp Web",
      description: "Iniciando conexão com WhatsApp da empresa...",
    });
    // In a real implementation, this would integrate with WhatsApp Web API
    // or open WhatsApp Web in a new window/iframe
    window.open("https://web.whatsapp.com", "_blank");
  };

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
        {/* WhatsApp Button */}
        {links.some(link => link.to === '/ai-agent') && (
          <NavigationMenuItem>
            <Button 
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={handleWhatsAppClick}
            >
              <WhatsApp size={18} />
              <span className="sr-only">WhatsApp</span>
            </Button>
          </NavigationMenuItem>
        )}
        {/* Settings Button - Icon Only */}
        <NavigationMenuItem>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? `${profileStyle} text-white font-medium`
                  : "hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Cog size={18} />
            <span className="sr-only">Configurações</span>
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavMenu;
