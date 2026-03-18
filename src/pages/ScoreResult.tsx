import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, Sparkles, Star, ShieldCheck, Trophy, Activity, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Puxa os dados da música cantada (se vieram do Player)
  const songTitle = location.state?.title || "NÃO QUERO DINHEIRO";
  const songArtist = location.state?.artist || "TIM MAIA";
  const duration = location.state?.duration || "208";

  // Motor Simulado da IA Julliard (Gera notas rigorosas baseadas num algoritmo estrito)
  // Para o MVP, forçamos um cenário realista e duro para mostrar o "Padrão Ouro"
  const accuracy = location.state?.accuracy || 12.5; 
  const score = location.state?.score || 1250;
  const rank = accuracy > 90 ? "S" : accuracy > 75 ? "A" : accuracy > 50 ? "B" : accuracy > 25 ? "C" : "D";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white pb-24 overflow-x-hidden">
      
      {/* HEADER LOGO */}
      <div className="pt-12 pb-8 flex justify-center border-b border-white/5 bg-black/50">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
          KARAOKE <span className="text-cyan-400">PRIME</span>
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-12 space-y-12">
        
        {/* PERFIL DO USUÁRIO */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-black/40 p-8 rounded-[2rem] border border-white/5">
          <div className="h-32 w-32 rounded-full border-[3px] border-cyan-400 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <img src={user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150"} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
              {user?.displayName || "BRUNO MONTE"}
            </h2>
            <span className="bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              PRIME MEMBER
            </span>
          </div>
        </div>

        {/* TÍTULO DA MÚSICA */}
        <div className="flex items-center justify-center gap-4 text-center">
          <Mic2 className="text-gray-500 h-8 w-8" />
          <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
            {songTitle} - {songArtist} - KARAOKÊ
          </h3>
        </div>

        {/* ÁREA DE PERFORMANCE */}
        <Card className="bg-[#0f0f0f] border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center mb-12 text-center">
            <Sparkles className="text-cyan-400 h-10 w-10 mb-4 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
              PERFORMANCE CONCLUÍDA!
            </h2>
            <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest max-w-lg leading-relaxed">
              CONFIRA SEUS NÚMEROS CIRÚRGICOS NA MÚSICA {songTitle} (KARAOKE)
            </p>
          </div>

          {/* GRID DE DADOS (Exatamente igual ao seu layout original) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Star className="text-cyan-400 h-5 w-5 mb-2" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">PRECISÃO DA VOZ</p>
              <p className="text-2xl font-black text-cyan-400">{accuracy}%</p>
            </div>
            
            <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="text-cyan-400 h-5 w-5 mb-2" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">PONTUAÇÃO TOTAL</p>
              <p className="text-2xl font-black text-white">{score}</p>
            </div>

            <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Trophy className="text-cyan-400 h-5 w-5 mb-2" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">RANK</p>
              <p className="text-2xl font-black text-white">#{rank}</p>
            </div>

            <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Activity className="text-cyan-400 h-5 w-5 mb-2" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">DURAÇÃO</p>
              <p className="text-2xl font-black text-white">{duration}s</p>
            </div>
          </div>

          {/* AVALIAÇÃO DA IA JULLIARD */}
          <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8">
            <h4 className="flex items-center gap-2 text-sm font-black italic uppercase text-white mb-6">
              <Activity className="text-cyan-400 h-5 w-5" /> DICAS DE IA PARA MELHORIA
            </h4>
            <ul className="space-y-4 text-xs md:text-sm text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">•</span> 
                Sua voz está tremendo e escorregando entre as notas (falta de apoio).
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">•</span> 
                Abaixe o volume do YouTube e foque em ouvir a própria voz.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">•</span> 
                Treine o 'Farinelli' para ganhar força diafragmática antes de voltar ao palco.
              </li>
            </ul>
          </div>

        </Card>

        {/* 🚨 CORREÇÃO 3: BOTÃO AGORA VOLTA PARA /basic (Fim da Tela Preta) */}
        <div className="flex justify-center pt-8">
          <Button 
            onClick={() => navigate('/basic')} 
            className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full px-8 h-12 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} /> VolTAR AO PALCO PRINCIPAL
          </Button>
        </div>

      </div>
    </div>
  );
}