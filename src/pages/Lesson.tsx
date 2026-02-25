"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, ShieldCheck, Lock, CheckCircle2, 
  Clock, Mic, Target, Pause, Loader2, BrainCircuit, 
  Trophy, Sparkles, Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstructorAvatar from '@/components/InstructorAvatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Lesson() {
  const navigate = useNavigate();

  const modules = [
    { id: '1', title: 'A Base: Respiração Diafragmática', time: '05:20', type: 'video', locked: false, desc: 'Aprenda a ativar o diafragma para sustentar notas longas sem cansar as pregas vocais.', objectives: ['Inspirar expandindo o abdômen', 'Controlar a saída de ar constante'] },
    { id: '2', title: 'Controle de Fluxo de Ar', time: '08:15', type: 'video', locked: false, desc: 'Entenda como a pressão do ar afeta diretamente o volume e a estabilidade da sua voz.', objectives: ['Manter pressão subglótica estável', 'Evitar voz soprosa'] },
    { id: '3', title: 'Prática: Sustentação de 5 Segundos', time: '03:00', type: 'mic', locked: true, desc: 'Aplique a técnica de respiração cantando uma nota contínua.', objectives: ['Sustentar nota no tom correto', 'Não perder o fôlego'] },
    { id: '4', title: 'Aquecimento Labial (Trill)', time: '04:10', type: 'video', locked: true, desc: 'O exercício número 1 dos cantores profissionais para aquecer a voz sem atrito.', objectives: ['Relaxar musculatura facial', 'Conectar respiração e pregas vocais'] },
    { id: '5', title: 'Prática: Sirene Vocal', time: '05:00', type: 'mic', locked: true, desc: 'Deslize dos graves aos agudos usando o Trill labial para encontrar sua extensão.', objectives: ['Passar pelas pontes vocais', 'Manter fluxo constante'] },
    { id: '6', title: 'Postura e Alinhamento Corporal', time: '06:30', type: 'video', locked: true, desc: 'Como o alinhamento da coluna e pescoço libera sua ressonância natural.', objectives: ['Alinhamento cervical', 'Abertura de caixa torácica'] },
    { id: '7', title: 'Prática: Notas Longas Controladas', time: '04:45', type: 'mic', locked: true, desc: 'Treino de resistência para notas sustentadas em diferentes volumes.', objectives: ['Controle dinâmico', 'Estabilidade tonal'] },
    { id: '8', title: 'Relaxamento Laríngeo', time: '07:20', type: 'video', locked: true, desc: 'Técnicas para baixar a laringe e cantar com mais conforto e corpo.', objectives: ['Laringe neutra', 'Espaço faríngeo'] },
    { id: '9', title: 'Rotina de Resfriamento Vocal', time: '03:50', type: 'video', locked: true, desc: 'Exercícios essenciais para relaxar a voz após uma sessão intensa.', objectives: ['Desaquecimento seguro', 'Higiene vocal'] },
    { id: '10', title: 'Desafio Final: Domínio Nível 1', time: '10:00', type: 'mic', locked: true, desc: 'O teste definitivo para provar sua base técnica e avançar para o Nível 2.', objectives: ['Precisão de 80%+', 'Controle total de fôlego'] },
  ];

  const [activeMod, setActiveMod] = useState(modules[0]);
  const [practiceState, setPracticeState] = useState<'idle' | 'connecting' | 'recording' | 'analyzing' | 'result'>('idle');
  const [score, setScore] = useState(0);

  const handleSelect = (mod: any) => {
    if (mod.locked) {
      navigate('/premium');
    } else {
      setActiveMod(mod);
      setPracticeState('idle');
    }
  };

  const startPractice = () => {
    setPracticeState('connecting');
    setTimeout(() => setPracticeState('recording'), 2000);
    setTimeout(() => setPracticeState('analyzing'), 7000);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 30) + 65); // Random score between 65-95
      setPracticeState('result');
    }, 9500);
  };

  const resetPractice = () => {
    setPracticeState('idle');
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/academy')} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Academy
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Nível 1: Breathing Gym
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          {/* Main Content Area: Practice Studio */}
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-video rounded-3xl bg-black border-2 border-primary/30 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
              
              {/* Practice State UI */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 w-full h-full justify-center">
                {practiceState === 'idle' && (
                  <>
                    <InstructorAvatar />
                    <Button 
                      onClick={startPractice}
                      className="mt-8 h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/50 animate-in zoom-in duration-300"
                    >
                      {activeMod.type === 'video' ? <Play className="h-10 w-10 fill-current" /> : <Mic className="h-10 w-10" />}
                    </Button>
                    <p className="mt-4 text-white font-bold uppercase tracking-widest animate-pulse">
                      {activeMod.type === 'video' ? 'Assistir Aula' : 'Iniciar Prática'}
                    </p>
                  </>
                )}

                {practiceState === 'connecting' && (
                  <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <h3 className="text-2xl font-bold text-white">Conectando Sensores...</h3>
                    <p className="text-gray-400">Calibrando microfone e motor neural.</p>
                  </div>
                )}

                {practiceState === 'recording' && (
                  <div className="flex flex-col items-center gap-6 w-full animate-in zoom-in duration-500">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                      <InstructorAvatar phase="exhale" />
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-red-500/50 flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xl font-black text-white tracking-widest uppercase">Gravando Performance</span>
                    </div>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-[progress_5s_linear]" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}

                {practiceState === 'analyzing' && (
                  <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                    <BrainCircuit className="h-20 w-20 text-accent animate-pulse" />
                    <h3 className="text-3xl font-black text-accent neon-gold-glow">IA Analisando...</h3>
                    <p className="text-gray-300 max-w-xs">Processando estabilidade de pitch e suporte diafragmático.</p>
                  </div>
                )}

                {practiceState === 'result' && (
                  <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                    <div className="p-6 rounded-full bg-primary/20 border-4 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)]">
                      <Trophy className="h-16 w-16 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-5xl font-black text-white mb-1">{score}%</h3>
                      <p className="text-primary font-bold uppercase tracking-widest">Precisão Vocal</p>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={resetPractice} variant="outline" className="border-white/20 text-white hover:bg-white/10">Tentar Novamente</Button>
                      <Button onClick={() => navigate('/academy')} className="bg-primary text-black font-bold">Concluir Módulo</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-8 rounded-3xl glass-pillar border-2 border-primary/20 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{activeMod.title}</h2>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {activeMod.desc || "Descrição do módulo em carregamento..."}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground">
                  <Clock className="h-3 w-3" /> {activeMod.time}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" /> Objetivos da Aula
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeMod.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  )) || <li className="text-gray-500 italic">Objetivos não definidos para este módulo.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Conteúdo do Nível</h3>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">10 MÓDULOS</span>
            </div>
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
              {modules.map((mod) => (
                <Card 
                  key={mod.id} 
                  onClick={() => handleSelect(mod)}
                  className={cn(
                    "border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                    activeMod.id === mod.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-white/5 bg-white/5 hover:border-white/20",
                    mod.locked && "opacity-60"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center font-bold shrink-0",
                        activeMod.id === mod.id ? "bg-primary text-black" : "bg-white/10 text-gray-400"
                      )}>
                        {mod.type === 'video' ? <Play className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className={cn("font-bold text-sm truncate", activeMod.id === mod.id ? "text-white" : "text-gray-400")}>{mod.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold mt-1">
                          <Clock className="h-3 w-3" /> {mod.time}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {mod.locked ? <Lock className="h-4 w-4 text-gray-600" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              onClick={() => navigate('/basic')}
              className="w-full py-8 mt-4 bg-accent hover:bg-accent/90 text-black font-black rounded-2xl shadow-lg shadow-accent/20 group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              INICIAR PRÁTICA GUIADA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}