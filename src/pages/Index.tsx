"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Award, Globe, Medal, Star, Target, MessageCircle, Share2, BookOpen, Clock, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import RegionalTopHits from '@/components/RegionalTopHits';
import TrendSingersFeed from '@/components/TrendSingersFeed';

// Assinatura Única: Restauração Épica Completa - Linha 12: <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
const Index = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* 1. HERO & PRODUTOS (Palco e Logo Centralizado) */}
      <section className="relative h-[110vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
        
        <div className="relative z-10 text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium">Cante, evolua e conquiste o mundo.</p>
        </div>

        {/* 5 Produtos Principais (Anexo 3) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center"><Star className="h-8 w-8 text-primary group-hover:scale-110 mb-4" /><h3 className="font-bold text-white">Solo Online</h3><p className="text-xs text-gray-400">Cante com MVs</p></Card>
          <Card onClick={() => navigate('/library')} className="cursor-pointer group p-6 rounded-2xl border border-white/10 bg-black/60 hover:bg-white/5 transition-all flex flex-col items-center text-center"><Globe className="h-8 w-8 text-white group-hover:scale-110 mb-4" /><h3 className="font-bold text-gray-300">Solo Offline</h3><p className="text-xs text-gray-500">Músicas baixadas (Premium)</p></Card>
          <Card onClick={() => navigate('/duel')} className="cursor-pointer group p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center"><Medal className="h-8 w-8 text-white group-hover:scale-110 mb-4" /><h3 className="font-bold text-white">Dueto / Batalha</h3><p className="text-gray-400 text-xs">Desafie o mundo</p></Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-2xl border border-primary/20 bg-black/60 hover:bg-primary/10 transition-all flex flex-col items-center text-center"><BookOpen className="h-8 w-8 text-primary group-hover:scale-110 mb-4" /><h3 className="font-bold text-white">Vocal Academy</h3><p className="text-xs text-gray-400">Curso de 10 níveis</p></Card>
          <Card className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col items-center text-center"><Lock className="h-8 w-8 text-gray-600 mb-4" /><h3 className="font-bold text-gray-300">Next Talent</h3><p className="text-xs text-gray-500">Vaga aberta em breve</p></Card>
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-4xl mx-auto w-full px-4 -mt-16 mb-24">
        <div className="flex bg-black/80 border border-white/10 rounded-full p-2 items-center backdrop-blur-md">
          <Search className="h-5 w-5 text-gray-400 ml-4 mr-2" />
          <Input placeholder="Busca Avançada: Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-12 text-lg" />
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold px-8 h-12">Buscar</Button>
        </div>
      </section>

      {/* 3. RANKINGS GLOBAIS (O Gabarito do Anexo 2) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-28">
        <h2 className="text-4xl font-black text-primary text-center mb-12 neon-blue-glow tracking-tighter uppercase italic">Rankings Globais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Coluna 1: Global Top 5 */}
          <Card className="bg-black/60 border-primary shadow-[0_0_20px_rgba(0,168,225,0.3)] p-6 rounded-2xl">
            <h3 className="text-xl font-black text-primary text-center mb-6">Global Top 5</h3>
            <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="flex justify-between items-center"><span className="text-white font-bold">{i}. Usuário {i}</span><span className="text-orange-500 font-black">98.{i}</span></div>))}</div>
          </Card>

          {/* Coluna 2: Nacional Top 3 */}
          <Card className="bg-black/60 border-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.3)] p-6 rounded-2xl">
            <h3 className="text-xl font-black text-orange-500 text-center mb-6">Nacional Top 3</h3>
            <div className="space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="flex justify-between items-center"><span className="text-white font-bold">{i}. Usuário BR {i}</span><span className="text-orange-500 font-black">95.{i}</span></div>))}</div>
          </Card>

          {/* Coluna 3: Local Top 2 */}
          <Card className="bg-black/60 border-white/20 p-6 rounded-2xl">
            <h3 className="text-xl font-black text-white text-center mb-6">Local Top 2</h3>
            <div className="space-y-4">{[1, 2].map((i) => (<div key={i} className="flex justify-between items-center"><span className="text-white font-bold">{i}. Vizinho {i}</span><span className="text-orange-500 font-black">93.{i}</span></div>))}</div>
          </Card>

        </div>
      </section>
      
      {/* 4. CONTEÚDOS EXTRAS (Regional e Singers Feed) */}
      <div className="max-w-7xl mx-auto px-4 w-full space-y-24 mb-32">
        <RegionalTopHits />
        <TrendSingersFeed />
      </div>

    </div>
  );
};

export default Index;