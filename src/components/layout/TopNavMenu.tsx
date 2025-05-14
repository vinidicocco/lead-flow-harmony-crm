
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, Users, Calendar, MessageSquare, Bot, Cog, MessageCircle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TopNavMenu = () => {
  const { currentProfile } = useProfile();
  const { toast } = useToast();
  const profileStyle = currentProfile === 'SALT' ? 'bg-salt-light' : 'bg-ghf-light';
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  const links = [
    { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { to: '/kanban', icon: <Kanban size={16} />, label: 'CRM' },
    { to: '/leads', icon: <Users size={16} />, label: 'Leads' },
    { to: '/meetings', icon: <Calendar size={16} />, label: 'Reuniões' },
    { to: '/follow-up', icon: <MessageSquare size={16} />, label: 'Follow-up' },
    { to: '/ai-agent', icon: <Bot size={16} />, label: 'Gestão Agente IA' },
  ];

  const handleWhatsAppClick = () => {
    toast({
      title: "WhatsApp Web",
      description: "Abrindo WhatsApp da empresa...",
    });
    setWhatsAppOpen(true);
  };

  return (
    <>
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
          {/* WhatsApp Button - Using MessageCircle as an alternative */}
          {links.some(link => link.to === '/ai-agent') && (
            <NavigationMenuItem>
              <Button 
                variant="ghost"
                size="sm"
                className="flex items-center px-2.5 py-1.5 rounded-md text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle size={16} />
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

      {/* WhatsApp Dialog */}
      <Dialog open={whatsAppOpen} onOpenChange={setWhatsAppOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>WhatsApp Web</DialogTitle>
            <DialogDescription>
              Espelhamento do WhatsApp da empresa
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-full">
            <iframe 
              src="https://web.whatsapp.com"
              className="w-full h-full border-0"
              title="WhatsApp Web"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allow="camera; microphone; clipboard-read; clipboard-write"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopNavMenu;
