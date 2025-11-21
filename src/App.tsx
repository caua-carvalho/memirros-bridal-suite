import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layouts/ProtectedRoute";

// Client Pages
import Login from "./pages/Login";
import Catalog from "./pages/client/Catalog";
import MyAppointments from "./pages/client/MyAppointments";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import DressesManagement from "./pages/admin/DressesManagement";
import AppointmentsManagement from "./pages/admin/AppointmentsManagement";
import ClientsManagement from "./pages/admin/ClientsManagement";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Client Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute requireRole="client">
                  <Catalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/minhas-provas"
              element={
                <ProtectedRoute requireRole="client">
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vestidos"
              element={
                <ProtectedRoute requireRole="admin">
                  <DressesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/agendamentos"
              element={
                <ProtectedRoute requireRole="admin">
                  <AppointmentsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <ProtectedRoute requireRole="admin">
                  <ClientsManagement />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
