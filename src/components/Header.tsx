import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  
  // 💡 Como estamos testando o visual, mude para TRUE quando quiser ver as aulas
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const levels = [
    { id: 1, title: 'Steady Breath', desc: 'Dominando a respiração diafragmática para notas longas.', locked: false },
    { id: 2, title: 'Pitch Calibration', desc: 'Introdução para atingir as notas alvo com precisão.', locked: true },
    { id: 3, title: 'Rhythm Basics', desc: 'Mantendo o tempo e sincronizando os vocais.', locked: true },
    { id: 4, title: 'Vocal Resonance', desc: 'Explorando a ressonância de peito e cabeça.', locked: true },
    { id: 5, title: 'Agility & Riffs', desc: 'Melismas básicos e agilidade vocal.', locked: true },
    { id: 6, title: 'Vibrato Control', desc: 'Desenvolvendo um vibrato natural e controlado.', locked: true },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4 font-sans">
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-700 max-w-2xl text-center pt-20">
          <div className="h-32 w-32 rounded-full border-4 border-primary/30 bg-primary/5 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(0,168,225,0.2)]">
            <Lock className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(0,168,225,0.8)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4 uppercase drop-shadow-lg">
            ACADEMY <span className="text-primary neon-blue-glow">LOCKED</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg mb-12">O currículo de elite é exclusivo para membros logados.</p>
          <Button onClick={() => navigate('/login')} className="h-16 px-12 rounded-full bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(0,168,225,0.5)] transition-all hover:scale-105">
            Entrar para Treinar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <div className="text-center text-white pt-20">
        <h1 className="text-5xl font-black">Bem-vindo à Academy</h1>
      </div>
    </div>
  );
};

export default Academy;