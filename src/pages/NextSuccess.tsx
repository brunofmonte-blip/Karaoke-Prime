import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NextSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden pt-16 font-sans text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-transparent to-black z-0" />

      <div className="z-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700 max-w-2xl px-4">
        <div className="h-24 w-24 rounded-full border-2 border-cyan-400/30 flex items-center justify-center mb-8 bg-black/50 backdrop-blur-md relative shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Sparkles className="h-10 w-10 text-cyan-400" />
          <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-black border border-white/10 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-gray-500" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
          NEXT <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">SUCCESS</span>
        </h1>
        
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-10 leading-relaxed">
          Sua gravadora IA particular. Assine o plano Premium para transformar suas ideias em faixas originais prontas para as plataformas de streaming.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button onClick={() => navigate('/premium')} className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-8 h-14 text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2">
            <Star size={16} /> Desbloquear Premium
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-8 h-14 text-xs flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar para o Início
          </Button>
        </div>
      </div>
    </div>
  );
}