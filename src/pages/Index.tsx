import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, 
  Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// 🚨 INTEGRAÇÃO COM FIREBASE
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Escutador para atualizar o Dashboard conforme o login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />

        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">
            A plataforma definitiva para evolução vocal e performance global impulsionada por IA.
          </p>
        </div>

        {/* CARDS DE NAVEGAÇÃO */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-56 shadow-2xl">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl group-hover:text-primary transition-colors uppercase italic tracking-tighter">Basic</h3><p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">Karaoke tradicional e batalhas online.</p></div>
          </Card>
          
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col justify-between h-56 shadow-2xl">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><GraduationCap size={24} /></div>
            <div><h3 className="font-black text-white text-xl group-hover:text-primary transition-colors uppercase italic tracking-tighter">Academy</h3><p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">10 níveis com treinamento profissional.</p></div>
          </Card>

          {/* ITENS BLOQUEADOS */}
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Next Talent</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Audições gamificadas pelo mundo.</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><LayoutDashboard size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Backstage</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Analytics avançados.</p></div>
          </Card>
          <Card className="opacity-50 p-6 rounded-3xl border border-white/10 bg-black/60 flex flex-col justify-between h-56 relative">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Sparkles size={24} /></div>
            <div><h3 className="font-black text-gray-300 text-xl uppercase italic tracking-tighter">Next Success</h3><p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">Criação musical IA.</p></div>
          </Card>
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-12 mb-32">
        <div className="flex bg-zinc-900 border border-white/10 rounded-full p-2 items-center shadow-2xl">
          <Search className="h-6 w-6 text-primary ml-6 mr-3" />
          <Input placeholder="Busca Avançada: Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-16 text-lg w-full font-medium" />
          <Button className="rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest px-12 h-16 transition-colors">Buscar</Button>
        </div>
      </section>

      {/* ... (SEÇÕES DE CONQUISTAS, PAÍSES E TRENDS IGUAIS AO SEU CÓDIGO) ... */}
      
      {/* 8. DASHBOARD DINÂMICO */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black text-primary mb-12 uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(0,168,225,0.5)]">
            Evolução Vocal<br/>
            <span className="text-white text-2xl">Dashboard de Performance</span>
          </h2>
          <div className="text-center space-y-6 bg-zinc-950 border border-white/10 p-12 rounded-[2.5rem]">
            <div className="h-24 w-24 rounded-full border-2 border-primary mx-auto flex items-center justify-center text-primary bg-primary/10 mb-6 shadow-xl"><Music className="h-10 w-10" /></div>
            <h3 className="text-3xl font-black text-white italic">
              {user ? `Bem-vindo de volta, ${user.displayName?.split(' ')[0]}!` : "Pronto para Cantar?"}
            </h3>
            <p className="text-gray-400 font-medium">
              {user 
                ? "Seus dados de evolução estão sendo processados pela nossa IA. Continue praticando na Academy!" 
                : "Sua jornada vocal começa aqui. Cante sua primeira música para gerar os gráficos!"}
            </p>
            <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs pt-6 flex items-center justify-center gap-2"><Sparkles className="h-5 w-5" /> IA PRONTA PARA ANALISAR</p>
          </div>
        </div>

        {/* CARD DE PERFIL DINÂMICO */}
        <Card className="bg-zinc-950 border-white/10 rounded-[2.5rem] h-full shadow-2xl overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover shadow-lg" />
              ) : (
                <div className="h-24 w-24 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center shadow-lg">
                  <User size={40} className="text-primary" />
                </div>
              )}
              <div>
                <h3 className="text-3xl font-black text-white mb-2 italic tracking-tighter">
                  {user ? user.displayName : "Cantor Convidado"}
                </h3>
                <p className={`text-xs font-black tracking-widest uppercase inline-block px-3 py-1 rounded-md ${user ? "text-primary bg-primary/10" : "text-orange-500 bg-orange-500/10"}`}>
                  {user ? "Prime Member" : "Guest Access"}
                </p>
              </div>
            </div>
            
            <div className="space-y-6 text-base text-gray-300">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="flex items-center gap-4 font-bold uppercase text-xs tracking-widest"><Star className="h-6 w-6 text-orange-500"/> Melhor Nota</span>
                <span className="font-black text-white text-xl">{user ? "94.8%" : "0.0%"}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="flex items-center gap-4 font-bold uppercase text-xs tracking-widest"><GraduationCap className="h-6 w-6 text-orange-500"/> Nível Academy</span>
                <span className="font-black text-white text-xl">{user ? "Lvl 1" : "0"}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="flex items-center gap-4 font-bold uppercase text-xs tracking-widest"><Trophy className="h-6 w-6 text-orange-500"/> Ranking Global</span>
                <span className="font-black text-white text-xl">{user ? "#412" : "9999"}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-black mb-6">Badges Conquistadas</p>
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-opacity ${user ? "border-orange-500 opacity-100" : "border-white/10 opacity-20"}`}><Medal className="h-6 w-6 text-orange-500" /></div>
                <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-opacity ${user ? "border-primary opacity-100" : "border-white/10 opacity-20"}`}><Star className="h-6 w-6 text-primary" /></div>
                <div className="h-12 w-12 rounded-full border-2 border-white/10 flex items-center justify-center opacity-20"><Mic2 className="h-6 w-6 text-white" /></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 9. RODAPÉ */}
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