
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agentService, AgentConfig } from '@/services/agentService';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AgentConfigPanelProps {
  onSave: (config: any) => void;
  isAdmin?: boolean;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({ onSave, isAdmin = false }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AgentConfig>({
    agentName: '',
    personality: 'professional',
    openaiApiKey: '',
    n8nWebhookUrl: '',
    whatsappInstance: 'default',
    welcomeMessage: '',
    qualificationFlow: 'default',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadConfig();
    }
  }, [user]);

  const loadConfig = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const agentConfig = await agentService.getConfig(user.organizationId);
      setConfig(agentConfig);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof AgentConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await agentService.updateConfig(user.organizationId, config);
      onSave(config);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Agente</CardTitle>
          <CardDescription>Personalize o comportamento do seu agente IA SDR</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Agente</label>
            <Input
              value={config.agentName}
              onChange={(e) => handleChange('agentName', e.target.value)}
              placeholder="Nome que o agente usará nas conversas"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Personalidade</label>
            <Select
              value={config.personality}
              onValueChange={(value) => handleChange('personality', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a personalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Profissional</SelectItem>
                <SelectItem value="friendly">Amigável</SelectItem>
                <SelectItem value="assertive">Assertivo</SelectItem>
                <SelectItem value="helpful">Prestativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem de Boas-vindas</label>
            <Textarea
              value={config.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              placeholder="Digite a mensagem que o agente enviará para novos contatos"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fluxo de Qualificação</label>
            <Select
              value={config.qualificationFlow}
              onValueChange={(value) => handleChange('qualificationFlow', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fluxo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão (BANT)</SelectItem>
                <SelectItem value="soft">Abordagem Suave</SelectItem>
                <SelectItem value="direct">Abordagem Direta</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>Configure as integrações do agente com serviços externos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input
                type="password"
                value={config.openaiApiKey}
                onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground">Necessário para o processamento de linguagem natural</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL do Webhook N8N</label>
              <Input
                value={config.n8nWebhookUrl}
                onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
                placeholder="https://n8n.seudominio.com/webhook/..."
              />
              <p className="text-xs text-muted-foreground">Para integração com fluxos de automação</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Instância WhatsApp</label>
              <Select
                value={config.whatsappInstance}
                onValueChange={(value) => handleChange('whatsappInstance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a instância" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Principal (Default)</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Instância da Evolution API a ser utilizada</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end mt-4 md:col-span-2">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Configurações'
          )}
        </Button>
      </div>
    </div>
  );
};
