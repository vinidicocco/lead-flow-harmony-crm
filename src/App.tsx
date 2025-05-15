
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { Toaster } from 'sonner';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Leads from './pages/Leads';
import Meetings from './pages/Meetings';
import FollowUp from './pages/FollowUp';
import GestaoAgenteIA from './pages/GestaoAgenteIA';
import WhatsApp from './pages/WhatsApp';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import AgentSettings from './pages/AgentSettings';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Rotas principais - sem necessidade de autenticação por enquanto */}
            <Route path="/" element={
              <AppShell>
                <Dashboard />
              </AppShell>
            } />
            
            <Route path="/kanban" element={
              <AppShell>
                <Kanban />
              </AppShell>
            } />
            
            <Route path="/leads" element={
              <AppShell>
                <Leads />
              </AppShell>
            } />
            
            <Route path="/meetings" element={
              <AppShell>
                <Meetings />
              </AppShell>
            } />
            
            <Route path="/follow-up" element={
              <AppShell>
                <FollowUp />
              </AppShell>
            } />
            
            <Route path="/ai-agent" element={
              <AppShell>
                <GestaoAgenteIA />
              </AppShell>
            } />

            <Route path="/agent-settings" element={
              <AppShell>
                <AgentSettings />
              </AppShell>
            } />
            
            <Route path="/whatsapp" element={
              <AppShell>
                <WhatsApp />
              </AppShell>
            } />
            
            <Route path="/settings" element={
              <AppShell>
                <Settings />
              </AppShell>
            } />
            
            {/* Rota de Administração */}
            <Route path="/admin" element={
              <AppShell>
                <Admin />
              </AppShell>
            } />
            
            {/* Página 404 */}
            <Route path="/404" element={
              <AppShell>
                <NotFound />
              </AppShell>
            } />
            
            {/* Redirecionar qualquer outra rota para 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          
          {/* Toaster para notificações */}
          <Toaster 
            richColors 
            position="top-right" 
            toastOptions={{
              duration: 5000,
              style: {
                maxWidth: '420px'
              },
              className: "toastify"
            }} 
          />
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
