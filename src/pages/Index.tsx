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
      
      {/* 1. HERO SECTION (Bateria ao fundo e 5 Pilares) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />

        <div className="relative z-10 text-center mt-10 mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium">A plataforma definitiva para evolução vocal e performance global.</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <div onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Music /></div>
            <div><h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Básico</h3><p className="text-xs text-gray-400">Karaokê tradicional com MVs</p></div>
          </div>
          <div onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><GraduationCap /></div>
            <div><h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Academy</h3><p className="text-xs text-gray-400">Currículo de 10 níveis</p></div>
          </div>
          <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Talent</h3><p className="text-xs text-gray-500">Audições gamificadas</p></div>
          </div>
          <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><LayoutDashboard /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Backstage</h3><p className="text-xs text-gray-500">UI Premium bloqueada</p></div>
          </div>
          <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Sparkles /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Success</h3><p className="text-xs text-gray-500">Espaço do compositor</p></div>
          </div>
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-4xl mx-auto w-full px-4 -mt-8 mb-24">
        <div className="flex bg-black/80 border border-white/10 rounded-full p-2 items-center backdrop-blur-md">
          <Search className="h-5 w-5 text-gray-400 ml-4 mr-2" />
          <Input placeholder="Busca Avançada: Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-12 text-lg w-full" />
          <div className="hidden md:flex gap-4 text-sm text-white font-bold mx-4 whitespace-nowrap">
            <span className="cursor-pointer hover:text-primary">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-primary">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-primary">Inter</span>
          </div>
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold px-8 h-12">Buscar</Button>
        </div>
      </section>

      {/* 3. CONQUISTAS (BADGES) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-orange-500 text-center mb-8 neon-gold-glow drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">Conquistas (Badges)</h2>
        <div className="max-w-2xl mx-auto bg-black/40 border border-primary/30 p-8 rounded-2xl text-center mb-12">
          <h3 className="text-xl font-bold text-primary mb-2">Sign in to track your achievements!</h3>
          <p className="text-gray-400 text-sm">Badges are saved to your profile.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 opacity-60">
          {[{icon: Star, t: 'Early Bird', d: 'First session'}, {icon: Mic2, t: 'Rock Star', d: '5 Rock songs'}, {icon: Trophy, t: 'Duel Master', d: 'Won 10 duels'}, {icon: Medal, t: 'Perfectionist', d: '100% pitch'}, {icon: Globe, t: 'Polyglot', d: '2 languages'}].map((b, i) => (
            <Card key={i} className="bg-black/40 border-white/5 flex flex-col items-center p-6 text-center hover:border-white/20 transition-all cursor-pointer">
              <div className="h-16 w-16 rounded-full border border-gray-600 flex items-center justify-center mb-4"><b.icon className="h-8 w-8 text-gray-400" /></div>
              <h4 className="font-bold text-white mb-2">{b.t}</h4>
              <p className="text-[10px] text-gray-500 mb-4">{b.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. MÚSICAS POR PAÍS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-white text-center mb-12 flex items-center justify-center gap-4"><Globe className="text-primary h-10 w-10" /> Músicas Mais Cantadas por País</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { n: 'Brasil', d: 'Sertanejo, MPB e Samba dominam o topo.', f: '🇧🇷' },
            { n: 'EUA', d: 'Pop, Rock e Country em alta nas paradas.', f: '🇺🇸' },
            { n: 'Japão', d: 'J-Pop e clássicos de Anime são os favoritos.', f: '🇯🇵' },
            { n: 'Reino Unido', d: 'Britpop e Indie Rock lideram as buscas.', f: '🇬🇧' }
          ].map((c, i) => (
            <Card key={i} className="bg-black/40 border-white/10 p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
              <div className="text-6xl mb-6 shadow-xl">{c.f}</div>
              <h3 className="text-2xl font-black text-white mb-4">{c.n}</h3>
              <p className="text-gray-400 text-sm mb-8 flex-grow">{c.d}</p>
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-black font-bold">Explorar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. TREND TOPICS (SINGERS) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white mb-2">Trend Topics (Singers) <span className="text-orange-500">🔥</span></h2>
        <p className="text-gray-400 mb-8 text-sm">Os talentos mais curtidos da semana</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=600', u: '@VocalQueen', s: 'Rolling in the Deep' },
            { img: 'https://images.unsplash.com/photo-1520635360276-857508eec9b1?q=80&w=600', u: '@RockStar_Leo', s: 'Bohemian Rhapsody' },
            { img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f40f?q=80&w=600', u: '@Anya_Sings', s: 'Shallow' },
            { img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600', u: '@JazzMaster_J', s: 'Fly Me to the Moon' }
          ].map((item, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.img})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <p className="font-bold text-white mb-1">{item.u}</p>
                <p className="text-xs text-primary truncate">🎵 {item.s}</p>
              </div>
              <div className="absolute right-4 bottom-20 flex flex-col gap-4 opacity-80">
                <div className="flex flex-col items-center"><Heart className="text-white h-5 w-5" /><span className="text-[10px] text-white mt-1">12k</span></div>
                <div className="flex flex-col items-center"><MessageCircle className="text-white h-5 w-5" /><span className="text-[10px] text-white mt-1">842</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RECENTLY ADDED & TAGS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 space-y-16">
        <div>
          <h2 className="text-3xl font-black text-white mb-8">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: 'Pop Anthem 2024', a: 'Anya Sharma', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300' },
              { t: 'Midnight Jazz', a: 'Marcus King', img: 'https://images.unsplash.com/photo-1520635360276-857508eec9b1?q=80&w=300' },
              { t: 'Rock Ballad', a: 'Chloe Lee', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f40f?q=80&w=300' },
              { t: 'Electro Beat', a: 'DJ Zedd', img: 'https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=300' }
            ].map((item, i) => (
              <Card key={i} className="bg-black/40 border-white/5 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="aspect-square bg-cover bg-center rounded-xl mb-4" style={{ backgroundImage: `url(${item.img})` }} />
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
              { t: 'RockClassics', n: '12.4k', p: '+15%' },
              { t: 'Sertanejo2024', n: '45.1k', p: '+22%' },
              { t: 'VocalAcademyChallenge', n: '8.9k', p: '+40%' }
            ].map((item, i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-between hover:border-primary/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xl">#</div>
                  <div><p className="font-bold text-white">{item.t}</p><p className="text-xs text-gray-500">{item.n} cantores</p></div>
                </div>
                <div className="text-right">
                  <span className="text-green-400 text-xs font-bold">{item.p} ↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RANKINGS GLOBAIS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-primary text-center mb-12 neon-blue-glow tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(0,168,225,0.5)]">Rankings Globais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/60 border-primary shadow-[0_0_20px_rgba(0,168,225,0.2)] p-6 rounded-2xl">
            <h3 className="text-xl font-black text-primary text-center mb-6">Global Top 5</h3>
            <div className="space-y-4">
              {[ {n:'VocalPro_88', s:'98.5'}, {n:'SingStar_JP', s:'97.1'}, {n:'OperaQueen', s:'96.9'}, {n:'MikeDrop', s:'95.8'}, {n:'MelodyX', s:'95.5'} ].map((u, i) => (<div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"><div className="flex gap-3 items-center"><span className="text-gray-500 font-bold text-sm w-4">{i+1}</span><div className="h-8 w-8 rounded-full bg-primary/20" /><span className="text-white font-bold text-sm">{u.n}</span></div><span className="text-orange-500 font-black">{u.s}</span></div>))}
            </div>
          </Card>
          <Card className="bg-black/60 border-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.2)] p-6 rounded-2xl">
            <h3 className="text-xl font-black text-orange-500 text-center mb-6">Nacional Top 3</h3>
            <div className="space-y-4">
              {[ {n:'LocalHero_NY', s:'95.2'}, {n:'TexasTenor', s:'94.8'}, {n:'CaliSinger', s:'94.1'} ].map((u, i) => (<div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"><div className="flex gap-3 items-center"><span className="text-gray-500 font-bold text-sm w-4">{i+1}</span><div className="h-8 w-8 rounded-full bg-orange-500/20" /><span className="text-white font-bold text-sm">{u.n}</span></div><span className="text-orange-500 font-black">{u.s}</span></div>))}
            </div>
          </Card>
          <Card className="bg-black/60 border-white/20 p-6 rounded-2xl">
            <h3 className="text-xl font-black text-white text-center mb-6">Local Top 2</h3>
            <div className="space-y-4">
              {[ {n:'DowntownDiva', s:'93.5'}, {n:'BaritoneBob', s:'92.9'} ].map((u, i) => (<div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"><div className="flex gap-3 items-center"><span className="text-gray-500 font-bold text-sm w-4">{i+1}</span><div className="h-8 w-8 rounded-full bg-white/10" /><span className="text-white font-bold text-sm">{u.n}</span></div><span className="text-orange-500 font-black">{u.s}</span></div>))}
            </div>
          </Card>
        </div>
      </section>

      {/* 8. DASHBOARD & FOOTER */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-black text-primary mb-12 drop-shadow-[0_0_10px_rgba(0,168,225,0.5)] uppercase">Evolução Vocal (Últimas 5 Sessões)</h2>
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
              <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center text-black font-black text-3xl shadow-[0_0_15px_rgba(0,168,225,0.5)]">Ca</div>
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
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase mb-10 drop-shadow-lg">
          CANTE. EVOLUA. <span className="text-primary neon-blue-glow">CONQUISTAR O MUNDO.</span>
        </h2>
        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase">© 2026 KARAOKE PRIME - ALL RIGHTS RESERVED</p>
      </div>

    </div>
  );
};

export default Index;