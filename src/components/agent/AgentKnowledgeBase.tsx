
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgentKnowledgeBaseProps {
  onDocumentUpload: () => void;
}

export const AgentKnowledgeBase: React.FC<AgentKnowledgeBaseProps> = ({ onDocumentUpload }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Base de Conhecimento</CardTitle>
        <CardDescription>
          Gerencie os documentos e informações que o agente pode acessar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Documentos na Base</h3>
            <Button onClick={onDocumentUpload}>Adicionar Documento</Button>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground py-8">
                Esta funcionalidade requer a integração com Supabase para gestão completa da base de conhecimento.
                <br/>
                Por favor, configure a integração nas configurações de API.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
