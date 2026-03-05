import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION BLINDADA COM PICSUM */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        <img src="https://picsum.photos/seed/karaokeprime/1920/1080" alt="Studio Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.25]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />

        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">
            A plataforma definitiva para evolução vocal, performance global e criação musical impulsionada por IA.
          </p>
        </div>

        {/* 5 Produtos Principais */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-56 shadow-2xl">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl group-hover:text-primary transition-colors uppercase italic tracking-tighter">Basic</h3><p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">Karaoke tradicional e batalhas online.</p></div>
          </Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-56 shadow-2xl">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><GraduationCap size={24} /></div>
            <div><h3 className="font-black text-white text-xl group-hover:text-primary transition-colors uppercase italic tracking-tighter">Academy</h3><p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">10 níveis com Diagnóstico Vocal AI.</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Next Talent</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Audições gamificadas pelo mundo.</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><LayoutDashboard size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Backstage</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Dashboard avançado bloqueado.</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Sparkles size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Next Success</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Transforme ideias em músicas IA.</p></div>
          </Card>
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-12 mb-32">
        <div className="flex bg-zinc-900 border border-white/10 rounded-full p-2 items-center shadow-2xl animate-in fade-in duration-1000">
          <Search className="h-6 w-6 text-primary ml-6 mr-3" />
          <Input placeholder="Busca Avançada: Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-16 text-lg w-full font-medium" />
          <div className="hidden md:flex gap-6 text-sm text-white font-black uppercase tracking-widest mx-8 whitespace-nowrap">
            <span className="cursor-pointer text-primary">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Inter</span>
          </div>
          <Button className="rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest px-12 h-16 transition-colors">Buscar</Button>
        </div>
      </section>

      {/* 3. CONQUISTAS E RANKINGS (RESUMO RÁPIDO PARA GARANTIR RENDERIZAÇÃO) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-5xl font-black text-white text-center mb-16 italic tracking-tighter uppercase drop-shadow-lg">
          Mural de <span className="text-orange-500 neon-gold-glow">Conquistas</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            {icon: Star, t: 'Early Bird', d: 'Primeira sessão concluída.', c: 'text-primary border-primary'},
            {icon: Mic2, t: 'Rock Star', d: '5 músicas em Rock Classics.', c: 'text-orange-500 border-orange-500'},
            {icon: Trophy, t: 'Duel Master', d: 'Venceu 10 batalhas.', c: 'text-primary border-primary'},
            {icon: Medal, t: 'Perfect Pitch', d: '100% precisão de tom.', c: 'text-orange-500 border-orange-500'},
            {icon: Globe, t: 'Polyglot', d: 'Cantou em dois idiomas.', c: 'text-primary border-primary'}
          ].map((b, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 flex flex-col items-center p-8 text-center hover:border-white/30 transition-all rounded-[2rem]">
              <div className={`h-20 w-20 rounded-full border-2 flex items-center justify-center mb-6 shadow-xl bg-black ${b.c}`}><b.icon className="h-10 w-10" /></div>
              <h4 className="font-black text-white mb-2 text-lg italic uppercase">{b.t}</h4>
              <p className="text-xs text-gray-500 font-medium">{b.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. RODAPÉ DE DESTAQUE */}
      <div className="text-center pb-24 pt-16 border-t border-white/10 bg-zinc-950">
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase mb-10 drop-shadow-lg">
          CANTE. EVOLUA. <span className="text-primary neon-blue-glow">CONQUISTE.</span>
        </h2>
        <p className="text-xs text-gray-500 font-black tracking-[0.3em] uppercase">© 2026 KARAOKE PRIME - ALL RIGHTS RESERVED</p>
      </div>

    </div>
  );
};

export default Index;