
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AgentChat } from '@/components/agent/AgentChat';

interface AgentChatTabProps {
  onDocumentUpload: () => void;
}

export const AgentChatTab: React.FC<AgentChatTabProps> = ({ onDocumentUpload }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat com Agente IA SDR</CardTitle>
        <CardDescription>
          Converse diretamente com o agente para treinamento e testes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AgentChat onDocumentUpload={onDocumentUpload} />
      </CardContent>
    </Card>
  );
};
