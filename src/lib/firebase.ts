import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// 1. Telas que NÓS consertamos e sabemos que estão perfeitas:
import Index from "./pages/Index";
import BasicLobby from "./pages/BasicLobby";
import Academy from "./pages/Academy";
import Duel from "./pages/Duel";

// 2. Criamos uma tela "Falsa" para proteger o site das telas que o DYAD quebrou.
// Se você clicar em algo e ver essa tela preta, já sabemos qual arquivo o DYAD apagou!
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <h1 className="text-2xl font-bold text-white uppercase tracking-widest border border-white/20 p-8 rounded-2xl bg-white/5">
      Página {name} em Recuperação 🚧
    </h1>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Rotas Seguras */}
            <Route path="/" element={<Index />} />
            <Route path="/basic" element={<BasicLobby />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/duel" element={<Duel />} />
            
            {/* Rotas Blindadas (Evitam a Tela Preta Geral) */}
            <Route path="/library" element={<Placeholder name="Solo Online (Library)" />} />
            <Route path="/duel-invite" element={<Placeholder name="Convite de Duelo" />} />
            <Route path="/duel-room" element={<Placeholder name="Arena de Duelo" />} />
            <Route path="/talent" element={<Placeholder name="Next Talent" />} />
            <Route path="/backstage" element={<Placeholder name="Backstage" />} />
            <Route path="/next-success" element={<Placeholder name="Next Success" />} />
            <Route path="/premium" element={<Placeholder name="Premium" />} />
            <Route path="/lesson" element={<Placeholder name="Lição do Academy" />} />
            <Route path="/login" element={<Placeholder name="Login" />} />
            <Route path="*" element={<Placeholder name="Não Encontrada" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;