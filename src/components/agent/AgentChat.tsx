
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { BotMessageSquare, SendHorizontal, User, PaperclipIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type MessageRole = 'user' | 'assistant';

interface Message {
  role: MessageRole;
  content: string;
}

interface AgentChatProps {
  onDocumentUpload?: () => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ onDocumentUpload }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o agente IA SDR. Como posso ajudar você hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Adiciona a mensagem do usuário
    const newMessages = [...messages, { role: 'user' as MessageRole, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    // Simula resposta do assistente (em uma aplicação real, isso seria uma chamada de API)
    setTimeout(() => {
      let response = '';
      
      // Respostas simples baseadas em palavras-chave
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('métricas') || lowercaseInput.includes('desempenho')) {
        response = 'Nas últimas 24 horas, processamos 78 mensagens, qualifiquei 5 leads e agendei 2 reuniões. A taxa de conversão está em 40%, um aumento de 5% em relação à semana passada.';
      } else if (lowercaseInput.includes('documento') || lowercaseInput.includes('contrato') || lowercaseInput.includes('pdf')) {
        response = 'Para enviar um documento para a base de conhecimento ou para um lead, você pode anexá-lo diretamente neste chat ou fazer upload na seção de Base de Conhecimento. Depois disso, eu posso referenciá-lo nas minhas conversas com os leads.';
      } else if (lowercaseInput.includes('integração') || lowercaseInput.includes('n8n') || lowercaseInput.includes('whatsapp')) {
        response = 'A integração com o N8N está configurada para acionar fluxos de trabalho automatizados quando ocorrem eventos específicos, como a qualificação de um lead ou o agendamento de uma reunião. A integração com o WhatsApp via Evolution API permite que eu interaja diretamente com os leads através deste canal.';
      } else if (lowercaseInput.includes('como') && lowercaseInput.includes('funciona')) {
        response = 'Eu trabalho como um SDR virtual, interagindo com leads via WhatsApp. Utilizo NLP (processamento de linguagem natural) para compreender as necessidades dos leads, responder perguntas e qualificá-los de acordo com critérios estabelecidos. Quando identifico um lead qualificado, sugiro agendar uma reunião com um especialista humano.';
      } else {
        response = 'Estou aqui para ajudar com a gestão de leads e automação de processos de vendas. Posso fornecer informações sobre métricas de desempenho, processos de qualificação de leads, ou ajudar com configurações específicas. O que mais gostaria de saber?';
      }
      
      setMessages(prev => [...prev, { role: 'assistant' as MessageRole, content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    if (onDocumentUpload) {
      onDocumentUpload();
    }
    toast({
      title: "Upload de documento",
      description: "Funcionalidade de upload de documentos para o agente.",
    });
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
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
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleFileUpload}
            title="Enviar documento"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
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
  );
};
