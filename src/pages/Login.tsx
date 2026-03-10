// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Star, LayoutDashboard, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import BasicLobby from "./pages/BasicLobby";
import Academy from "./pages/Academy";
import Lesson from "./pages/Lesson"; 
import Duel from "./pages/Duel";
import Login from "./pages/Login";

const ComingSoon = ({ title, subtitle, bgImage, icon: Icon, color, bgOpacityClass = "opacity-30" }: any) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 text-center">
      <img src={bgImage} alt={title} className={`absolute inset-0 w-full h-full object-cover ${bgOpacityClass}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-0" />
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center animate-in fade-in zoom-in duration-1000 pt-20">
        <div className={`h-24 w-24 rounded-full border border-white/10 bg-black/50 flex items-center justify-center mb-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] ${color}`}>
          <Icon size={48} />
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic drop-shadow-lg">{title}</h1>
        <p className="text-xl text-gray-300 font-medium leading-relaxed mb-12 max-w-2xl">{subtitle}</p>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black h-14 px-8 font-bold transition-all"><ArrowLeft className="mr-2 h-5 w-5" /> Voltar para o Início</Button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🔴 ROTA FULL-SCREEN (FORA DO LAYOUT PADRÃO) */}
        <Route path="/login" element={<Login />} />

        {/* 🟢 TODAS AS OUTRAS ROTAS (DENTRO DO LAYOUT COM O MENU) */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/basic" element={<BasicLobby />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/duel" element={<Duel />} />
              
              <Route path="/talent" element={<ComingSoon title="Next Talent" subtitle="Audições globais estão chegando." bgImage="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2000" icon={Star} color="text-yellow-400" />} />
              <Route path="/backstage" element={<ComingSoon title="Backstage" subtitle="Dashboard premium bloqueado." bgImage="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" icon={LayoutDashboard} color="text-gray-400" bgOpacityClass="opacity-50" />} />
              <Route path="/next-success" element={<ComingSoon title="Next Success" subtitle="Crie hits com IA." bgImage="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2000" icon={Sparkles} color="text-primary" />} />
              <Route path="*" element={<ComingSoon title="Em Breve" subtitle="Página em construção." bgImage="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" icon={Star} color="text-white" />} />
            </Routes>
          </Layout>
        } />

      </Routes>
    </BrowserRouter>
  );
};

export default App;