import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

// 📦 Importação de todas as páginas do MVP
import Index from "./pages/Index";
import Login from "./pages/Login";
import Academy from "./pages/Academy";
import Backstage from "./pages/Backstage";
import BasicLobby from "./pages/BasicLobby";
import Duel from "./pages/Duel";
import DuelInviteLobby from "./pages/DuelInviteLobby";
import DuelRoom from "./pages/DuelRoom";
import KaraokeRoom from "./pages/KaraokeRoom";
import Lesson from "./pages/Lesson";
import Library from "./pages/Library";
import NextSuccess from "./pages/NextSuccess";
import Premium from "./pages/Premium";
import ScoreResult from "./pages/ScoreResult";
import SongPlayer from "./pages/SongPlayer";
import Talent from "./pages/Talent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Rotas Principais */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/basic" element={<BasicLobby />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/backstage" element={<Backstage />} />
          <Route path="/next-success" element={<NextSuccess />} />
          
          {/* Rotas de Funcionalidades */}
          <Route path="/library" element={<Library />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/score" element={<ScoreResult />} />
          
          {/* Rotas Dinâmicas (Precisam de um ID para funcionar) */}
          <Route path="/play/:id" element={<SongPlayer />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/karaoke/:id" element={<KaraokeRoom />} />
          <Route path="/duel" element={<Duel />} />
          <Route path="/duel-invite" element={<DuelInviteLobby />} />
          <Route path="/duel-room/:id" element={<DuelRoom />} />

          {/* Rota de Segurança 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;  