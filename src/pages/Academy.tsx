// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Academy.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  
  // Lendo a memória do navegador para saber se está logado
  const isLoggedIn = localStorage.getItem('@KaraokePrime:loggedIn') === 'true';

  const levels = [
    { id: 1, title: 'Steady Breath', desc: 'Dominando a respiração diafragmática para notas longas.', locked: false },
    { id: 2, title: 'Pitch Calibration', desc: 'Introdução para atingir as notas alvo com precisão.', locked: true },
    { id: 3, title: 'Rhythm Basics', desc: 'Mantendo o tempo e sincronizando os vocais.', locked: true },
    { id: 4, title: 'Vocal Resonance', desc: 'Explorando a ressonância de peito e cabeça.', locked: true },
    { id: 5, title: 'Agility & Riffs', desc: 'Melismas básicos e agilidade vocal.', locked: true },
    { id: 6, title: 'Vibrato Control', desc: 'Desenvolvendo um vibrato natural e controlado.', locked: true },
    { id: 7, title: 'Mixed Voice', desc: 'Conectando os registros sem quebras na voz.', locked: true },
    { id: 8, title: 'Dynamic Belting', desc: 'Potência vocal segura para os grandes refrões.', locked: true },
    { id: 9, title: 'Emotional Delivery', desc: 'Expressão e interpretação avançada.', locked: true },
    { id: 10, title: 'Pro Vocalist', desc: 'O teste final de maestria Prime.', locked: true },
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
      <img src="https://picsum.photos/seed/academy/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para Home
        </button>
        
        <div className="text-center mb-16">
          <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,168,225,0.5)]" />
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-lg uppercase">
            VOCAL <span className="text-primary neon-blue-glow">ACADEMY</span>
          </h1>
          <p className="text-gray-400 mt-6 uppercase tracking-widest text-sm font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/60 border-primary/30 shadow-[0_0_20px_rgba(0,168,225,0.1)] rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><Trophy className="text-primary h-10 w-10" /><div><p className="text-xs text-primary uppercase font-black tracking-widest mb-1">Nível Atual</p><p className="text-4xl font-black text-white italic">1</p></div></CardContent></Card>
          <Card className="bg-black/60 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)] rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><Star className="text-orange-500 h-10 w-10" /><div><p className="text-xs text-orange-500 uppercase font-black tracking-widest mb-1">XP Acumulado</p><p className="text-4xl font-black text-white italic">0</p></div></CardContent></Card>
          <Card className="bg-black/60 border-white/10 rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><BookOpen className="text-gray-400 h-10 w-10" /><div><p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Lições Concluídas</p><p className="text-4xl font-black text-white italic">0 / 10</p></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((lvl) => (
            <Card key={lvl.id} className={`flex flex-col rounded-3xl transition-all duration-300 ${!lvl.locked ? 'bg-black/80 border-primary shadow-[0_0_20px_rgba(0,168,225,0.2)] hover:scale-[1.02]' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100 relative'}`}>
              <CardContent className="p-8 flex-grow flex flex-col">
                {lvl.locked && <Lock className="absolute top-8 right-8 text-gray-500 h-5 w-5" />}
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-2xl font-black italic tracking-tighter ${!lvl.locked ? 'text-primary' : 'text-white pr-8'}`}>
                    Nível {lvl.id}:<br/>{lvl.title}
                  </h3>
                  {!lvl.locked && <span className="text-[10px] px-3 py-1 rounded-full border border-primary text-primary font-bold uppercase tracking-widest bg-primary/10">Foco Atual</span>}
                </div>
                <p className="text-sm text-gray-400 mb-8 flex-grow font-medium leading-relaxed">{lvl.desc}</p>
                {!lvl.locked ? (
                  <Button onClick={() => navigate('/lesson/1')} className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-white shadow-xl">
                    <PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lição
                  </Button>
                ) : (
                  <div className="w-full py-4 border border-white/10 rounded-2xl text-center text-xs text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-black/40">
                    <Lock className="h-4 w-4" /> Trancado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Academy;