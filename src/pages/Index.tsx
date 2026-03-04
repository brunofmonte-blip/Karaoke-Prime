"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 font-sans">
      
      {/* 1. HERO SECTION (Bateria ao fundo e Texto Correto - Clareado em ~5%) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        {/* Usando uma imagem de estúdio musical/bateria - Clareado de opacity-30 para opacity-55 */}
        <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000')" }} />
        {/* Removido o bg-gradient preto pesado para clarear */}
        <div className="absolute inset-0 z-0" />

        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">
            A plataforma definitiva para evolução vocal, performance global e criação musical impulsionada por IA.
          </p>
        </div>

        {/* 5 Produtos Principais (Alinhamento Canto Superior Esquerdo - Anexo 1) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-48">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Music size={20} /></div>
            <div><h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Básico</h3><p className="text-xs text-gray-400">Karaokê tradicional com MVs</p></div>
          </Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-48">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><GraduationCap size={20} /></div>
            <div><h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Academy</h3><p className="text-xs text-gray-400">Currículo de 10 níveis</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col justify-between h-48 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4" />
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star size={20} /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Talent</h3><p className="text-xs text-gray-500">Audições e Carreira</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col justify-between h-48 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4" />
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><LayoutDashboard size={20} /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Backstage</h3><p className="text-xs text-gray-500">Seu Dashboard Vocal</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col justify-between h-48 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4" />
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Sparkles size={20} /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Success</h3><p className="text-xs text-gray-500">Composição com IA</p></div>
          </Card>
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA (Layout Fino e Transparente) */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-8 mb-24">
        <div className="flex bg-black/40 border border-white/20 rounded-full p-2 items-center backdrop-blur-md animate-in fade-in duration-1000">
          <Search className="h-5 w-5 text-gray-400 ml-4 mr-2" />
          <Input placeholder="Busca Avançada: Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-12 text-base w-full" />
          <div className="hidden md:flex gap-5 text-sm text-white font-bold mx-6 whitespace-nowrap">
            <span className="cursor-pointer text-white">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Inter</span>
          </div>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold px-10 h-12">Buscar</Button>
        </div>
      </section>

      {/* 3. CONQUISTAS (BADGES - Coloridos - Anexo 2) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-orange-500 text-center mb-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.7)] neon-gold-glow">Conquistas (Badges)</h2>
        <div className="max-w-2xl mx-auto bg-black/40 border border-primary/30 p-8 rounded-2xl text-center mb-12">
          <h3 className="text-xl font-bold text-primary mb-2">Sign in to track your achievements!</h3>
          <p className="text-gray-400 text-sm">Badges are saved to your profile.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            {icon: Star, t: 'Early Bird', c: 'text-primary border-primary neon-blue-glow'},
            {icon: Mic2, t: 'Rock Star', c: 'text-orange-500 border-orange-500 neon-gold-glow'},
            {icon: Trophy, t: 'Duel Master', c: 'text-primary border-primary neon-blue-glow'},
            {icon: Medal, t: 'Perfectionist', c: 'text-orange-500 border-orange-500 neon-gold-glow'},
            {icon: Globe, t: 'Polyglot', c: 'text-primary border-primary neon-blue-glow'}
          ].map((b, i) => (
            <Card key={i} className={`bg-black/40 border-white/5 flex flex-col items-center p-6 text-center hover:border-white/20 transition-all cursor-pointer`}>
              <div className={`h-16 w-16 rounded-full border flex items-center justify-center mb-6 shadow-xl ${b.c}`}><b.icon className="h-8 w-8" /></div>
              <h4 className="font-bold text-white mb-3 text-sm">{b.t}</h4>
              <div className="h-1 w-8 bg-gray-700 rounded-full"></div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. MÚSICAS POR PAÍS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 space-y-12">
        <RegionalTopHits />
      </section>

      {/* 5. TREND TOPICS (SINGERS - Com Imagens e Avatares - Anexo 3) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white mb-2">Trend Topics (Singers) <span className="text-orange-500">🔥</span></h2>
        <p className="text-gray-400 mb-8 text-sm">Os talentos mais curtidos da semana</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=600', av: 'https://randomuser.me/api/portraits/women/44.jpg', u: '@VocalQueen', s: 'Rolling in the Deep' },
            { img: 'https://images.unsplash.com/photo-1520635360276-857508eec9b1?q=80&w=600', av: 'https://randomuser.me/api/portraits/men/32.jpg', u: '@RockStar_Leo', s: 'Bohemian Rhapsody' },
            { img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f40f?q=80&w=600', av: 'https://randomuser.me/api/portraits/women/68.jpg', u: '@Anya_Sings', s: 'Shallow' },
            { img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600', av: 'https://randomuser.me/api/portraits/men/88.jpg', u: '@JazzMaster_J', s: 'Fly Me to the Moon' }
          ].map((item, i) => (
            <div key={i} className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.img})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                   <img src={item.av} alt={item.u} className="h-8 w-8 rounded-full border border-white/10" />
                   <p className="font-bold text-white text-sm">{item.u}</p>
                </div>
                <p className="text-xs text-primary truncate">🎵 {item.s}</p>
              </div>
              <div className="absolute right-4 bottom-20 flex flex-col gap-6 opacity-90">
                <div className="flex flex-col items-center"><Heart className="text-white h-6 w-6" /><span className="text-[10px] text-white mt-1">12.5k</span></div>
                <div className="flex flex-col items-center"><MessageCircle className="text-white h-6 w-6" /><span className="text-[10px] text-white mt-1">842</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RECENTLY ADDED (Com Imagens e Novos Gêneros - Anexo 4) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 space-y-16">
        <div>
          <h2 className="text-3xl font-black text-white mb-8">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: 'Evidências', a: 'Chitãozinho & Xororó', img: 'https://images.unsplash.com/photo-1583796541783-a970e7a685e9?q=80&w=300' },
              { t: 'Tennessee Whiskey', a: 'Chris Stapleton', img: 'https://images.unsplash.com/photo-1520635360276-857508eec9b1?q=80&w=300' },
              { t: 'Coração Radiante', a: 'Grupo Revelação', img: 'https://images.unsplash.com/photo-1563214372-97b77051a89c?q=80&w=300' },
              { t: 'Electro Beat', a: 'DJ Zedd', img: 'https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=300' }
            ].map((item, i) => (
              <Card key={i} className="bg-black/40 border-white/5 p-4 hover:bg-white/5 transition-colors cursor-pointer rounded-xl">
                <div className="aspect-square bg-cover bg-center rounded-xl mb-4 border border-white/10" style={{ backgroundImage: `url(${item.img})` }} />
                <h4 className="font-bold text-white text-sm truncate">{item.t}</h4>
                <p className="text-xs text-gray-500">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">Trend Topics (Tags) <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xl">#</span></h2>
          <p className="text-gray-400 mb-8 text-sm">Os gêneros e desafios mais comentados da comunidade</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: 'Sertanejo2024', n: '45.1k', p: '+22%', av:'https://images.unsplash.com/photo-1583796541783-a970e7a685e9?q=80&w=600' },
              { t: 'RockClassics', n: '12.4k', p: '+15%', av:'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f40f?q=80&w=600' },
              { t: 'VocalAcademyChallenge', n: '8.9k', p: '+40%', av:'https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=600' }
            ].map((item, i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-between hover:border-primary/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <img src={item.av} alt={item.t} className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20" />
                  <div><p className="font-bold text-white text-sm">{item.t}</p><p className="text-xs text-gray-500">{item.n} cantores</p></div>
                </div>
                <div className="text-right"><span className="text-green-400 text-xs font-bold">{item.p} ↗</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RANKINGS GLOBAIS (Com Fotos Reais - Anexo 6) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 space-y-12">
        <GlobalRankings />
      </section>

      {/* 8. DASHBOARD & FOOTER */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-black text-primary mb-12 uppercase drop-shadow-[0_0_10px_rgba(0,168,225,0.5)]">Evolução Vocal (Últimas 5 Sessões)</h2>
          <div className="text-center space-y-4 bg-black/40 border border-white/10 p-12 rounded-3xl">
            <div className="h-20 w-20 rounded-full border border-primary mx-auto flex items-center justify-center text-primary bg-primary/10 mb-6"><Music className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold text-white">Bem-vindo ao seu Dashboard!</h3>
            <p className="text-gray-400">Sua jornada vocal começa aqui. Cante sua primeira música para gerar os gráficos!</p>
            <p className="text-orange-500 font-bold uppercase tracking-widest text-sm pt-6 flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" /> IA Pronta para Analisar</p>
          </div>
        </div>
        <Card className="bg-black/40 border-white/10 rounded-3xl h-full">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
              <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Ca" className="h-20 w-20 bg-primary rounded-full flex items-center justify-center text-black font-black text-3xl shadow-[0_0_15px_rgba(0,168,225,0.5)] border border-primary/30" />
              <div><h3 className="text-2xl font-bold text-white mb-1">Cantor Convidado</h3><p className="text-orange-500 text-sm font-bold tracking-widest uppercase">Prime Member</p></div>
            </div>
            <div className="space-y-6 text-base text-gray-300">
              <div className="flex justify-between py-3 border-b border-white/5"><span className="flex items-center gap-3"><Star className="h-5 w-5 text-orange-500"/> Melhor Nota</span><span className="font-bold text-white">0.0%</span></div>
              <div className="flex justify-between py-3 border-b border-white/5"><span className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-orange-500"/> Nível Academy</span><span className="font-bold text-white">0</span></div>
              <div className="flex justify-between py-3 border-b border-white/5"><span className="flex items-center gap-3"><Trophy className="h-5 w-5 text-orange-500"/> Ranking Online</span><span className="font-bold text-white">9999</span></div>
              <div className="flex justify-between py-3 border-b border-white/5"><span className="flex items-center gap-3"><Medal className="h-5 w-5 text-orange-500"/> Ranking Offline</span><span className="font-bold text-white">9999</span></div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Badges Earned (0)</p>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full border border-orange-500/50 flex items-center justify-center opacity-30"><Medal className="h-5 w-5 text-orange-500" /></div>
                <div className="h-10 w-10 rounded-full border border-primary/50 flex items-center justify-center opacity-30"><Star className="h-5 w-5 text-primary" /></div>
                <div className="h-10 w-10 rounded-full border border-destructive/50 flex items-center justify-center opacity-30"><Mic2 className="h-5 w-5 text-destructive" /></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="text-center pb-20 pt-10 border-t border-white/5">
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase mb-10 drop-shadow-lg animate-in fade-in duration-1000">
          CANTE. EVOLUA. <span className="text-primary neon-blue-glow">CONQUISTAR O MUNDO.</span>
        </h2>
        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase">© 2026 KARAOKE PRIME - ALL RIGHTS RESERVED</p>
      </div>

    </div>
  );
};

// Componentes Mockados para garantir que o código rode no DYAD sem erros de importação
const RegionalTopHits = () => (
    <Card className="bg-black/60 border-white/10 p-12 rounded-3xl text-center"><h3 className="text-xl font-black text-white mb-6 uppercase">Regional Top Hits</h3><p className="text-gray-400 text-sm">Carregando dados regionais...</p></Card>
);

const GlobalRankings = () => (
    <Card className="bg-black/60 border-primary/30 p-12 rounded-3xl text-center"><h3 className="text-xl font-black text-primary mb-6 uppercase">Rankings Globais</h3><p className="text-gray-400 text-sm">Carregando rankings globais...</p></Card>
);

export default Index;