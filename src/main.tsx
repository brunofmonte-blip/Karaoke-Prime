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
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center p-4">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">KARAOKE <span className="text-primary neon-blue-glow">PRIME</span></h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">A plataforma definitiva para evolução vocal e performance global.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center space-y-6 bg-zinc-950 border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-3xl font-black text-white italic">{user ? `Bem-vindo, ${user.displayName?.split(' ')[0]}!` : "Pronto para Cantar?"}</h3>
          <p className="text-gray-400 font-medium uppercase text-[10px] tracking-widest">{user ? "Sua arena está pronta." : "Faça login para começar!"}</p>
        </div>
        <Card className="bg-zinc-950 border-white/10 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden relative">
          <div className="flex items-center gap-6">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center"><LucideUser size={40} className="text-primary" /></div>
            )}
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase">{user ? user.displayName : "Convidado"}</h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">{user ? "Prime Member" : "Guest Access"}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;