
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { BotMessageSquare, SendHorizontal, User } from 'lucide-react';

const AIAgent = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu assistente virtual de vendas. Como posso ajudar você hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Adiciona a mensagem do usuário
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    // Simula resposta do assistente (em uma aplicação real, isso seria uma chamada de API)
    setTimeout(() => {
      let response = '';
      
      // Respostas simples baseadas em palavras-chave
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('lead') && (lowercaseInput.includes('qualificar') || lowercaseInput.includes('qualificação'))) {
        response = 'Para qualificar leads, recomendo usar a metodologia BANT (Budget, Authority, Need, Timeline). Você pode adicionar notas sobre cada um desses aspectos na seção de notas do lead. Lembre-se de perguntar sobre orçamento disponível, quem tem autoridade para decidir, qual a necessidade real e o prazo para implementação.';
      } else if (lowercaseInput.includes('reunião') && lowercaseInput.includes('agendar')) {
        response = 'Para agendar uma reunião, vá até a página de Reuniões e clique no botão "Agendar Reunião". Você pode vincular a reunião a um lead específico e definir a data, horário e duração. Não se esqueça de adicionar uma pauta clara para a reunião.';
      } else if (lowercaseInput.includes('relatório') || lowercaseInput.includes('dashboard')) {
        response = 'Os principais KPIs estão disponíveis no Dashboard. Você pode ver dados como valor total em pipeline, taxa de conversão e distribuição de leads por etapa do funil. Para relatórios mais detalhados, recomendo exportar os dados para análise em ferramentas específicas.';
      } else if (lowercaseInput.includes('tarefas') || lowercaseInput.includes('follow')) {
        response = 'Você pode gerenciar suas tarefas e follow-ups na página de Acompanhamentos. Lá você pode ver todas as tarefas pendentes organizadas por prioridade e também os próximos follow-ups agendados com seus leads.';
      } else {
        response = 'Entendi. Posso ajudar com diversas questões sobre gerenciamento de leads, agendamento de reuniões, estratégias de vendas e uso do sistema. Poderia detalhar um pouco mais sua dúvida?';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assistente Virtual</h1>
      
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle>
            <div className="flex items-center gap-2">
              <BotMessageSquare className="h-5 w-5" />
              Assistente de Vendas IA
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Utilize este assistente virtual para obter ajuda com tarefas comuns, estratégias de vendas, 
            gerenciamento de leads e dicas para usar o sistema de forma mais eficiente.
          </p>
        </CardContent>
      </Card>
      
      <div className="bg-white border rounded-lg overflow-hidden mb-4">
        <div className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`flex-shrink-0 ${
                  message.role === 'user' ? 'ml-2' : 'mr-2'
                }`}>
                  <Avatar>
                    {message.role === 'user' ? (
                      <User className="h-6 w-6" />
                    ) : (
                      <BotMessageSquare className="h-6 w-6" />
                    )}
                  </Avatar>
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex-shrink-0 mr-2">
                  <Avatar>
                    <BotMessageSquare className="h-6 w-6" />
                  </Avatar>
                </div>
                <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="flex">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-grow mr-2 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
