"use client";

import React from 'react';
import { Play, Zap, Mic2, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdvancedSearch from '@/components/AdvancedSearch';
import RegionalTopHits from '@/components/RegionalTopHits';
import TrendSingersFeed from '@/components/TrendSingersFeed';
import TrendTopicsFeed from '@/components/TrendTopicsFeed';
import RecentlyAdded from '@/components/RecentlyAdded';
import { cn } from '@/lib/utils';

const BasicLobby = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-20" />
        
        <div className="relative z-30 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6">
            <Sparkles className="h-4 w-4" />
            O Palco é Seu
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
            CANTE <span className="text-primary neon-blue-glow">AGORA</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Acesse o maior acervo de karaokês do mundo com diagnóstico vocal por Inteligência Artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/library')}
              className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black text-lg shadow-[0_0_30px_rgba(0,168,225,0.4)] transition-all hover:scale-105"
            >
              <Play className="mr-2 h-6 w-6 fill-current" /> EXPLORAR ACERVO
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/academy')}
              className="h-16 px-10 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-lg"
            >
              <Zap className="mr-2 h-6 w-6 text-accent" /> TREINAR VOZ
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-20 relative z-40 space-y-20">
        {/* Search Section */}
        <AdvancedSearch />

        {/* Quick Stats / Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-pillar p-8 rounded-[2.5rem] border-2 border-primary/20 text-center group hover:border-primary transition-all">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Mic2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Vocal AI Engine</h3>
            <p className="text-gray-400 text-sm">Análise de pitch e estabilidade em tempo real para cada nota que você canta.</p>
          </div>
          <div className="glass-pillar p-8 rounded-[2.5rem] border-2 border-accent/20 text-center group hover:border-accent transition-all">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Globe className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Global Rankings</h3>
            <p className="text-gray-400 text-sm">Suba no ranking mundial e seja descoberto por olheiros na aba Next Talent.</p>
          </div>
          <div className="glass-pillar p-8 rounded-[2.5rem] border-2 border-white/10 text-center group hover:border-white/30 transition-all">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Feedback</h3>
            <p className="text-gray-400 text-sm">Receba dicas personalizadas do nosso instrutor virtual após cada performance.</p>
          </div>
        </div>

        {/* Content Sections */}
        <RecentlyAdded />
        
        <RegionalTopHits />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TrendTopicsFeed />
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              O PRÓXIMO <span className="text-primary">SUCESSO</span> <br />
              PODE SER VOCÊ.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Nossa plataforma não é apenas um karaokê. É uma incubadora de talentos. 
              Cada nota que você canta é processada pelo nosso motor neural para ajudar você a evoluir.
            </p>
            <Button 
              onClick={() => navigate('/talent')}
              className="w-fit h-14 px-8 rounded-xl bg-white text-black font-black hover:bg-gray-200"
            >
              INICIAR CARREIRA <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <TrendSingersFeed />
      </div>
    </div>
  );
};

export default BasicLobby;