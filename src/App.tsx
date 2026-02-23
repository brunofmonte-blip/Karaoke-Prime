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
import SongPlayer from "./pages/SongPlayer";
import Duel from "./pages/Duel";
import { VocalSandboxProvider } from "./hooks/use-vocal-sandbox";
import VocalSandboxOverlay from "./components/VocalSandboxOverlay";
import { PrimeSubscriptionProvider } from "./hooks/use-prime-subscription";
import PrimeSubscriptionModal from "./components/PrimeSubscriptionModal";
import PerformanceSummaryModal from "./components/PerformanceSummaryModal";
import BadgeUnlockedModal from "./components/BadgeUnlockedModal";
import { DuelProvider } from "./hooks/use-duel-engine";
import DuelSummaryModal from "./components/DuelSummaryModal";

const queryClient = new QueryClient();

const LoginModalWrapper = () => {
  const { isModalOpen, closeModal } = useLoginModal();
  return <LoginModal isOpen={isModalOpen} onClose={closeModal} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LoginModalProvider>
          <PrimeSubscriptionProvider>
            <VocalSandboxProvider key="vocal-sandbox-root">
              <BrowserRouter>
                <DuelProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/song/:id" element={<SongPlayer />} />
                      <Route path="/duel" element={<Duel />} />
                      <Route path="/talent" element={<Index />} /> {/* Placeholder for Next Talent */}
                      <Route path="/backstage" element={<ProtectedRoute element={<Backstage />} />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  <LoginModalWrapper />
                  <PrimeSubscriptionModal />
                  <VocalSandboxOverlay />
                  <PerformanceSummaryModal />
                  <BadgeUnlockedModal />
                  <DuelSummaryModal />
                </DuelProvider>
              </BrowserRouter>
            </VocalSandboxProvider>
          </PrimeSubscriptionProvider>
        </LoginModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;