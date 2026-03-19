import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, Activity, ArrowLeft, Share2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const songTitle = location.state?.title || "MÚSICA SELECIONADA";
  const accuracy = location.state?.accuracy || 0; 
  const score = location.state?.score || 0;
  
  const rank = score === 0 ? "D" : accuracy > 90 ? "S" : accuracy > 75 ? "A" : accuracy > 50 ? "B" : accuracy > 25 ? "C" : "D";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Resultado no Karaoke Prime!',
          text: `Cantei ${songTitle} no Karaoke Prime e fiz ${score} pontos!`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      toast.success("Resultado copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white flex flex-col items-center justify-center py-12 px-4 overflow-y-auto">
      
      {/* CARD FORMATO PÔSTER (9:16 ratio) */}
      <Card className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col relative overflow-hidden">
        
        {/* Luz de Fundo */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Topo do Pôster */}
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-6">
            KARAOKE <span className="text-cyan-400">PRIME</span>
          </h1>
          <div className="mx-auto h-20 w-20 rounded-full border-[3px] border-cyan-400 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.4)] mb-3">
            <img src={user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"} alt="User" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-black italic uppercase text-white leading-tight">
            {user?.displayName || "CANTOR PRIME"}
          </h2>
        </div>

        {/* Dados da Performance */}
        <div className="flex-1 flex flex-col justify-center space-y-5 relative z-10">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
              <Mic2 size={12} /> Faixa Analisada
            </p>
            <h3 className="text-lg font-black italic uppercase text-white px-2 line-clamp-2">
              {songTitle}
            </h3>
          </div>

          <div className="bg-black/50 border border-white/5 rounded-3xl p-5">
             <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
               <div>
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Score Final</p>
                 <p className="text-3xl font-black text-white">{score.toLocaleString()}</p>
               </div>
               <div className="text-right">
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Rank</p>
                 <p className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{rank}</p>
               </div>
             </div>
             <div>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Activity size={12} className="text-cyan-400" /> Precisão da Voz
                </p>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${accuracy}%` }}></div>
                </div>
                <p className="text-right text-[10px] font-bold text-cyan-400 mt-1">{accuracy}%</p>
             </div>
          </div>
        </div>

        {/* Dica da IA e Botão Compartilhar */}
        <div className="mt-6 relative z-10 text-center">
           {score === 0 ? (
             <div className="flex items-start gap-2 bg-red-950/50 border border-red-500/50 p-3 rounded-2xl mb-6 text-left">
               <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-xs font-bold text-gray-300 leading-tight">
                 Feedback: Ajuste seu microfone, verifique se está ligado, não conseguíamos captar sua voz.
               </p>
             </div>
           ) : (
             <p className="text-xs font-bold text-gray-300 italic mb-6 leading-relaxed">
               "Vem batalhar ou cantar comigo no Karaoke Prime!"
             </p>
           )}

           <Button onClick={handleShare} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-full h-14 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 transition-all hover:scale-105">
             COMPARTILHAR MEU PÔSTER <Share2 size={16} />
           </Button>
        </div>
      </Card>

      <Button variant="ghost" onClick={() => navigate('/basic')} className="mt-8 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
        <ArrowLeft size={14} /> VOLTAR AO PALCO PRINCIPAL
      </Button>

    </div>
  );
}