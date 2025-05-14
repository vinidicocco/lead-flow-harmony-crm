
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WhatsApp = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">WhatsApp Web</h1>
      <Card className="w-full h-[75vh]">
        <CardHeader>
          <CardTitle>WhatsApp Web</CardTitle>
          <CardDescription>Espelhamento do WhatsApp da empresa</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <iframe 
            src="https://web.whatsapp.com"
            className="w-full h-full border-0"
            title="WhatsApp Web"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="camera; microphone; clipboard-read; clipboard-write"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsApp;
