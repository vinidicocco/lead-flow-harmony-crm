
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Kanban from "./pages/Kanban";
import Leads from "./pages/Leads";
import Meetings from "./pages/Meetings";
import FollowUp from "./pages/FollowUp";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AppShell from "./components/layout/AppShell";

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
              <Route path="/" element={
                <AppShell>
                  <Index />
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
              <Route path="/settings" element={
                <AppShell>
                  <Settings />
                </AppShell>
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
