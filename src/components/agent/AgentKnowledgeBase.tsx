
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { knowledgeBaseService, checkStorageBucket } from '@/integrations/supabase/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2, File, Trash2, Upload } from 'lucide-react';

interface AgentKnowledgeBaseProps {
  onDocumentUpload: () => void;
}

export const AgentKnowledgeBase: React.FC<AgentKnowledgeBaseProps> = ({ onDocumentUpload }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [bucketExists, setBucketExists] = useState(false);

  useEffect(() => {
    const checkBucket = async () => {
      const exists = await checkStorageBucket();
      setBucketExists(exists);
      
      if (exists && user) {
        loadDocuments();
      } else {
        setIsLoading(false);
      }
    };
    
    checkBucket();
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // We'll use the user's organization ID or tenant as the folder
      const orgId = user.tenant === 'NEOIN' ? 'neoin' : 'salt-ghf';
      const docs = await knowledgeBaseService.listDocuments(orgId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os documentos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    try {
      // Use tenant as folder structure
      const orgId = user.tenant === 'NEOIN' ? 'neoin' : 'salt-ghf';
      
      // Create a safe filename
      const timestamp = new Date().getTime();
      const safeName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      await knowledgeBaseService.uploadDocument(safeName, file, orgId);
      toast({
        title: "Sucesso",
        description: "Documento enviado com sucesso"
      });
      
      // Reload documents and notify parent
      await loadDocuments();
      onDocumentUpload();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar o documento"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm("Deseja realmente excluir este documento?")) return;
    
    try {
      await knowledgeBaseService.deleteDocument(filePath);
      toast({
        title: "Sucesso",
        description: "Documento excluído com sucesso"
      });
      await loadDocuments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o documento"
      });
    }
  };

  if (!bucketExists) {
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
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-center text-muted-foreground py-8">
                  É necessário configurar o bucket de armazenamento "knowledge-base" no Supabase.
                  <br/>
                  Por favor, configure o storage para gerenciar documentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <div>
              <input
                type="file"
                id="document-upload"
                className="sr-only"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="document-upload">
                <Button 
                  as="span" 
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Adicionar Documento
                    </>
                  )}
                </Button>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-center text-muted-foreground py-6">
                  Não há documentos na base de conhecimento.
                  <br/>
                  Adicione documentos para o agente poder acessar.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg divide-y">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.name.split('-').slice(1).join('-')}</p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.metadata?.size / 1024).toFixed(2)} KB • Atualizado em {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(`${user?.tenant === 'NEOIN' ? 'neoin' : 'salt-ghf'}/${doc.name}`)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
