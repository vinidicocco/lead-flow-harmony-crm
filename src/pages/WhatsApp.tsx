
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const WhatsApp = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Web</h1>
        <p className="text-muted-foreground">Acesse o WhatsApp da empresa</p>
      </div>

      <Card className="h-[80vh]">
        <CardHeader>
          <CardTitle>WhatsApp Web</CardTitle>
          <CardDescription>
            Espelhamento do WhatsApp da empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full pb-6">
          <div className="h-full border rounded-lg">
            <iframe 
              src="https://web.whatsapp.com"
              className="w-full h-full border-0 rounded-lg"
              title="WhatsApp Web"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allow="camera; microphone; clipboard-read; clipboard-write"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsApp;
