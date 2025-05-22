
# CRM AssistU - Sistema integrado com Firebase

## Visão Geral do Projeto

Sistema CRM para gerenciamento de leads, reuniões e acompanhamento de negócios. O frontend é construído com React, TypeScript e Tailwind CSS, enquanto o backend utiliza os serviços do Firebase (Authentication, Firestore e Storage).

## Tecnologias Utilizadas

- **Frontend**: 
  - React + TypeScript
  - Tailwind CSS + shadcn/ui
  - React Router
  - TanStack Query
  
- **Backend**: 
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage
  - Firebase Hosting

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 16.x ou superior)
- npm ou yarn
- Conta no Firebase com um projeto criado

### Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto (ou use um existente)
3. Adicione um aplicativo Web ao seu projeto
4. Copie as configurações do Firebase (apiKey, authDomain, etc.)

### Configuração do Projeto

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   VITE_FIREBASE_API_KEY=seu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
   VITE_FIREBASE_DEBUG=true
   ```

## Executando Localmente

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

```
/src/
├── firebase/           # Integrações com Firebase
│   ├── config.ts       # Configuração e inicialização do Firebase
│   ├── auth.ts         # Serviços de autenticação
│   ├── firestore.ts    # Serviços de banco de dados
│   ├── storage.ts      # Serviços de armazenamento
│   └── index.ts        # Exportações centralizadas
├── components/         # Componentes reutilizáveis da UI
├── context/            # Contextos React, incluindo AuthContext
├── hooks/              # Hooks personalizados
├── pages/              # Componentes de página
├── types/              # Definições de tipos TypeScript
└── utils/              # Utilitários e funções auxiliares
```

## Deploy para Firebase Hosting

### Deploy Manual

1. Instale o Firebase CLI globalmente:
   ```bash
   npm install -g firebase-tools
   ```

2. Faça login no Firebase:
   ```bash
   firebase login
   ```

3. Inicialize o projeto Firebase (se ainda não estiver configurado):
   ```bash
   firebase init
   ```
   - Selecione "Hosting"
   - Escolha seu projeto Firebase
   - Defina "dist" como diretório público
   - Configure como aplicação de página única
   - Não sobrescreva o arquivo index.html

4. Construa o projeto:
   ```bash
   npm run build
   ```

5. Faça o deploy:
   ```bash
   firebase deploy
   ```

### Deploy Automatizado (GitHub Actions)

O projeto está configurado com GitHub Actions para fazer deploy automático para o Firebase Hosting quando houver um push para a branch main.

Para configurar:

1. No GitHub, vá para Settings > Secrets > Actions
2. Adicione os seguintes secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (conteúdo JSON da chave privada do Service Account)

## Regras de Segurança do Firebase

Para garantir a segurança dos dados, configure as regras de segurança no Firebase Console:

### Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /organizations/{organizationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    exists(/databases/$(database)/documents/profiles/$(request.auth.uid)) &&
                    get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Suporte

Em caso de dúvidas ou problemas, abra uma issue no GitHub.
