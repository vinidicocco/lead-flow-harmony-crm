
# Guia de Deploy para Produção

## 1. Configuração do Firebase

### 1.1 Criar Projeto Firebase
1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Siga as instruções para criar o projeto

### 1.2 Configurar Authentication
1. No console Firebase, vá para "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite "Email/senha"

### 1.3 Configurar Firestore
1. Vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção
4. Selecione a localização

### 1.4 Configurar variáveis de ambiente
1. Copie as credenciais do Firebase (Configurações do projeto > Geral > Seus apps)
2. Atualize o arquivo `.env` com suas credenciais reais

## 2. Estrutura de Coleções Firestore

### 2.1 Regras de Segurança
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Leads collection - organization-based access
    match /leads/{leadId} {
      allow read, write: if request.auth != null &&
        resource.data.organizationId == getOrganizationId();
    }
    
    // Meetings collection - organization-based access
    match /meetings/{meetingId} {
      allow read, write: if request.auth != null &&
        resource.data.organizationId == getOrganizationId();
    }
    
    // Communications collection
    match /communications/{commId} {
      allow read, write: if request.auth != null &&
        resource.data.organizationId == getOrganizationId();
    }
    
    // Agent configs collection
    match /agent_configs/{configId} {
      allow read, write: if request.auth != null &&
        resource.data.organizationId == getOrganizationId();
    }
    
    function getOrganizationId() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId;
    }
  }
}
```

## 3. Build e Deploy

### 3.1 Build do projeto
```bash
npm run build
```

### 3.2 Deploy Firebase Hosting
```bash
# Instalar Firebase CLI (se não instalado)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto (se não feito)
firebase init hosting

# Deploy
firebase deploy
```

### 3.3 Configurar domínio personalizado
1. No Firebase Console, vá para "Hosting"
2. Clique em "Adicionar domínio personalizado"
3. Siga as instruções para configurar DNS

## 4. Configuração Multi-tenant por Subdomínio

### 4.1 Configurar subdomínios
- salt.seudominio.com → Organização SALT
- ghf.seudominio.com → Organização GHF  
- neoin.seudominio.com → Organização NEOIN

### 4.2 Configurar redirecionamentos
```javascript
// No firebase.json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      }
    ]
  }
}
```

## 5. Integração WhatsApp (Opcional)

### 5.1 Evolution API
1. Configure servidor Evolution API
2. Atualize URL no arquivo de configuração do agente

### 5.2 Webhook Configuration
1. Configure webhook URL para receber mensagens
2. Implemente Cloud Function para processar mensagens

## 6. Monitoramento

### 6.1 Firebase Analytics
1. Habilite Google Analytics no projeto Firebase
2. Configure eventos personalizados

### 6.2 Error Monitoring
1. Configure Crashlytics
2. Implemente logging de erros

## 7. Backup e Segurança

### 7.1 Backup Firestore
1. Configure exports automáticos
2. Implemente estratégia de backup

### 7.2 Segurança
1. Configure IAM adequadamente
2. Revise regras de segurança regularmente
3. Monitore logs de acesso

## 8. Scripts de Deploy Automatizado

### 8.1 Deploy script
```bash
#!/bin/bash
echo "Iniciando deploy..."

# Build do projeto
echo "Building project..."
npm run build

# Deploy Firebase
echo "Deploying to Firebase..."
firebase deploy

echo "Deploy concluído!"
```

### 8.2 CI/CD (GitHub Actions)
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: seu-projeto-firebase
```
