import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🚨 TODOS OS ÍCONES IMPORTADOS CORRETAMENTE
import { 
  Mic2, GraduationCap, Globe2, LayoutGrid, Sparkles, 
  Star, Trophy, Medal, PlayCircle, Lock, ArrowRight, 
  Search, Hash, Flame, Clock, Activity, User, ChevronRight 
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeRegion, setActiveRegion] = useState<'BR' | 'US' | 'UK' | 'JP'>('BR');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ============================================================================
  // DADOS SEMENTE (FAKE DATA)
  // ============================================================================
  const regionalHits = {
    BR: [
      { title: "Evidências", artist: "Chitãozinho & Xororó", plays: "1.2M" },
      { title: "Na Sua Estante", artist: "Rita Lee", plays: "850K" },
      { title: "Deixa Acontecer", artist: "NX Zero", plays: "720K" }
    ],
    US: [
      { title: "Bohemian Rhapsody", artist: "Queen", plays: "3.4M" },
      { title: "Shallow", artist: "Lady Gaga", plays: "2.1M" },
      { title: "I Will Always Love You", artist: "Whitney Houston", plays: "1.9M" }
    ],
    UK: [
      { title: "Someone Like You", artist: "Adele", plays: "2.8M" },
      { title: "Wonderwall", artist: "Oasis", plays: "2.2M" },
      { title: "Don't Look Back In Anger", artist: "Oasis", plays: "1.5M" }
    ],
    JP: [
      { title: "Gurenge (Demon Slayer)", artist: "LiSA", plays: "4.1M" },
      { title: "Pretender", artist: "Official HIGE DANdism", plays: "2.9M" },
      { title: "Lemon", artist: "Kenshi Yonezu", plays: "2.5M" }
    ]
  };

  const fakeTrendActivity = [
    { user: "@VocalStar_BR", song: "Como Nossos Pais - Elis Regina", time: "Agora mesmo", score: "98%" },
    { user: "@John_Belt", song: "Listen - Beyoncé", time: "Há 2 min", score: "92%" },
    { user: "@Yumi_Tokyo", song: "First Love - Utada Hikaru", time: "Há 5 min", score: "99%" },
    { user: "@MariaClara_V", song: "Chandelier - Beyoncé", time: "Há 12 min", score: "95%" }
  ];

  const recentlyAdded = [
    { title: "Flowers (Acoustic)", artist: "Miley Cyrus", badge: "NOVO" },
    { title: "Vampire", artist: "Olivia Rodrigo", badge: "ALTA QUALIDADE" },
    { title: "Kill Bill", artist: "SZA", badge: "POPULAR" },
    { title: "Erro Gostoso", artist: "Simone Mendes", badge: "NOVO" }
  ];

  const fakeRanking = [
    { rank: 1, name: "Yumi_Tokyo", score: "15.420", tier: "Diamante" },
    { rank: 2, name: "MariaClara_V", score: "14.890", tier: "Platina" },
    { rank: 3, name: "John_Belt", score: "13.200", tier: "Platina" },
    { rank: 4, name: "VocalStar_BR", score: "12.500", tier: "Ouro" },
    { rank: 412, name: user?.displayName?.split(' ')[0] || "Você", score: "1.250", tier: "Iniciante", isMe: true }
  ];

  const trendTags = ["#BeltChallenge", "#SertanejoPrime", "#SopranoVibes", "#RockDrive", "#Acustico"];

  return (
    <div className="min-h-screen bg-black font-sans text-white pb-24 overflow-x-hidden">
      
      {/* 1. HERO SECTION & MAIN CARDS */}
      <div className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        
        {/* 🚨 CORREÇÃO 1: BACKGROUND COM ESTÚDIO VISÍVEL E 15% MAIS CLARO */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" 
            alt="Studio Background" 
            className="w-full h-full object-cover opacity-40" 
          />
          {/* Gradiente que desce de transparente para preto para fundir com a página */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">PRIME</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium mb-16 max-w-2xl mx-auto">
            A plataforma definitiva para evolução vocal e performance global.
          </p>

          {/* AS 5 CAIXAS PRINCIPAIS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 text-left">
            
            <Card onClick={() => navigate('/basic')} className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-6 rounded-3xl cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group">
              <div className="h-10 w-10 rounded-xl border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10">
                <Mic2 className="text-cyan-400 h-5 w-5" />
              </div>
              <h3 className="font-black italic text-lg uppercase text-white mb-2">BASIC</h3>
              <p className="text-[9px] text-gray-500 uppercase font-bold leading-relaxed">KARAOKÊ TRADICIONAL,<br/>BATALHAS E DUETOS.</p>
            </Card>

            <Card onClick={() => navigate('/academy')} className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-6 rounded-3xl cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group">
              <div className="h-10 w-10 rounded-xl border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10">
                <GraduationCap className="text-cyan-400 h-5 w-5" />
              </div>
              <h3 className="font-black italic text-lg uppercase text-white mb-2">ACADEMY</h3>
              <p className="text-[9px] text-gray-500 uppercase font-bold leading-relaxed">TREINAMENTO PROFISSIONAL<br/>COMPLETO.</p>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl opacity-60 cursor-not-allowed">
              <div className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center mb-6 relative">
                <Globe2 className="text-gray-500 h-5 w-5" />
                <Lock size={10} className="absolute -top-1 -right-1 text-gray-500" />
              </div>
              <h3 className="font-black italic text-lg uppercase text-gray-400 mb-2">NEXT TALENT</h3>
              <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">AUDIÇÕES GLOBAIS</p>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl opacity-60 cursor-not-allowed">
              <div className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center mb-6 relative">
                <LayoutGrid className="text-gray-500 h-5 w-5" />
                <Lock size={10} className="absolute -top-1 -right-1 text-gray-500" />
              </div>
              <h3 className="font-black italic text-lg uppercase text-gray-400 mb-2">BACKSTAGE</h3>
              <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">DASHBOARD PRO</p>
            </Card>

            <Card className="bg-black/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl opacity-60 cursor-not-allowed">
              <div className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center mb-6 relative">
                <Sparkles className="text-gray-500 h-5 w-5" />
                <Lock size={10} className="absolute -top-1 -right-1 text-gray-500" />
              </div>
              <h3 className="font-black italic text-lg uppercase text-gray-400 mb-2">NEXT SUCCESS</h3>
              <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">MÚSICAS IA</p>
            </Card>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-24 relative z-10 mt-12">
        
        {/* 2. BARRA DE BUSCA */}
        <div className="flex justify-center mb-20">
           <div className="bg-zinc-900 border border-white/10 rounded-full flex items-center w-full max-w-3xl p-1 pr-2">
              <Search className="text-gray-500 h-5 w-5 ml-4 mr-2" />
              <input type="text" placeholder="Artista, Música ou Gênero..." className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder:text-gray-600" disabled />
              <div className="hidden md:flex gap-4 px-4 text-[10px] font-black uppercase text-gray-500">
                <span className="text-cyan-400 cursor-pointer">TUDO</span>
                <span className="hover:text-white cursor-pointer">NACIONAL</span>
                <span className="hover:text-white cursor-pointer">INTER</span>
              </div>
              <Button onClick={() => navigate('/basic')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs rounded-full px-8 h-10 ml-2">
                BUSCAR
              </Button>
           </div>
        </div>

        {/* 🚨 CORREÇÃO 3: MURAL DE CONQUISTAS (Borda Cyan e Ícones Certos) */}
        <section className="text-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">MURAL DE <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">CONQUISTAS</span></h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { icon: Star, title: "EARLY BIRD", status: "DESBLOQUEADO" },
              { icon: Mic2, title: "ROCK STAR", status: "DESBLOQUEADO" },
              { icon: Trophy, title: "DUEL MASTER", status: "DESBLOQUEADO" },
              { icon: Medal, title: "PERFECT PITCH", status: "DESBLOQUEADO" },
              { icon: Globe2, title: "POLYGLOT", status: "DESBLOQUEADO" }
            ].map((badge, idx) => (
              <Card key={idx} className="bg-[#0a0a0a] border-transparent w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex flex-col items-center justify-center cursor-default">
                <div className="h-12 w-12 rounded-full border-2 border-cyan-400 flex items-center justify-center mb-4">
                  <badge.icon className="text-cyan-400 h-6 w-6" />
                </div>
                <h4 className="font-black italic uppercase text-[10px] md:text-xs text-white text-center leading-tight mb-1">{badge.title}</h4>
                <p className="text-[6px] md:text-[8px] text-gray-500 uppercase font-black tracking-widest">{badge.status}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 🚨 CORREÇÃO 2: MÚSICAS MAIS CANTADAS COM BANDEIRAS REAIS EM HD */}
        <section className="text-center">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 mb-8">
            <Globe2 className="text-cyan-400 h-5 w-5" /> MÚSICAS MAIS CANTADAS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { flagUrl: "https://flagcdn.com/w80/br.png", country: "BR", desc: "BRASIL" },
              { flagUrl: "https://flagcdn.com/w80/us.png", country: "US", desc: "EUA" },
              { flagUrl: "https://flagcdn.com/w80/jp.png", country: "JP", desc: "JAPÃO" },
              { flagUrl: "https://flagcdn.com/w80/gb.png", country: "GB", desc: "REINO UNIDO" }
            ].map((region, idx) => (
              <Card key={idx} onClick={() => navigate('/basic')} className="bg-[#0a0a0a] border-transparent p-6 rounded-[2rem] flex flex-col items-center hover:border-white/10 cursor-pointer transition-all">
                <img src={region.flagUrl} alt={region.country} className="w-12 h-8 rounded-sm object-cover mb-4 shadow-sm" />
                <h3 className="font-black italic text-2xl uppercase text-white">{region.country}</h3>
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-6">{region.desc}</p>
                <div className="border border-white/10 rounded-full px-4 py-1 text-[10px] font-black uppercase text-white flex items-center gap-2 hover:bg-white/5">
                  EXPLORAR <ArrowRight size={12} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* GRID INFERIOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
            {/* 5. TREND TOPICS */}
            <section>
              <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 mb-8">
                TREND TOPICS <Flame className="text-orange-500 h-5 w-5" />
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <img src="https://images.unsplash.com/photo-1493225457124-a1a2a5f5f468?auto=format&fit=crop&q=80&w=300&h=400" className="rounded-3xl border border-white/10 object-cover w-full h-48 md:h-64" alt="Trend 1" />
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=400" className="rounded-3xl border border-white/10 object-cover w-full h-48 md:h-64" alt="Trend 2" />
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=400" className="rounded-3xl border border-white/10 object-cover w-full h-48 md:h-64" alt="Trend 3" />
                <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=300&h=400" className="rounded-3xl border border-white/10 object-cover w-full h-48 md:h-64" alt="Trend 4" />
              </div>
            </section>

            {/* 6. RECENTLY ADDED & TREND TAGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <h2 className="text-xl font-black italic uppercase tracking-tighter mb-8 text-white">RECENTLY ADDED</h2>
                <div className="grid grid-cols-1 gap-4">
                  {recentlyAdded.map((item, idx) => (
                    <div key={idx} onClick={() => navigate('/basic')} className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:bg-zinc-800 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center">
                          <PlayCircle className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white leading-tight">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.artist}</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-white/10 px-2 py-1 rounded text-gray-300 font-black uppercase tracking-widest">{item.badge}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 mb-8">
                  TREND TAGS <div className="bg-cyan-500 text-black rounded-full p-1"><Hash size={12} /></div>
                </h2>
                <div className="space-y-3">
                  {trendTags.map((tag, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-cyan-400 font-black italic text-lg">#</span>
                        <div>
                          <h4 className="text-sm font-black italic uppercase text-white leading-tight">{tag}</h4>
                        </div>
                      </div>
                      <div className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                        +12% <ArrowUpRight size={10} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="bg-zinc-950 border-white/10 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black italic uppercase tracking-tighter text-lg text-white">Cantando Agora</h3>
              </div>
              <div className="space-y-4">
                {fakeTrendActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <User size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-cyan-400">{activity.user}</span>
                        <span className="text-[8px] text-gray-600 uppercase font-black">{activity.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-1 mb-1">Cantou <strong className="text-white">{activity.song}</strong></p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-orange-500" />
                        <span className="text-[10px] text-orange-500 font-black">{activity.score} Precisão</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-zinc-900 to-black border-cyan-500/20 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black italic uppercase tracking-tighter text-lg text-white">Top Prime</h3>
              </div>
              
              <div className="space-y-2">
                {fakeRanking.map((rank, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${rank.isMe ? 'bg-cyan-500/10 border-cyan-500/50 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.15)] my-4' : 'bg-black border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm w-4 ${rank.rank <= 3 ? 'text-cyan-400' : 'text-gray-600'}`}>{rank.rank}</span>
                      <div>
                        <p className={`text-xs font-bold ${rank.isMe ? 'text-cyan-400' : 'text-white'}`}>{rank.name}</p>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500">{rank.tier}</p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-white">{rank.score} pts</span>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4 text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-cyan-400">
                Ver Ranking Completo <ChevronRight size={12} className="ml-1" />
              </Button>
            </Card>
          </div>
        </div>

        {/* 8. EVOLUÇÃO VOCAL / MEU DASHBOARD */}
        <section className="pb-12 pt-12">
           <div className="mb-8">
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] leading-tight">EVOLUÇÃO VOCAL</h2>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">MEU DASHBOARD</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-zinc-950 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:border-cyan-500/30 transition-all">
                <h4 className="text-3xl font-black italic text-white mb-4">De volta ao palco, {user?.displayName?.split(' ')[0] || "Cantor"}!</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8 max-w-xs">
                  A INTELIGÊNCIA ARTIFICIAL JÁ PROCESSOU SUA ÚLTIMA PERFORMANCE. CONFIRA SEUS NÚMEROS.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-full">
                  <Sparkles size={12} /> IA ATIVA NO MODO PRIME
                </div>
             </Card>

             <Card className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/10">
                  <div className="h-16 w-16 rounded-full border-2 border-cyan-400 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <img src={user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150"} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic uppercase text-white">{user?.displayName || "BRUNO MONTE"}</h4>
                    <span className="bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mt-1">PRIME MEMBER</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><Star size={16} className="text-cyan-400" /> SCORE MÁXIMO</span>
                    <span className="text-white text-lg italic">94.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><GraduationCap size={16} className="text-cyan-400" /> NÍVEL ACADEMY</span>
                    <span className="text-white text-lg italic">Nível 1</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><Trophy size={16} className="text-cyan-400" /> RANK GLOBAL</span>
                    <span className="text-white text-lg italic">#412</span>
                  </div>
                </div>
             </Card>
           </div>
        </section>

      </div>
    </div>
  );
}