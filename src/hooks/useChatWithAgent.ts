
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { getOrganizationId } from '@/firebase/config';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export const useChatWithAgent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (message: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    setLoading(true);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const sendMessageToAgent = httpsCallable(functions, 'sendMessageToAgent');
      const result = await sendMessageToAgent({
        message,
        organizationId: getOrganizationId()
      });
      
      // Add agent response
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: result.data?.response || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages
  };
};
