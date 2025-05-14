
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Kanban from "./pages/Kanban";
import Leads from "./pages/Leads";
import Meetings from "./pages/Meetings";
import FollowUp from "./pages/FollowUp";
import GestaoAgenteIA from "./pages/GestaoAgenteIA";
import Settings from "./pages/Settings";
import WhatsApp from "./pages/WhatsApp";
import NotFound from "./pages/NotFound";
import AppShell from "./components/layout/AppShell";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrgManagement from "./pages/admin/OrgManagement";
import UserManagement from "./pages/admin/UserManagement";
import ApiManagement from "./pages/admin/ApiManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Standard app routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppShell>
                    <Index />
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
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AppShell isAdminShell>
                    <AdminDashboard />
                  </AppShell>
                </ProtectedRoute>
              } />
              <Route path="/admin/organizations" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AppShell isAdminShell>
                    <OrgManagement />
                  </AppShell>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AppShell isAdminShell>
                    <UserManagement />
                  </AppShell>
                </ProtectedRoute>
              } />
              <Route path="/admin/api" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AppShell isAdminShell>
                    <ApiManagement />
                  </AppShell>
                </ProtectedRoute>
              } />
              <Route path="/admin/audit-logs" element={
                <ProtectedRoute requiredRole="super_admin">
                  <AppShell isAdminShell>
                    <AuditLogs />
                  </AppShell>
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
