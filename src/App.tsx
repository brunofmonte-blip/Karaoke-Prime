import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./integrations/supabase/auth";
import { LoginModalProvider, useLoginModal } from "./hooks/use-login-modal";
import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import Academy from "./pages/Academy";
import Backstage from "./pages/Backstage";
import BasicPillarSandbox from "./pages/BasicPillarSandbox"; // Import new page

const queryClient = new QueryClient();

// Helper component to render the modal using the context
const LoginModalWrapper = () => {
  const { isModalOpen, closeModal } = useLoginModal();
  return <LoginModal isOpen={isModalOpen} onClose={closeModal} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LoginModalProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Core Pillars */}
                <Route path="/basic" element={<BasicPillarSandbox />} />
                {/* Protected Routes */}
                <Route path="/academy" element={<ProtectedRoute element={<Academy />} />} />
                <Route path="/backstage" element={<ProtectedRoute element={<Backstage />} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <LoginModalWrapper />
          </BrowserRouter>
        </LoginModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;