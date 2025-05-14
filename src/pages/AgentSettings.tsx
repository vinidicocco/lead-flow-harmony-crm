
import React, { useEffect, useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from "@/integrations/supabase/client";
import { AgentConfig } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, TestTube, MessageCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

const AgentSettings = () => {
  const { currentProfile } = useProfile();
  const { user, organization } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  
  // Carregar configuração do agente
  const loadAgentConfig = async () => {
    setIsLoading(true);
    try {
      // Buscar configuração baseada na organização atual
      const { data: configData, error } = await supabase
        .from('agent_configs')
        .select('*')
        .eq('organization_id', organization?.id)
        .single();
      
      if (error) {
        console.error('Erro ao carregar configuração do agente:', error);
        toast.error('Não foi possível carregar a configuração do agente');
        return;
      }
      
      setAgentConfig(configData);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados quando o perfil mudar
  useEffect(() => {
    if (organization) {
      loadAgentConfig();
    }
  }, [organization]);
  
  // Função para atualizar configuração
  const updateAgentConfig = async () => {
    if (!agentConfig || !organization) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('agent_configs')
        .update({
          name: agentConfig.name,
          personality: agentConfig.personality,
          welcome_message: agentConfig.welcome_message,
          qualification_flow: agentConfig.qualification_flow,
          openai_api_key: agentConfig.openai_api_key,
          n8n_webhook_url: agentConfig.n8n_webhook_url,
          whatsapp_instance: agentConfig.whatsapp_instance,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentConfig.id);
      
      if (error) throw error;
      
      toast.success('Configuração atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para testar webhook
  const testWebhook = async () => {
    if (!agentConfig?.n8n_webhook_url) {
      toast.error('URL do webhook não configurada');
      return;
    }
    
    setIsTesting(true);
    try {
      // Simular teste de webhook
      const response = await fetch(agentConfig.n8n_webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: 'test',
          organization: organization?.name,
          profile: currentProfile,
          timestamp: new Date().toISOString(),
          test: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      toast.success('Webhook testado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao testar webhook:', error);
      toast.error(`Erro no teste: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  // Helper para atualizar campos
  const updateField = (field: keyof AgentConfig, value: string) => {
    if (agentConfig) {
      setAgentConfig({
        ...agentConfig,
        [field]: value
      });
    }
  };
  
  // Verificar permissão para configurar
  const canConfigureAgent = user?.role === 'MASTER' || user?.role === 'ADMIN';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }
  
  if (!agentConfig) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Agente IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nenhuma configuração encontrada para a organização atual.
              {canConfigureAgent && ' Clique abaixo para criar uma configuração.'}
            </p>
          </CardContent>
          {canConfigureAgent && (
            <CardFooter>
              <Button 
                onClick={async () => {
                  try {
                    const { data, error } = await supabase
                      .from('agent_configs')
                      .insert({
                        organization_id: organization?.id,
                        name: 'Agente IA',
                        welcome_message: `Olá, sou o assistente virtual da ${organization?.name}. Como posso ajudar você hoje?`
                      })
                      .select()
                      .single();
                    
                    if (error) throw error;
                    
                    setAgentConfig(data);
                    toast.success('Configuração criada com sucesso');
                  } catch (error: any) {
                    console.error('Erro ao criar configuração:', error);
                    toast.error(`Erro ao criar configuração: ${error.message}`);
                  }
                }}
              >
                Criar Configuração
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Configuração do Agente IA</h1>
          <p className="text-gray-500 mt-1">
            Configure o comportamento e conexões do agente inteligente para {currentProfile}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={loadAgentConfig}
          >
            <RefreshCw size={16} />
            Recarregar
          </Button>
          
          {canConfigureAgent && (
            <Button 
              className="flex items-center gap-2" 
              onClick={updateAgentConfig}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar Alterações
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="integration">Integrações</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure informações básicas e comportamento do agente IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Nome do Agente</Label>
                <Input
                  id="agent-name"
                  value={agentConfig.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={!canConfigureAgent}
                />
                <p className="text-xs text-gray-500">
                  Nome que o agente utilizará para se identificar.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent-personality">Personalidade</Label>
                <Select
                  value={agentConfig.personality}
                  onValueChange={(value) => updateField('personality', value)}
                  disabled={!canConfigureAgent}
                >
                  <SelectTrigger id="agent-personality">
                    <SelectValue placeholder="Selecione a personalidade do agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="friendly">Amigável</SelectItem>
                    <SelectItem value="direct">Direto</SelectItem>
                    <SelectItem value="enthusiastic">Entusiasmado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Define o tom geral de comunicação do agente.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualification-flow">Fluxo de Qualificação</Label>
                <Select
                  value={agentConfig.qualification_flow}
                  onValueChange={(value) => updateField('qualification_flow', value)}
                  disabled={!canConfigureAgent}
                >
                  <SelectTrigger id="qualification-flow">
                    <SelectValue placeholder="Selecione o fluxo de qualificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="aggressive">Agressivo</SelectItem>
                    <SelectItem value="consultative">Consultivo</SelectItem>
                    <SelectItem value="educational">Educacional</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Determina como o agente qualifica leads e direciona a conversação.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp-instance">Instância WhatsApp</Label>
                <Input
                  id="whatsapp-instance"
                  value={agentConfig.whatsapp_instance}
                  onChange={(e) => updateField('whatsapp_instance', e.target.value)}
                  disabled={!canConfigureAgent}
                />
                <p className="text-xs text-gray-500">
                  Identificador da instância do WhatsApp conectada.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Configure integrações com serviços externos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="openai-key">Chave API OpenAI</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={agentConfig.openai_api_key || ''}
                  onChange={(e) => updateField('openai_api_key', e.target.value)}
                  disabled={!canConfigureAgent}
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500">
                  Chave API para integração com modelos de linguagem da OpenAI.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="n8n-webhook">URL Webhook N8N</Label>
                  {canConfigureAgent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testWebhook}
                      disabled={isTesting || !agentConfig.n8n_webhook_url}
                      className="flex items-center gap-2"
                    >
                      {isTesting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <TestTube size={14} />
                      )}
                      Testar
                    </Button>
                  )}
                </div>
                <Input
                  id="n8n-webhook"
                  value={agentConfig.n8n_webhook_url || ''}
                  onChange={(e) => updateField('n8n_webhook_url', e.target.value)}
                  disabled={!canConfigureAgent}
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500">
                  URL do webhook N8N para integração com fluxos de automação.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-gray-500">
                As integrações são essenciais para o funcionamento do agente IA.
              </div>
              
              {canConfigureAgent && (
                <Button 
                  onClick={updateAgentConfig}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens</CardTitle>
              <CardDescription>
                Configure as mensagens utilizadas pelo agente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcome-message"
                  value={agentConfig.welcome_message || ''}
                  onChange={(e) => updateField('welcome_message', e.target.value)}
                  disabled={!canConfigureAgent}
                  placeholder={`Olá, sou o assistente virtual da ${organization?.name}. Como posso ajudar você hoje?`}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  Mensagem que o agente enviará ao iniciar uma conversa.
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Visualização da mensagem de boas-vindas</p>
                    <div className="mt-2 p-3 bg-white rounded-lg border">
                      {agentConfig.welcome_message || `Olá, sou o assistente virtual da ${organization?.name}. Como posso ajudar você hoje?`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-gray-500">
                Personalize a comunicação do agente com seus clientes.
              </div>
              
              {canConfigureAgent && (
                <Button 
                  onClick={updateAgentConfig}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentSettings;
