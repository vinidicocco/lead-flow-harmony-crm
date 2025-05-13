
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgentConfigPanelProps {
  onSave: (config: any) => void;
  isAdmin?: boolean;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({ onSave, isAdmin = false }) => {
  const [config, setConfig] = useState({
    agentName: 'Leandro',
    personality: 'professional',
    openaiApiKey: '',
    n8nWebhookUrl: '',
    whatsappInstance: 'default',
    welcomeMessage: 'Olá, sou o assistente virtual da [Empresa]. Como posso ajudar você hoje?',
    qualificationFlow: 'default',
  });

  const handleChange = (field: string, value: string) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(config);
  };

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
            <label className="text-sm font-medium">Exemplo de personalidade</label>
            <Textarea
              value={config.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              placeholder="Digite aqui informações sobre a personalidade e ou comportamento especifico."
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
            
            <div className="pt-4">
              <Button className="w-full" onClick={handleSave}>
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!isAdmin && (
        <div className="flex items-center justify-center">
          <Button className="w-full mt-4" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      )}
    </div>
  );
};
