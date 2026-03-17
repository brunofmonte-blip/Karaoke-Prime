import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, GraduationCap, Globe2, LayoutGrid, Sparkles, Star, Trophy, Medal, PlayCircle, Lock, ArrowUpRight, Search, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // 🚨 A CORREÇÃO: A FÁBRICA DE BOTÕES VOLTOU!
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Dados Semente para o Ranking
  const fakeRanking = [
    { rank: 1, name: "Yumi_Tokyo", score: "15.420", tier: "Diamante" },
    { rank: 2, name: "MariaClara_V", score: "14.890", tier: "Platina" },
    { rank: 3, name: "John_Belt", score: "13.200", tier: "Platina" },
    { rank: 4, name: "VocalStar_BR", score: "12.500", tier: "Ouro" },
    { rank: 412, name: user?.displayName?.split(' ')[0] || "Você", score: "1.250", tier: "Iniciante", isMe: true }
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white pb-24 overflow-x-hidden">
      
      {/* 1. HERO SECTION & MAIN CARDS */}
      <div className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-black to-black z-10" />
          <img src="https://images.unsplash.com/photo-1516280440502-6c2438eabe2b?auto=format&fit=crop&q=80" alt="Stage" className="w-full h-full object-cover opacity-20" />
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
        
        {/* 2. BARRA DE BUSCA (Apenas Visual por enquanto) */}
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

        {/* 3. MURAL DE CONQUISTAS */}
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
              <Card key={idx} className="bg-zinc-950/80 border-white/5 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex flex-col items-center justify-center hover:border-cyan-500/30 transition-all cursor-default">
                <div className="h-12 w-12 rounded-full border border-cyan-400/50 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <badge.icon className="text-cyan-400 h-6 w-6" />
                </div>
                <h4 className="font-black italic uppercase text-[10px] md:text-xs text-white text-center leading-tight mb-1">{badge.title}</h4>
                <p className="text-[6px] md:text-[8px] text-gray-500 uppercase font-black tracking-widest">{badge.status}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. MÚSICAS MAIS CANTADAS */}
        <section className="text-center">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 mb-8">
            <Globe2 className="text-cyan-400 h-5 w-5" /> MÚSICAS MAIS CANTADAS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { flag: "🇧🇷", country: "BR", desc: "BRASIL" },
              { flag: "🇺🇸", country: "US", desc: "EUA" },
              { flag: "🇯🇵", country: "JP", desc: "JAPÃO" },
              { flag: "🇬🇧", country: "GB", desc: "REINO UNIDO" }
            ].map((region, idx) => (
              <Card key={idx} onClick={() => navigate('/basic')} className="bg-zinc-950 border-white/5 p-6 rounded-[2rem] flex flex-col items-center hover:border-white/20 cursor-pointer transition-all">
                <div className="text-4xl mb-2">{region.flag}</div>
                <h3 className="font-black italic text-2xl uppercase">{region.country}</h3>
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-6">{region.desc}</p>
                <div className="border border-white/10 rounded-full px-4 py-1 text-[10px] font-black uppercase text-white flex items-center gap-1 hover:bg-white/5">
                  EXPLORAR <ArrowUpRight size={10} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. TREND TOPICS (Imagens Placeholder) */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "EVIDÊNCIAS", artist: "CHITÃOZINHO E XORORÓ", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=100&h=100" },
                { title: "TENNESSEE WHISKEY", artist: "CHRIS STAPLETON", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=100&h=100" },
                { title: "TÁ ESCRITO", artist: "REVELAÇÃO", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=100&h=100" },
                { title: "CLARITY", artist: "ZEDD", img: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f468?auto=format&fit=crop&q=80&w=100&h=100" }
              ].map((song, idx) => (
                <div key={idx} className="bg-zinc-950 border border-white/5 rounded-2xl p-3 flex items-center gap-4 hover:bg-zinc-900 cursor-pointer transition-colors">
                  <img src={song.img} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-black italic uppercase text-white">{song.title}</h4>
                    <p className="text-[8px] font-bold text-gray-500 uppercase">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 mb-8">
              TREND TAGS <div className="bg-cyan-500 text-black rounded-full p-1"><Hash size={12} /></div>
            </h2>
            <div className="space-y-3">
              {[
                { tag: "SERTANEJO2026", users: "10K CANTORES", grow: "+12%" },
                { tag: "ROCKCLASSICS", users: "15K CANTORES", grow: "+24%" },
                { tag: "VOCALACADEMY", users: "20K CANTORES", grow: "+36%" },
                { tag: "ANIMEHITS", users: "25K CANTORES", grow: "+48%" }
              ].map((t, idx) => (
                <div key={idx} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/30 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-black italic text-lg">#</span>
                    <div>
                      <h4 className="text-sm font-black italic uppercase text-white leading-tight">{t.tag}</h4>
                      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{t.users}</p>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                    {t.grow} <ArrowUpRight size={10} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 7. RANKINGS GLOBAIS */}
        <section className="text-center pt-8">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-10">
            RANKINGS GLOBAIS
          </h2>
          <Card className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 max-w-3xl mx-auto">
            <div className="space-y-3">
              {fakeRanking.map((r, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${r.isMe ? 'bg-cyan-500/10 border-cyan-500/50 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.15)] my-4' : 'bg-black border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-xl w-6 text-center ${r.rank <= 3 ? 'text-cyan-400' : 'text-gray-600'}`}>{r.rank}</span>
                    <div className="text-left">
                      <p className={`text-sm font-black italic uppercase ${r.isMe ? 'text-cyan-400' : 'text-white'}`}>{r.name}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{r.tier}</p>
                    </div>
                  </div>
                  <span className="font-black italic text-lg text-white">{r.score}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 8. EVOLUÇÃO VOCAL / MEU DASHBOARD */}
        <section className="pb-12">
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