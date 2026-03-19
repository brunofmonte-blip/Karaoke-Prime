import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, Sparkles, Star, ShieldCheck, Trophy, Activity, ArrowLeft, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const songTitle = location.state?.title || "NÃO QUERO DINHEIRO";
  const songArtist = location.state?.artist || "TIM MAIA";
  const duration = location.state?.duration || "180";
  const accuracy = location.state?.accuracy || 94.5; 
  const score = location.state?.score || 14250;
  const rank = accuracy > 90 ? "S" : accuracy > 75 ? "A" : accuracy > 50 ? "B" : accuracy > 25 ? "C" : "D";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Resultado no Karaoke Prime!',
          text: `Cantei ${songTitle} e tirei Rank ${rank} com ${accuracy}% de precisão no Karaoke Prime!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar', err);
      }
    } else {
      toast.success("Resultado copiado para a área de transferência!");
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] font-sans text-white overflow-hidden flex flex-col">
      
      {/* HEADER COMPACTO */}
      <div className="py-4 flex justify-center border-b border-white/5 bg-black/50 shrink-0">
        <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">
          KARAOKE <span className="text-cyan-400">PRIME</span>
        </h1>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col justify-center space-y-4">
        
        {/* CABEÇALHO DA MÚSICA & PERFIL LADO A LADO */}
        <div className="flex items-center justify-between bg-black/40 p-4 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full border-2 border-cyan-400 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <img src={user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white leading-tight">
                {user?.displayName || "BRUNO MONTE"}
              </h2>
              <span className="bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">
                PRIME MEMBER
              </span>
            </div>
          </div>
          <div className="text-right hidden md:block">
             <div className="flex items-center justify-end gap-2 text-gray-500 mb-1">
               <Mic2 className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Faixa Analisada</span>
             </div>
             <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">
               {songTitle}
             </h3>
          </div>
        </div>

        {/* ÁREA DE PERFORMANCE COMPACTA */}
        <Card className="bg-[#0f0f0f] border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center mb-6 text-center">
            <Sparkles className="text-cyan-400 h-8 w-8 mb-2" />
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
              PERFORMANCE CONCLUÍDA
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-black border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
              <Star className="text-cyan-400 h-4 w-4 mb-1" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">PRECISÃO DA VOZ</p>
              <p className="text-xl font-black text-cyan-400">{accuracy}%</p>
            </div>
            <div className="bg-black border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
              <ShieldCheck className="text-cyan-400 h-4 w-4 mb-1" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">PONTUAÇÃO TOTAL</p>
              <p className="text-xl font-black text-white">{score}</p>
            </div>
            <div className="bg-black border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
              <Trophy className="text-cyan-400 h-4 w-4 mb-1" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">RANK</p>
              <p className="text-xl font-black text-white">#{rank}</p>
            </div>
            <div className="bg-black border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
              <Activity className="text-cyan-400 h-4 w-4 mb-1" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">DURAÇÃO</p>
              <p className="text-xl font-black text-white">{duration}s</p>
            </div>
          </div>

          <div className="bg-black border border-white/10 rounded-2xl p-5">
            <h4 className="flex items-center gap-2 text-xs font-black italic uppercase text-white mb-3">
              <Activity className="text-cyan-400 h-4 w-4" /> DICAS JULLIARD PARA MELHORIA
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Excelente estabilidade de afinação nas notas longas.</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Cuidado com o tempo das entradas após o refrão.</li>
            </ul>
          </div>
        </Card>

        {/* BOTÕES LADO A LADO */}
        <div className="flex justify-center gap-4 pt-2">
          <Button 
            onClick={() => navigate('/basic')} 
            className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full px-8 h-12 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} /> VOLTAR AO LOBBY
          </Button>
          
          <Button 
            onClick={handleShare} 
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-full px-8 h-12 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            COMPARTILHAR <Share2 size={16} />
          </Button>
        </div>

      </div>
    </div>
  );
}