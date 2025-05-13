
import React, { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Bot, MessageSquare, Play, StopCircle } from 'lucide-react';

const AIAgentPage = () => {
  const { currentProfile } = useProfile();
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [message, setMessage] = useState('');
  
  // Mock conversation history
  const [conversations, setConversations] = useState([
    {
      id: '1',
      lead: 'João Silva',
      date: new Date().toLocaleDateString('pt-BR'),
      messages: [
        { sender: 'agent', content: 'Olá João, tudo bem? Sou o assistente virtual da ' + currentProfile + '.' },
        { sender: 'lead', content: 'Olá, estou bem! Gostaria de saber mais sobre os serviços de vocês.' },
        { sender: 'agent', content: 'Claro! A ' + currentProfile + ' oferece diversos serviços financeiros. Poderia me dizer qual deles você tem interesse?' }
      ],
      status: 'active'
    },
    {
      id: '2',
      lead: 'Maria Oliveira',
      date: new Date(Date.now() - 86400000).toLocaleDateString('pt-BR'),
      messages: [
        { sender: 'agent', content: 'Olá Maria, tudo bem? Sou o assistente virtual da ' + currentProfile + '.' },
        { sender: 'lead', content: 'Olá! Estou procurando informações sobre crédito consignado.' },
        { sender: 'agent', content: 'Excelente! A ' + currentProfile + ' tem ótimas opções de crédito consignado com taxas competitivas.' }
      ],
      status: 'completed'
    }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  
  const handleToggleAgent = () => {
    setIsAgentRunning(!isAgentRunning);
    toast.success(isAgentRunning 
      ? 'Agente IA pausado com sucesso' 
      : 'Agente IA iniciado com sucesso'
    );
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { sender: 'agent', content: message }
          ]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        { sender: 'agent', content: message }
      ]
    });
    
    setMessage('');
    toast.success('Mensagem enviada com sucesso');
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const simulatedResponse = {
        sender: 'lead',
        content: 'Obrigado pelas informações. Vou analisar e retorno em breve!'
      };
      
      const updatedWithResponse = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              { sender: 'agent', content: message },
              simulatedResponse
            ]
          };
        }
        return conv;
      });
      
      setConversations(updatedWithResponse);
      setSelectedConversation({
        ...selectedConversation,
        messages: [
          ...selectedConversation.messages,
          { sender: 'agent', content: message },
          simulatedResponse
        ]
      });
    }, 2000);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Agente IA SDR</h1>
          <Badge 
            variant={isAgentRunning ? "default" : "secondary"}
            className={`${isAgentRunning ? 'bg-green-500' : ''}`}
          >
            {isAgentRunning ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <Button 
          onClick={handleToggleAgent} 
          variant={isAgentRunning ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {isAgentRunning ? (
            <>
              <StopCircle size={18} /> Pausar Agente
            </>
          ) : (
            <>
              <Play size={18} /> Iniciar Agente
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot size={18} />
              Conversas do Agente
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[600px]">
            <div className="space-y-2">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  className={`p-3 rounded-md cursor-pointer border ${selectedConversation.id === conv.id ? 
                    'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-primary/5'}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{conv.lead}</h3>
                    <Badge variant={conv.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {conv.status === 'active' ? 'Ativo' : 'Concluído'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{conv.date}</p>
                  <p className="text-sm mt-2 truncate">
                    {conv.messages[conv.messages.length - 1].content.substring(0, 50)}
                    {conv.messages[conv.messages.length - 1].content.length > 50 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Nova Conversa
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Conversa com {selectedConversation?.lead}</span>
              <Badge className="ml-2">
                {selectedConversation?.status === 'active' ? 'Ativo' : 'Concluído'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/10 rounded-md p-4 h-[400px] mb-4 overflow-auto">
              {selectedConversation?.messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex mb-4 ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'agent' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1">
                      {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder="Digite uma mensagem..." 
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={selectedConversation?.status !== 'active'}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={selectedConversation?.status !== 'active' || !message.trim()}
              >
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="w-full">
                <TabsTrigger value="general" className="flex-1">Geral</TabsTrigger>
                <TabsTrigger value="messages" className="flex-1">Mensagens</TabsTrigger>
                <TabsTrigger value="schedule" className="flex-1">Agendamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Nome do Agente</h3>
                    <Input defaultValue={`Agente ${currentProfile}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Personalidade</h3>
                    <Input defaultValue="Profissional e amigável" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Descrição</h3>
                  <Textarea defaultValue={`Assistente virtual da ${currentProfile} para qualificação de leads e agendamento de reuniões.`} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Respostas automáticas</h3>
                    <p className="text-sm text-gray-500">Habilite para que o agente responda automaticamente às mensagens</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Mensagem de Boas-vindas</h3>
                  <Textarea defaultValue={`Olá! Sou o assistente virtual da ${currentProfile}. Como posso ajudar você hoje?`} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Mensagem de Qualificação</h3>
                  <Textarea defaultValue="Para entender melhor suas necessidades, poderia me fornecer algumas informações sobre o que você está buscando?" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Mensagem de Agendamento</h3>
                  <Textarea defaultValue="Ótimo! Gostaria de agendar uma reunião com um de nossos consultores para discutirmos mais detalhes?" />
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Agente ativo 24/7</h3>
                    <p className="text-sm text-gray-500">Mantenha o agente ativo 24 horas por dia, 7 dias por semana</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Horário de Funcionamento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Início</p>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Fim</p>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Dias da Semana</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                      <Button 
                        key={day} 
                        variant={index === 0 || index === 6 ? 'outline' : 'default'}
                        className="w-14"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AIAgentPage;
