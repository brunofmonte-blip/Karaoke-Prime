"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  const [showLocked, setShowLocked] = useState(false);

  // Se clicou em um módulo bloqueado, exibe a tela ACADEMY LOCKED
  if (showLocked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,225,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full border border-primary/30 flex items-center justify-center mb-8 bg-primary/10 shadow-[0_0_30px_rgba(0,168,225,0.3)]">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-white italic mb-4">ACADEMY <span className="text-primary">LOCKED</span></h1>
          <p className="text-gray-400 max-w-md">O currículo de 10 níveis é exclusivo para membros Premium.</p>
          <Button onClick={() => navigate('/login')} className="mt-8 h-14 px-8 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-full w-full max-w-xs shadow-[0_0_20px_rgba(0,168,225,0.4)]">
            → ENTRAR PARA TREINAR
          </Button>
          <Button onClick={() => setShowLocked(false)} variant="ghost" className="mt-4 text-gray-500 hover:text-white">Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-28 px-4 max-w-7xl mx-auto">
      {/* Header Corrigido com Espaçamento */}
      <div className="text-center mb-16">
        <GraduationCap className="h-14 w-14 text-primary mx-auto mb-6" />
        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">VOCAL <span className="text-primary">ACADEMY</span></h1>
        <p className="text-gray-400 mt-6 uppercase tracking-widest text-sm font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-black/40 border-primary/20"><CardContent className="p-6 flex items-center gap-4"><Trophy className="text-primary h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Nível Atual</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
        <Card className="bg-black/40 border-orange-500/20"><CardContent className="p-6 flex items-center gap-4"><Star className="text-orange-500 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">XP Acumulado</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
        <Card className="bg-black/40 border-white/10"><CardContent className="p-6 flex items-center gap-4"><BookOpen className="text-gray-400 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Lições Concluídas</p><p className="text-3xl font-black text-white">0 / 10</p></div></CardContent></Card>
      </div>

      {/* Grid de Exercícios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nível 1 - Destravado */}
        <Card className="bg-black/60 border-primary shadow-[0_0_15px_rgba(0,168,225,0.2)] flex flex-col">
          <CardContent className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-primary">Nível 1: Steady Breath</h3>
              <span className="text-[10px] px-2 py-1 rounded-full border border-primary text-primary">Foco Atual</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Mastering diaphragmatic breathing for sustained notes.</p>
            <Button onClick={() => navigate('/lesson')} className="w-full bg-primary text-black font-bold hover:bg-primary/90"><PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lição</Button>
          </CardContent>
        </Card>

        {/* Nível 2 - Trancado */}
        <Card onClick={() => setShowLocked(true)} className="bg-black/40 border-white/5 cursor-pointer hover:border-white/20 transition-all flex flex-col relative group">
          <CardContent className="p-6 flex-grow flex flex-col opacity-50 group-hover:opacity-100">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 2: Pitch Calibration</h3>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Introduction to hitting target notes accurately.</p>
            <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
          </CardContent>
        </Card>

        {/* Nível 3 - Trancado */}
        <Card onClick={() => setShowLocked(true)} className="bg-black/40 border-white/5 cursor-pointer hover:border-white/20 transition-all flex flex-col relative group">
          <CardContent className="p-6 flex-grow flex flex-col opacity-50 group-hover:opacity-100">
            <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
            <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 3: Rhythm Basics</h3>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Keeping time and syncing vocals with tracks.</p>
            <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Academy;