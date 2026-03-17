import React, { useState } from 'react';
import { PlayCircle, Wind, CheckCircle2, Lock, X, Activity, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VocalSandboxProvider } from '@/hooks/use-vocal-sandbox';
import FarinelliExercise from './FarinelliExercise';

// DADOS DE CONFIGURAÇÃO DO MOTOR (Placeholders)
export const level4Modules = [
  {
    id: "l4-interpretacao",
    title: "Nível 4: Interpretação Vocal",
    exercises: [
      {
        id: "ex-farinelli-l4",
        title: "Controle Dinâmico de Ar",
        inhale: 4, hold: 4, exhale: 18, rest: 4,
        prepText: "Controle o fluxo de ar para dinâmica intensa.", actionText: "SOPRAR", command: "EXPIRA AGORA", isLegato: true
      }
    ]
  }
];

// LIÇÕES (Usando a sua ementa de Nível 4)
const lessons = [
  { id: "4.1", title: "Bocejo-Suspiro", desc: "Técnica para relaxar a voz e melhorar o alcance vocal.", videoId: "" },
  { id: "4.2", title: "Boca Chiusa (scale)", desc: "Aquecimento sem sobrecarga com 'hmmm' na escala maior.", videoId: "" },
  { id: "4.3", title: "Exercício com Canudo (SOVT)", desc: "Cantarolar através do canudo do grave ao agudo para controle.", videoId: "" },
  { id: "4.4", title: "Vibração Labial", desc: "Aquecimento simples fazendo o som de um barco a motor com os lábios.", videoId: "" },
  { id: "4.5", title: "Vibração da Língua", desc: "Enrolar a língua e rolar os 'Rs' através do seu alcance vocal.", videoId: "" },
  { id: "4.6", title: "Afrouxar a Mandíbula", desc: "Bocejar com a boca fechada e sentir onde a mandíbula solta para cantar relaxado.", videoId: "" },
  { id: "4.7", title: "Portamento em Duas Oitavas", desc: "Som de 'eeee' ou 'ohhhh' deslizando gradualmente pelas notas cromáticas.", videoId: "" },
  { id: "4.8", title: "Exercício da Sirene", desc: "Som de 'oooo' do grave ao agudo e de volta, como um veículo de emergência.", videoId: "" },
  { id: "4.9", title: "Técnica de Deslize Vocal", desc: "Portamento entre notas próximas sem cantar as intermediárias.", videoId: "" },
  { id: "4.10", title: "Cantar com o Diafragma", desc: "Técnica de respiração correta para dar força, controle e tom cheio.", videoId: "" },
];

const AcademyLevel4Menu = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /></Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 4</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Controle Dinâmico da Coluna de Ar</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 4</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Interpretação <span className="text-cyan-400">Vocal</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Nível focado em expressão e emoção ao cantar. Aguardando texto introdutório oficial.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO DE DINÂMICA</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">Aguardando Vídeo Introdutório do Nível 4</div>
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

export default AcademyLevel4Menu;