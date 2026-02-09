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
import { VocalSandboxProvider } from "./hooks/use-vocal-sandbox";
import VocalSandboxOverlay from "./components/VocalSandboxOverlay";
import { PrimeSubscriptionProvider } from "./hooks/use-prime-subscription";
import PrimeSubscriptionModal from "./components/PrimeSubscriptionModal";
import PerformanceSummaryModal from "./components/PerformanceSummaryModal";
import { DuelProvider } from "./hooks/use-duel-engine";
import DuelSummaryModal from "./components/DuelSummaryModal";
import BadgeUnlockedModal from "./components/BadgeUnlockedModal";

const queryClient = new QueryClient();

// Helper components for modals
const LoginModalWrapper = () => {
  const { isModalOpen, closeModal } = useLoginModal();
  return <LoginModal isOpen={isModalOpen} onClose={closeModal} />;
}

const PrimeSubscriptionModalWrapper = () => {
  return <PrimeSubscriptionModal />;
}

const PerformanceSummaryModalWrapper = () => {
  return <PerformanceSummaryModal />;
}

const DuelSummaryModalWrapper = () => {
  return <DuelSummaryModal />;
}

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
            <VocalSandboxProvider key="forced-clean-mount-v2">
              <DuelProvider>
                <BrowserRouter>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/academy" element={<ProtectedRoute element={<Academy />} />} />
                      <Route path="/backstage" element={<ProtectedRoute element={<Backstage />} />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  {/* Modals that rely on Auth/Login/Prime/Duel context */}
                  <LoginModalWrapper />
                  <PrimeSubscriptionModalWrapper />
                  <DuelSummaryModalWrapper />
                </BrowserRouter>
              </DuelProvider>
              {/* Modals that rely on VocalSandbox context (must be inside VocalSandboxProvider) */}
              <VocalSandboxOverlay />
              <PerformanceSummaryModalWrapper />
              <BadgeUnlockedModalWrapper />
            </VocalSandboxProvider>
          </PrimeSubscriptionProvider>
        </LoginModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;