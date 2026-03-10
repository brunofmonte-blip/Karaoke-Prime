import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, 
  Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User as LucideUser
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

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
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">KARAOKE <span className="text-primary neon-blue-glow">PRIME</span></h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">A plataforma definitiva para evolução vocal e performance global.</p>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Basic</h3><p className="text-[10px] text-gray-400 mt-2">Karaoke tradicional e batalhas online.</p></div>
          </Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><GraduationCap size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Academy</h3><p className="text-[10px] text-gray-400 mt-2">10 níveis com treinamento profissional.</p></div>
          </Card>
          {['Next Talent', 'Backstage', 'Next Success'].map((item) => (
            <Card key={item} className="opacity-40 p-6 rounded-3xl border border-white/10 bg-black/60 h-56 relative flex flex-col justify-between">
              <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4" />
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><Star size={24} /></div>
              <h3 className="font-black text-gray-400 text-lg uppercase italic">{item}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* DASHBOARD DINÂMICO (ANEXO 8) */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black text-primary mb-12 uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(0,168,225,0.5)]">Evolução Vocal<br/><span className="text-white text-2xl">Dashboard de Performance</span></h2>
          <div className="text-center space-y-6 bg-zinc-950 border border-white/10 p-12 rounded-[2.5rem]">
            <h3 className="text-3xl font-black text-white italic">{user ? `Bem-vindo de volta, ${user.displayName?.split(' ')[0]}!` : "Pronto para Cantar?"}</h3>
            <p className="text-gray-400 font-medium">{user ? "Seus dados estão sendo processados pela IA." : "Cante sua primeira música para gerar os gráficos!"}</p>
          </div>
        </div>
        <Card className="bg-zinc-950 border-white/10 rounded-[2.5rem] shadow-2xl p-10">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover shadow-lg" />
            ) : (
              <div className="h-24 w-24 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center shadow-lg"><LucideUser size={40} className="text-primary" /></div>
            )}
            <div>
              <h3 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">{user ? user.displayName : "Cantor Convidado"}</h3>
              <p className={`text-xs font-black tracking-widest uppercase inline-block px-3 py-1 rounded-md ${user ? "text-primary bg-primary/10" : "text-orange-500 bg-orange-500/10"}`}>{user ? "Prime Member" : "Guest Access"}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;