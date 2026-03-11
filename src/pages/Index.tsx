import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User as LucideUser, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Escuta o status de login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION & BACKGROUND */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center p-4">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-[0.25]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black z-0" />
        
        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 uppercase italic">
            KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">PRIME</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-400 font-bold tracking-widest uppercase max-w-3xl mx-auto">
            A plataforma definitiva para evolução vocal e performance global.
          </p>
        </div>

        {/* 2. QUICK ACCESS GRID (OS 5 MÓDULOS) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate("/basic")} className="cursor-pointer group p-6 rounded-3xl border border-cyan-400/50 bg-zinc-950/80 hover:bg-cyan-400/10 transition-all h-56 shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col justify-between backdrop-blur-sm">
            <div className="h-12 w-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400"><Music size={24} /></div>
            <div>
              <h3 className="font-black text-white text-xl uppercase italic group-hover:text-cyan-400 transition-colors">Basic</h3>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Karaoke e Duetos Online</p>
            </div>
          </Card>

          <Card onClick={() => navigate("/academy")} className="cursor-pointer group p-6 rounded-3xl border border-cyan-400/50 bg-zinc-950/80 hover:bg-cyan-400/10 transition-all h-56 shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col justify-between backdrop-blur-sm">
            <div className="h-12 w-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400"><GraduationCap size={24} /></div>
            <div>
              <h3 className="font-black text-white text-xl uppercase italic group-hover:text-cyan-400 transition-colors">Academy</h3>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Treinamento Profissional</p>
            </div>
          </Card>

          {[
            { n: "Next Talent", d: "Audições Globais", i: Globe, path: "/talent" },
            { n: "Backstage", d: "Dashboard Pro", i: LayoutDashboard, path: "/backstage" },
            { n: "Next Success", d: "Músicas IA", i: Sparkles, path: "/next-success" }
          ].map((item) => (
            <Card key={item.n} onClick={() => navigate(item.path)} className="cursor-pointer group opacity-60 hover:opacity-100 hover:border-cyan-400/30 transition-all p-6 rounded-3xl border border-white/10 bg-black h-56 relative flex flex-col justify-between">
              <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4 group-hover:text-cyan-400 transition-colors" />
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors"><item.i size={24} /></div>
              <div>
                <h3 className="font-black text-gray-400 text-lg uppercase italic group-hover:text-white transition-colors">{item.n}</h3>
                <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">{item.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-8 mb-32">
        <div className="flex bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full p-2 items-center shadow-2xl">
          <Search className="h-6 w-6 text-cyan-400 ml-6 mr-3" />
          <Input placeholder="Buscar Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-16 text-sm md:text-lg w-full font-medium placeholder:text-gray-600" />
          <div className="hidden md:flex gap-6 text-[10px] text-white font-black uppercase tracking-widest mx-8 whitespace-nowrap">
            <span className="cursor-pointer text-cyan-400">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Inter</span>
          </div>
          <Button className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-8 md:px-12 h-14 md:h-16 transition-colors">
            Buscar
          </Button>
        </div>
      </section>

      {/* 4. DASHBOARD DE PERFORMANCE */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase italic tracking-tighter">
            Evolução <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Vocal</span>
          </h2>
          <div className="space-y-6 bg-zinc-950 border border-white/10 p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-cyan-400/5">
              <Mic2 size={200} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter relative z-10">
              {user ? `Bem-vindo, ${user.displayName?.split(" ")[0]}!` : "Pronto para Cantar?"}
            </h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] relative z-10">
              {user ? "A IA analisou suas últimas performances." : "Faça login e cante para gerar gráficos precisos!"}
            </p>
            <div className="pt-8 relative z-10">
              {user ? (
                <Button onClick={() => navigate('/backstage')} className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest px-8 h-14 text-xs">
                  Acessar Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-8 h-14 text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  Fazer Login Agora
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* User Stats Card */}
        <Card className="bg-zinc-950 border-cyan-400/30 rounded-[3rem] shadow-[0_0_40px_rgba(34,211,238,0.05)] p-10 relative">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-24 w-24 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
            ) : (
              <div className="h-24 w-24 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center shadow-lg">
                <LucideUser size={40} className="text-cyan-400" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-black text-white mb-1 italic tracking-tighter uppercase">{user ? user.displayName : "Cantor Convidado"}</h3>
              <p className={`text-[10px] font-black tracking-widest uppercase inline-block px-3 py-1 rounded-full ${user ? "text-black bg-cyan-400" : "text-gray-500 bg-white/5"}`}>
                {user ? "Free Member" : "Guest Access"}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-3"><Star size={14} className="text-cyan-400" /> Pitch Score</span><span className="font-black text-white text-2xl italic">{user ? "94.8%" : "--"}</span></div>
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-3"><GraduationCap size={14} className="text-cyan-400" /> Nível Academy</span><span className="font-black text-white text-2xl italic">{user ? "Lvl 1" : "0"}</span></div>
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-3"><Trophy size={14} className="text-cyan-400" /> Ranking Global</span><span className="font-black text-white text-2xl italic">{user ? "#412" : "---"}</span></div>
          </div>
        </Card>
      </section>

      {/* 5. RANKING GLOBAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              Top <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">Performances</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Os melhores da semana no Arena</p>
          </div>
          <Button variant="ghost" className="text-cyan-400 hover:text-white uppercase text-[10px] font-black tracking-widest">
            Ver Ranking Completo <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((pos) => (
            <Card key={pos} className={`bg-zinc-950 border-white/5 rounded-[2rem] p-6 flex items-center gap-4 ${pos === 1 ? 'border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : ''}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black italic text-xl ${pos === 1 ? 'bg-orange-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                {pos}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-black italic uppercase tracking-tighter">Cantor {pos}</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Bohemian Rhapsody</p>
              </div>
              <div className="text-right">
                <span className="text-cyan-400 font-black italic">{99 - pos}.{pos}k</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. SOCIAL & COMUNIDADE */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 bg-zinc-950/50 border border-white/10 rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-orange-500/5 pointer-events-none" />
        <Medal size={48} className="text-cyan-400 mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
          Desafie e <span className="text-cyan-400">Compartilhe</span>
        </h2>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest max-w-2xl mx-auto leading-relaxed mb-10">
          Grave suas melhores performances, desafie amigos para duetos em tempo real e construa sua base de fãs na comunidade global.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-10 h-14 text-xs">
            Gravar Agora
          </Button>
          <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-10 h-14 text-xs">
            Ver Feed
          </Button>
        </div>
      </section>

      {/* 7. CTA PREMIUM */}
      <section className="max-w-5xl mx-auto px-4 w-full mb-32 text-center">
        <div className="h-20 w-20 mx-auto bg-cyan-400/20 border-2 border-cyan-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
          <Crown className="text-cyan-400 h-10 w-10" />
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
          Desbloqueie o <span className="text-cyan-400">Premium</span>
        </h2>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em] mb-12">
          Acesso ilimitado à Academy, Gravações IA e Dashboard Profissional.
        </p>
        <Button onClick={() => navigate('/premium')} className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-12 h-16 text-sm shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-105">
          Ver Planos
        </Button>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 uppercase italic opacity-50">
            CANTE. EVOLUA.<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">CONQUISTE.</span>
          </h2>
          <div className="flex justify-center gap-6 mb-12 text-gray-500">
            <Heart size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            <MessageCircle size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            <Globe size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
          </div>
          <p className="text-[10px] text-gray-600 font-black tracking-[0.5em] uppercase">
            © 2026 KARAOKE PRIME - ALL RIGHTS RESERVED - BY DYAD
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;