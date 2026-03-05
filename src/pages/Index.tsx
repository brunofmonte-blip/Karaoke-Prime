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
      
      {/* 1. HERO SECTION */}
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

      {/* 3. CONQUISTAS (BADGES) */}
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

      {/* 4. MÚSICAS POR PAÍS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-white text-center mb-12 flex items-center justify-center gap-4 uppercase italic tracking-tighter"><Globe className="text-primary h-10 w-10" /> Músicas Mais Cantadas por País</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { n: 'Brasil', s: 'BR', d: 'Sertanejo, MPB e Samba dominam o topo.', f: 'https://flagcdn.com/w160/br.png' },
            { n: 'EUA', s: 'US', d: 'Pop, Rock e Country em alta nas paradas.', f: 'https://flagcdn.com/w160/us.png' },
            { n: 'Japão', s: 'JP', d: 'J-Pop e clássicos de Anime são os favoritos.', f: 'https://flagcdn.com/w160/jp.png' },
            { n: 'Reino Unido', s: 'GB', d: 'Britpop e Indie Rock lideram as buscas.', f: 'https://flagcdn.com/w160/gb.png' }
          ].map((c, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors rounded-[2rem]">
              <img src={c.f} alt={c.n} className="w-20 h-14 object-cover rounded-md mb-6 shadow-xl border border-white/10" />
              <h2 className="text-4xl font-black text-white mb-2 italic">{c.s}</h2>
              <h3 className="text-xl font-bold text-gray-300 mb-4">{c.n}</h3>
              <p className="text-gray-500 text-sm mb-8 flex-grow">{c.d}</p>
              <Button className="w-full rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest">Explorar <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. TREND TOPICS (SINGERS) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Trend Topics (Singers) <span className="text-orange-500">🔥</span></h2>
        <p className="text-gray-400 mb-8 text-sm font-medium uppercase tracking-widest">Os talentos mais curtidos da semana</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { img: 'https://picsum.photos/seed/singer1/600/800', av: 'https://picsum.photos/seed/av1/150/150', u: '@VocalQueen', s: 'Rolling in the Deep' },
            { img: 'https://picsum.photos/seed/singer2/600/800', av: 'https://picsum.photos/seed/av2/150/150', u: '@RockStar_Leo', s: 'Bohemian Rhapsody' },
            { img: 'https://picsum.photos/seed/singer3/600/800', av: 'https://picsum.photos/seed/av3/150/150', u: '@Anya_Sings', s: 'Shallow' },
            { img: 'https://picsum.photos/seed/singer4/600/800', av: 'https://picsum.photos/seed/av4/150/150', u: '@JazzMaster_J', s: 'Fly Me to the Moon' }
          ].map((item, i) => (
            <div key={i} className="relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 bg-zinc-900 shadow-2xl">
              <img src={item.img} alt={item.u} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end z-10">
                <div className="flex items-center gap-3 mb-3">
                   <img src={item.av} alt={item.u} className="h-10 w-10 rounded-full border-2 border-primary bg-black" />
                   <p className="font-black text-white text-sm">{item.u}</p>
                </div>
                <p className="text-xs text-primary font-bold uppercase tracking-widest truncate">🎵 {item.s}</p>
              </div>
              <div className="absolute right-4 bottom-24 flex flex-col gap-6 opacity-90 z-10">
                <div className="flex flex-col items-center"><Heart className="text-white hover:text-destructive transition-colors h-7 w-7" /><span className="text-[10px] text-white mt-1 font-bold">12k</span></div>
                <div className="flex flex-col items-center"><MessageCircle className="text-white h-7 w-7" /><span className="text-[10px] text-white mt-1 font-bold">842</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RECENTLY ADDED E TAGS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Recently Added</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { t: 'Evidências', a: 'Chitãozinho & Xororó', img: 'https://picsum.photos/seed/sertanejo/300/300' },
              { t: 'Tennessee Whiskey', a: 'Chris Stapleton', img: 'https://picsum.photos/seed/country/300/300' },
              { t: 'Coração Radiante', a: 'Grupo Revelação', img: 'https://picsum.photos/seed/pagode/300/300' },
              { t: 'Electro Beat', a: 'DJ Zedd', img: 'https://picsum.photos/seed/electro/300/300' }
            ].map((item, i) => (
              <Card key={i} className="bg-zinc-950 border-white/5 p-4 hover:bg-white/5 transition-colors cursor-pointer rounded-2xl">
                <div className="aspect-square rounded-xl mb-4 overflow-hidden relative">
                  <img src={item.img} alt={item.t} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <h4 className="font-black text-white text-base truncate">{item.t}</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2 italic uppercase tracking-tighter">
            Trend Topics (Tags) <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xl">#</span>
          </h2>
          <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-bold">Os gêneros mais comentados</p>
          <div className="flex flex-col gap-4">
            {[
              { t: 'Sertanejo2026', n: '45.1k', p: '+22%', av:'https://picsum.photos/seed/tag1/200/200' },
              { t: 'RockClassics', n: '12.4k', p: '+15%', av:'https://picsum.photos/seed/tag2/200/200' },
              { t: 'VocalAcademyChallenge', n: '8.9k', p: '+40%', av:'https://picsum.photos/seed/tag3/200/200' },
              { t: 'AnimeHits', n: '15.2k', p: '+5%', av:'https://picsum.photos/seed/tag4/200/200' }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-950 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-primary/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-5">
                  <div className="relative h-14 w-14 rounded-xl border border-primary/20 overflow-hidden flex items-center justify-center text-white font-black bg-black">
                     <img src={item.av} alt="tag background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                     <span className="relative z-10 text-xl">#</span>
                  </div>
                  <div><p className="font-black text-white text-base">{item.t}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{item.n} cantores</p></div>
                </div>
                <div className="text-right"><span className="text-green-400 text-sm font-black bg-green-400/10 px-3 py-1 rounded-full">{item.p} ↗</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RANKINGS GLOBAIS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-5xl font-black text-primary text-center mb-16 drop-shadow-[0_0_15px_rgba(0,168,225,0.5)] uppercase italic tracking-tighter">Rankings Globais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-zinc-950 border-primary shadow-[0_0_30px_rgba(0,168,225,0.15)] p-8 rounded-[2rem]">
            <h3 className="text-2xl font-black text-primary text-center mb-8 uppercase italic tracking-tighter">Global Top 5</h3>
            <div className="space-y-6">