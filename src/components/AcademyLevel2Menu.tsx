import React, { useState } from 'react';
import { PlayCircle, Wind, CheckCircle2, Lock, X, Activity, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VocalSandboxProvider } from '@/hooks/use-vocal-sandbox';
import FarinelliExercise from './FarinelliExercise';

// DADOS DE CONFIGURAÇÃO DO MOTOR (Placeholders)
export const level2Modules = [
  {
    id: "l2-afunacao-avancada",
    title: "Nível 2: Afinação Precisa",
    exercises: [
      {
        id: "ex-farinelli-l2",
        title: "Sustentação Estável de Ar",
        inhale: 4, hold: 2, exhale: 12, rest: 4,
        prepText: "Mantenha o sopro constante.", actionText: "SOPRAR", command: "EXPIRA AGORA", isLegato: true
      }
    ]
  }
];

// LIÇÕES (Placeholders)
const lessons = [
  { id: "2.1", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.2", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.3", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.4", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.5", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.6", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.7", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
  { id: "2.8", title: "Aula em Construção", desc: "Aguardando ementa e vídeo introdutório.", videoId: "" },
];

const AcademyLevel2Menu = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /></Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 2</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Estabilidade do Sopro</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 2</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Afinação <span className="text-cyan-400">Precisa</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Nível intermediário de afinação. Aguardando texto introdutório oficial.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO INTERMEDIÁRIO</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">Aguardando Vídeo Introdutório do Nível 2</div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, idx) => (
            <Card key={lesson.id} className="p-6 rounded-[2rem] bg-black/50 border-white/5 opacity-60 cursor-not-allowed flex items-start gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/5 text-gray-600"><Lock size={20} /></div>
              <div><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div><h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4><p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p><p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve (Aguardando Dados)</p></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyLevel2Menu;