import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GestaoAgenteIA = () => {
  const { user } = useAuth();
  const { currentProfile } = useProfile();
  const { hasPermission } = useAuth();
  const [canConfigureAgent, setCanConfigureAgent] = useState(false);
  
  // Verificar permissão
  useEffect(() => {
    const checkPermission = async () => {
      const canConfigure = await hasPermission('ai_agent:configure');
      setCanConfigureAgent(canConfigure);
    };
    
    checkPermission();
  }, [hasPermission]);
  
  const navigate = useNavigate();
  
  const renderConfigButton = () => {
    if (!canConfigureAgent) return null;
    
    return (
      <Button 
        variant="outline" 
        onClick={() => navigate('/agent-settings')}
        className="flex items-center gap-2"
      >
        <Settings size={16} />
        Configurações
      </Button>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão do Agente de IA</h1>
          <p className="text-gray-500 mt-1">
            Configure e gerencie o agente de inteligência artificial.
          </p>
        </div>
        
        <div>
          {renderConfigButton()}
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Informações do Agente</h3>
          <p className="text-sm text-gray-500 mt-1">
            Visualize as informações básicas do agente de IA.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">Agente AI</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Organização:</span>
              <span className="font-medium">{currentProfile}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoAgenteIA;
