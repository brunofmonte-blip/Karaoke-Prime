import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider } from "./integrations/supabase/auth";
import { LoginModalProvider, useLoginModal } from "./hooks/use-login-modal";
import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import Academy from "./pages/Academy";
import Backstage from "./pages/Backstage";
import Library from "./pages/Library"; // Import Library page
import { VocalSandboxProvider } from "./hooks/use-vocal-sandbox";
import VocalSandboxOverlay from "./components/VocalSandboxOverlay";
import { PrimeSubscriptionProvider, usePrimeSubscription } from "./hooks/use-prime-subscription";
import PrimeSubscriptionModal from "./components/PrimeSubscriptionModal";
import PerformanceSummaryModal from "./components/PerformanceSummaryModal";

const queryClient = new QueryClient();

// Helper component to render the login modal using the context
const LoginModalWrapper = () => {
  const { isModalOpen, closeModal } = useLoginModal();
  return <LoginModal isOpen={isModalOpen} onClose={closeModal} />;
}

// Helper component to render the subscription modal using the context
const PrimeSubscriptionModalWrapper = () => {
  const { isModalOpen } = usePrimeSubscription();
  return <PrimeSubscriptionModal />;
}

// Helper component to render the performance summary modal
const PerformanceSummaryModalWrapper = () => {
  // The modal manages its own open state based on sessionSummary in useVocalSandbox
  return <PerformanceSummaryModal />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LoginModalProvider>
          <PrimeSubscriptionProvider>
            <VocalSandboxProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/library" element={<Library />} /> {/* New Library Route */}
                    {/* Protected Routes */}
                    <Route path="/academy" element={<ProtectedRoute element={<Academy />} />} />
                    <Route path="/backstage" element={<ProtectedRoute element={<Backstage />} />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <LoginModalWrapper />
                <VocalSandboxOverlay />
                <PrimeSubscriptionModalWrapper />
                <PerformanceSummaryModalWrapper />
              </BrowserRouter>
            </VocalSandboxProvider>
          </PrimeSubscriptionProvider>
        </LoginModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;