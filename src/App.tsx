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
import Library from "./pages/Library";
import { VocalSandboxProvider, useVocalSandbox } from "./hooks/use-vocal-sandbox";
import VocalSandboxOverlay from "./components/VocalSandboxOverlay";
import { PrimeSubscriptionProvider, usePrimeSubscription } from "./hooks/use-prime-subscription";
import PrimeSubscriptionModal from "./components/PrimeSubscriptionModal";
import PerformanceSummaryModal from "./components/PerformanceSummaryModal";
import { DuelProvider } from "./hooks/use-duel-engine";
import DuelSummaryModal from "./components/DuelSummaryModal";
import BadgeUnlockedModal from "./components/BadgeUnlockedModal";

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
  return <PerformanceSummaryModal />;
}

// Helper component to render the duel summary modal
const DuelSummaryModalWrapper = () => {
  return <DuelSummaryModal />;
}

// Helper component to render the badge modal
const BadgeUnlockedModalWrapper = () => {
  return <BadgeUnlockedModal />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LoginModalProvider>
          <PrimeSubscriptionProvider>
            {/* CRITICAL HIERARCHY: VocalSandboxProvider must wrap DuelProvider */}
            <VocalSandboxProvider>
              <DuelProvider>
                <BrowserRouter>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/library" element={<Library />} />
                      {/* Protected Routes */}
                      <Route path="/academy" element={<ProtectedRoute element={<Academy />} />} />
                      <Route path="/backstage" element={<ProtectedRoute element={<Backstage />} />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  {/* Modals and Overlays must be inside BrowserRouter but outside Layout */}
                  <LoginModalWrapper />
                  <VocalSandboxOverlay />
                  <PrimeSubscriptionModalWrapper />
                  <PerformanceSummaryModalWrapper />
                  <DuelSummaryModalWrapper />
                  <BadgeUnlockedModalWrapper />
                </BrowserRouter>
              </DuelProvider>
            </VocalSandboxProvider>
          </PrimeSubscriptionProvider>
        </LoginModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;