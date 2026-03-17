"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, CheckCircle2, Mic, Info, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ConservatoryModule, useVocalSandbox, BreathingPhase } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { level3Modules } from './AcademyLevel3Menu';
import { level5Modules } from './AcademyLevel5Menu';

interface FarinelliExerciseProps {
  moduleType: ConservatoryModule;
}

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const { 
    activeExerciseTitle, 
    activeExerciseId, 
    setStabilityScore, 
    stabilityScore, 
    stopAnalysis, 
    setManualProgress,
    isAnalyzing, // Lemos do contexto se o microfone está ativo
    pitchData // Lemos o volume bruto para pontuar
  } = useVocalSandbox();
  
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const getStrictConfig = (lesson: { title: string, id: string }) => {
    if (!lesson.title && !lesson.id) return getDefaultConfig();
    
    const safeTitle = normalize(lesson.title || '');
    const safeId = (lesson.id || '').toLowerCase();
    
    // --- DYNAMIC LOOKUP FROM LEVEL 3 ---
    for (const module of level3Modules) {
      const found = module.exercises.find(ex => ex.id.toLowerCase() === safeId || normalize(ex.title).includes(safeTitle));
      if (found && found.prepText) {
        return {
          inhale: found.inhale ?? 4,
          hold: found.hold ?? 0,
          exhale: found.exhale ?? 16,
          rest: found.rest ?? 4,
          prepText: found.prepText,
          actionText: found.actionText ?? 'CANTAR',
          holdText: 'SEGURA',
          command: found.command ?? 'AGORA',
          isLegato: found.isLegato ?? false
        };
      }
    }

    // --- DYNAMIC LOOKUP FROM LEVEL 5 ---
    for (const module of level5Modules) {
      const found = module.exercises.find(ex => ex.id.toLowerCase() === safeId || normalize(ex.title).includes(safeTitle));
      if (found && found.prepText) {
        return {
          inhale: found.inhale ?? 4,
          hold: found.hold ?? 2,
          exhale: found.exhale ?? 12,
          rest: found.rest ?? 4,
          prepText: found.prepText,
          actionText: found.actionText ?? 'CANTAR',
          holdText: 'SEGURA',
          command: found.command ?? 'ATAQUE AGORA',
          isLegato: found.isLegato ?? true
        };
      }
    }

    return getDefaultConfig();
  };

  const getDefaultConfig = () => ({ 
    inhale: 4, hold: 4, exhale: 10, rest: 5, 
    prepText: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta.', 
    actionText: 'SOLTAR AR', 
    holdText: 'SEGURA',
    command: 'EXPIRA AGORA', 
    isLegato: true 
  });

  const config = useMemo(() => getStrictConfig({ title: activeExerciseTitle, id: activeExerciseId }), [activeExerciseTitle, activeExerciseId]);

  const [exerciseState, setExerciseState] = useState<BreathingPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [repCount, setRepCount] = useState(0);
  const totalSeries = 3;

  const stabilityRef = useRef(100);
  const accumulatedScoreRef = useRef(0);
  const stateRef = useRef<BreathingPhase>(exerciseState);

  useEffect(() => {
    stateRef.current = exerciseState;
  }, [exerciseState]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🚨 AVALIAÇÃO DE ESTABILIDADE (Usando os dados globais do Sandbox)
  useEffect(() => {
    if (exerciseState === 'exhale' && isAnalyzing) {
      let currentPitchScore = 0;
      // Usamos a visualização de pitch como proxy de volume/presença
      const volume = pitchData; 
      
      if (config.isLegato) {
        if (volume > 20) currentPitchScore = 98 + Math.random() * 2;
        else if (volume > 5) currentPitchScore = 60 + Math.random() * 10;
        else currentPitchScore = 20; // Perdeu o apoio
      } else {
        if (volume > 40) currentPitchScore = 95 + Math.random() * 5;
        else if (volume > 10) currentPitchScore = 70 + Math.random() * 10;
        else currentPitchScore = 30;
      }
      
      // Suaviza a queda da nota
      stabilityRef.current = (stabilityRef.current * 0.8) + (currentPitchScore * 0.2);
      setStabilityScore(Math.floor(stabilityRef.current));
    }
  }, [pitchData, exerciseState, isAnalyzing, config.isLegato, setStabilityScore]);

  // Iniciar não precisa abrir mic, pois o Sandbox já faz isso no Lobby/Overlay
  const startExercise = () => {
    if (!isAnalyzing) {
        setFeedback("Erro: O microfone não foi iniciado pelo Sandbox.");
        return;
    }
    setRepCount(1);
    setExerciseState('inhale');
    setTimeLeft(config.inhale); 
    setFeedback("Inspire profundo.");
    speak("Inspire.");
  };

  useEffect(() => {
    if (exerciseState === 'idle' || exerciseState === 'finished') return;
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, exerciseState]);

  useEffect(() => {
    if (timeLeft === 0 && exerciseState !== 'idle' && exerciseState !== 'finished') {
      window.speechSynthesis.cancel();

      if (exerciseState === 'inhale') {
        if (config.hold > 0) {
          setExerciseState('hold');
          setTimeLeft(config.hold); 
          setFeedback("Segure.");
          speak("Segure.");
        } else {
          setExerciseState('exhale');
          setTimeLeft(config.exhale); 
          stabilityRef.current = 100;
          setFeedback(config.command);
          speak(config.command);
        }
      }
      else if (exerciseState === 'hold') {
        setExerciseState('exhale');
        setTimeLeft(config.exhale); 
        stabilityRef.current = 100;
        setFeedback(config.command);
        speak(config.command);
      } 
      else if (exerciseState === 'exhale') {
        accumulatedScoreRef.current += stabilityRef.current;
        setManualProgress(Math.floor((repCount / totalSeries) * 100));
        
        if (repCount < totalSeries) {
          setExerciseState('rest');
          setTimeLeft(config.rest); 
          setFeedback("Descanse.");
          speak("Descanse.");
        } else {
          setExerciseState('finished');
          const finalAverage = Math.floor(accumulatedScoreRef.current / totalSeries);
          setFeedback("Treino concluído com sucesso.");
          speak("Treino concluído.");
          stopAnalysis(finalAverage); // Envia a nota final pro Motor
        }
      } 
      else if (exerciseState === 'rest') {
        setRepCount(prev => prev + 1);
        setExerciseState('inhale');
        setTimeLeft(config.inhale); 
        setFeedback("Inspire profundo.");
        speak("Inspire.");
      }
    }
  }, [timeLeft, exerciseState, repCount, config, setManualProgress, stopAnalysis]);

  const labels: Record<string, string> = {
    inhale: 'INSPIRA',
    hold: config.holdText || 'SEGURA',
    exhale: config.actionText,
    rest: 'PAUSA',
    idle: 'PRONTO',
    finished: 'FIM'
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8 w-full max-w-5xl mx-auto animate-in fade-in duration-700">
      <InstructorAvatar 
        phase={exerciseState === 'idle' || exerciseState === 'finished' ? 'rest' : exerciseState} 
        moduleType={moduleType} 
        actionPhaseName={config.actionText}
      />

      <div className="flex flex-col items-center space-y-8 flex-grow w-full">
        <div className="text-center w-full">
          <h3 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] mb-4 uppercase tracking-widest italic">
            {exerciseState === 'idle' ? "Checklist de Preparação" : activeExerciseTitle || "Respiração Diafragmática"}
          </h3>
          
          <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-lg mx-auto mb-8 leading-relaxed">
            {exerciseState === 'idle' ? (config?.prepText || "Instrução não encontrada.") : feedback}
          </p>
          
          {exerciseState === 'idle' ? (
            <div className="p-8 bg-zinc-950/80 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center">
                <Wind className="h-16 w-16 text-cyan-400 opacity-50 mb-6" />
                <Button 
                onClick={startExercise}
                disabled={!isAnalyzing}
                className={`rounded-full px-12 py-8 text-lg font-black uppercase tracking-widest transition-all ${isAnalyzing ? 'bg-cyan-400 hover:bg-white text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'bg-zinc-800 text-zinc-500'}`}
                >
                {isAnalyzing ? (
                    <><CheckCircle2 className="h-6 w-6 mr-2" /> ESTOU PRONTO</>
                ) : (
                    <><AlertCircle className="h-6 w-6 mr-2" /> AGUARDANDO MOTOR...</>
                )}
                </Button>
                {!isAnalyzing && <p className="text-[10px] text-pink-500 mt-4 uppercase tracking-widest font-bold">Clique em "Começar" no painel principal primeiro.</p>}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 bg-zinc-950/80 p-10 rounded-[3rem] border border-cyan-500/20 shadow-2xl w-full">
              
              {/* 🚨 ANIMAÇÃO ORGÂNICA DE RESPIRAÇÃO */}
              <div className="relative flex items-center justify-center h-64 w-64">
                {/* Círculo Guia (Max Expansion) */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10" />
                
                <div className={cn(
                  "absolute rounded-full flex flex-col items-center justify-center transition-all ease-linear shadow-2xl",
                  exerciseState === 'inhale' ? "border-cyan-400 bg-cyan-400/20 border-[4px] shadow-[0_0_50px_rgba(34,211,238,0.3)] duration-[4000ms] h-64 w-64" : 
                  exerciseState === 'hold' ? "border-yellow-500 bg-yellow-500/20 border-[4px] shadow-[0_0_30px_rgba(234,179,8,0.3)] duration-1000 h-64 w-64" :
                  exerciseState === 'exhale' ? "border-pink-500 bg-pink-500/20 border-[6px] shadow-[0_0_50px_rgba(236,72,153,0.3)] duration-[10000ms] h-32 w-32" :
                  "border-zinc-500 bg-zinc-500/10 border-[2px] duration-1000 h-32 w-32"
                )}>
                  <span className="text-6xl font-black text-white drop-shadow-lg">{timeLeft}s</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-1">
                    {labels[exerciseState]}
                  </span>
                </div>
              </div>
              
              <div className="w-full flex items-center justify-between px-8 py-4 bg-black/50 rounded-full border border-white/5">
                 <div className="flex flex-col items-start">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Comando Atual</p>
                    <h4 className="text-xl font-black text-cyan-400 italic uppercase">
                    {exerciseState === 'exhale' ? config.actionText : labels[exerciseState]}
                    </h4>
                 </div>
                 {repCount > 0 && (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full">
                    <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                        Série {repCount} / {totalSeries}
                    </p>
                    </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* CARD DE ESTABILIDADE LATERAL */}
      {exerciseState !== 'idle' && (
          <Card className="bg-zinc-950/90 border-white/10 p-8 rounded-[2.5rem] w-full max-w-xs shrink-0 shadow-2xl flex flex-col items-center justify-center animate-in slide-in-from-right-10">
            <Activity className="h-8 w-8 text-cyan-400 mb-6" />
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 text-center">Monitor de<br/>Estabilidade</h4>
            
            <div className="relative h-40 w-40 mb-6">
                <div className="absolute inset-0 rounded-full border-[8px] border-white/5" />
                
                {/* Barra de Progresso Circular CSS pura */}
                <div 
                className="absolute inset-0 rounded-full"
                style={{
                    background: `conic-gradient(${stabilityScore > 70 ? '#06b6d4' : stabilityScore > 40 ? '#eab308' : '#ec4899'} ${stabilityScore}%, transparent 0)`
                }}
                />
                
                {/* Miolo escuro */}
                <div className="absolute inset-2 bg-zinc-950 rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className={`text-4xl font-black ${stabilityScore > 70 ? 'text-cyan-400' : stabilityScore > 40 ? 'text-yellow-500' : 'text-pink-500'}`}>
                        {stabilityScore.toFixed(0)}<span className="text-xl">%</span>
                    </span>
                </div>
            </div>
            
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                Mantenha a nota acima de 70% na expiração.
            </p>
          </Card>
      )}
    </div>
  );
};

export default FarinelliExercise;