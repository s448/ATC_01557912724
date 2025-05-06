import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import { BookingProvider } from "./contexts/BookingContext";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { seedDatabase } from "./supabase/seed-data";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    // Seed the database with initial data if needed
    seedDatabase().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EventProvider>
          <BookingProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/events/:id" element={<MainLayout><EventDetails /></MainLayout>} />
                  <Route path="/payment" element={<MainLayout><Payment /></MainLayout>} />
                  
                  <Route path="/my-bookings" element={
                    <ProtectedRoute>
                      <MainLayout><MyBookings /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout><AdminDashboard /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/events/new" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout><CreateEvent /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/events/edit/:id" element={
                    <ProtectedRoute requireAdmin>
                      <MainLayout><EditEvent /></MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                </Routes>
                <Toaster position="top-right" />
              </BrowserRouter>
            </TooltipProvider>
          </BookingProvider>
        </EventProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
