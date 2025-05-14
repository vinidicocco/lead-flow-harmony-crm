
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
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Admin from './pages/Admin';
import AgentSettings from './pages/AgentSettings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Rota de Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/kanban" element={
              <ProtectedRoute>
                <AppShell>
                  <Kanban />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <AppShell>
                  <Leads />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/meetings" element={
              <ProtectedRoute>
                <AppShell>
                  <Meetings />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/follow-up" element={
              <ProtectedRoute>
                <AppShell>
                  <FollowUp />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/ai-agent" element={
              <ProtectedRoute>
                <AppShell>
                  <GestaoAgenteIA />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/agent-settings" element={
              <ProtectedRoute requiredPermission="ai_agent:configure">
                <AppShell>
                  <AgentSettings />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/whatsapp" element={
              <ProtectedRoute>
                <AppShell>
                  <WhatsApp />
                </AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppShell>
                  <Settings />
                </AppShell>
              </ProtectedRoute>
            } />
            
            {/* Rota de Administração (apenas MASTER) */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="MASTER">
                <AppShell>
                  <Admin />
                </AppShell>
              </ProtectedRoute>
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
          <Toaster richColors position="top-right" />
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
