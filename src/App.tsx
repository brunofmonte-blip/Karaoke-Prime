import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Star, LayoutDashboard, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import BasicLobby from "./pages/BasicLobby";
import Academy from "./pages/Academy";

// 💡 O TRUQUE: O componente ComingSoon está aqui dentro para não precisar de arquivo novo!
const ComingSoon = ({ title, subtitle, bgImage, icon: Icon, color, bgOpacityClass = "opacity-30" }: any) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 text-center">
      {/* Correção de Fundo: NEXT TALENT e NEXT SUCCESS com novas imagens. BACKSTAGE com opacidade clareada. */}
      <img src={bgImage} alt={title} className={`absolute inset-0 w-full h-full object-cover ${bgOpacityClass}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-0" />
      
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <div className={`h-24 w-24 rounded-full border border-white/10 bg-black/50 flex items-center justify-center mb-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] ${color}`}>
          <Icon size={48} />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic drop-shadow-lg">
          {title}
        </h1>
        
        <div className="inline-block px-6 py-2 border border-primary/50 bg-primary/10 rounded-full mb-8 text-primary font-bold tracking-widest uppercase text-sm neon-blue-glow">
          Em Desenvolvimento
        </div>
        
        <p className="text-xl text-gray-300 font-medium leading-relaxed mb-12 max-w-2xl">
          {subtitle}
        </p>
        
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black h-14 px-8 font-bold transition-all">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para o Início
        </Button>
      </div>
    </div>
  );
};

// Aqui é o menu principal apontando para as telas
const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/basic" element={<BasicLobby />} />
        <Route path="/academy" element={<Academy />} />
        
        {/* Telas de Expectativa com as correções de imagem aplicadas */}
        <Route path="/talent" element={
          <ComingSoon 
            title="Next Talent" 
            subtitle="O palco global aguarda por você. Prepare-se para audições gamificadas que vão transformar sua carreira." 
            bgImage="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2000" // Correção: Nova Imagem de Fundo
            icon={Star} 
            color="text-yellow-400" 
          />
        } />
        
        <Route path="/backstage" element={
          <ComingSoon 
            title="Backstage" 
            subtitle="Seu QG de evolução vocal. Um dashboard premium para analisar cada detalhe da sua voz está chegando." 
            bgImage="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" // Mesma imagem
            icon={LayoutDashboard} 
            color="text-gray-400" 
            bgOpacityClass="opacity-50" // Correção: Clarear fundo de 30% para 50%
          />
        } />
        
        <Route path="/next-success" element={
          <ComingSoon 
            title="Next Success" 
            subtitle="Deixe a Inteligência Artificial compor o seu próximo hit. O espaço definitivo para transformar ideias em músicas." 
            bgImage="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2000" // Correção: Partitura e Violão
            icon={Sparkles} 
            color="text-primary" 
          />
        } />
        
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
2️⃣ Restaurar o Basic Lobby (src/pages/BasicLobby.tsx)
Este código abaixo foi reescrito para usar a mesma tag <img> blindada que funcionou na Home Page. Isso vai forçar o DYAD a carregar a imagem e acabar com a tela preta.

Abra src/pages/BasicLobby.tsx, apague absolutamente tudo e cole este código:

TypeScript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative">
      {/* 💡 A BLINDAGEM: Usando tag <img> blindada em vez de background-image no CSS */}
      <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.2]" />
      <div className="absolute inset-0 bg-black/80 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Voltar para Home</button>
        <h1 className="text-4xl md:text-5xl font-black text-primary neon-blue-glow mb-2 tracking-tighter">Lobby de Karaokê</h1>
        <p className="text-white font-bold uppercase tracking-widest mb-10 text-sm">Escolha o modo de jogo</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => navigate('/library')} className="group cursor-pointer p-8 rounded-2xl border border-primary/50 bg-black/40 hover:bg-primary/10 transition-all flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,168,225,0.2)]">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Globe className="h-8 w-8 text-primary" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Solo Online</h3><p className="text-gray-400 text-xs">Cante com o catálogo completo do YouTube.</p>
          </div>
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-70">
            <div className="absolute top-4 right-4 text-orange-500">🔒</div>
            <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4"><Download className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Solo Offline</h3><p className="text-gray-500 text-xs">Músicas baixadas (Premium).</p>
          </div>
          <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-2xl border border-white/10 bg-black/40 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-8 w-8 text-white group-hover:text-destructive" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Dueto / Batalha</h3><p className="text-gray-400 text-xs">Cante com um amigo ou desafie o mundo.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Qual música vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && query.trim() && navigate('/library')} className="pl-12 h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};
export default BasicLobby;
3️⃣ Restaurar o Academy (src/pages/Academy.tsx)
Mesma coisa aqui: apliquei a blindagem da tag <img> para forçar o carregamento do fundo do Academy e eliminar a tela preta.

Abra src/pages/Academy.tsx, apague absolutamente tudo e cole este código:

TypeScript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative pb-20 pt-28 px-4">
      {/* 💡 A BLINDAGEM: Usando tag <img> blindada em vez de background-image no CSS */}
      <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.1]" />
      <div className="absolute inset-0 bg-black/90 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Voltar para Home</button>
        
        <div className="text-center mb-16">
          <GraduationCap className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-lg">VOCAL <span className="text-primary">ACADEMY</span></h1>
          <p className="text-gray-400 mt-6 uppercase tracking-widest text-sm font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/40 border-primary/20"><CardContent className="p-6 flex items-center gap-4"><Trophy className="text-primary h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Nível Atual</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
          <Card className="bg-black/40 border-orange-500/20"><CardContent className="p-6 flex items-center gap-4"><Star className="text-orange-500 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">XP Acumulado</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
          <Card className="bg-black/40 border-white/10"><CardContent className="p-6 flex items-center gap-4"><BookOpen className="text-gray-400 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Lições Concluídas</p><p className="text-3xl font-black text-white">0 / 10</p></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/60 border-primary shadow-[0_0_15px_rgba(0,168,225,0.2)] flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary">Nível 1: Steady Breath</h3>
                <span className="text-[10px] px-2 py-1 rounded-full border border-primary text-primary">Foco Atual</span>
              </div>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Mastering diaphragmatic breathing for sustained notes.</p>
              <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90"><PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lição</Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex flex-col relative opacity-60">
            <CardContent className="p-6 flex-grow flex flex-col">
              <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
              <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 2: Pitch Calibration</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Introduction to hitting target notes accurately.</p>
              <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex flex-col relative opacity-60">
            <CardContent className="p-6 flex-grow flex flex-col">
              <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
              <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 3: Rhythm Basics</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Keeping time and syncing vocals with tracks.</p>
              <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Academy;