"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, CheckCircle2, Mic, Info, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ConservatoryModule, useVocalSandbox, BreathingPhase } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { level3Modules, Exercise } from './AcademyLevel3Menu';

interface FarinelliExerciseProps {
  moduleType: ConservatoryModule;
}

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  // Force workspace refresh and verify mounting
  console.log('Main Engine Mounted - Root Data Binding Enforced');

  const { activeExerciseTitle, activeExerciseId, setStabilityScore, stabilityScore, stopAnalysis, setManualProgress } = useVocalSandbox();
  
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const getStrictConfig = (lesson: { title: string, id: string }) => {
    if (!lesson.title && !lesson.id) return getDefaultConfig();
    
    const safeTitle = normalize(lesson.title || '');
    const safeId = (lesson.id || '').toLowerCase();
    
    // --- DYNAMIC LOOKUP FROM ROOT DATA (Level 3) ---
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
          holdText: found.holdText ?? 'SEGURA',
          command: found.command ?? 'AGORA',
          isLegato: found.isLegato ?? false
        };
      }
    }

    // --- NÍVEL 2 - MÓDULO A: ATAQUE & AUDIATION (Fallback for now) ---
    if (safeTitle.includes('laser') || safeTitle.includes('ataque')) {
      return { inhale: 3, hold: 2, exhale: 10, rest: 4, prepText: "Prepare-se para o ataque de precisão. Mentalize a nota DÓ (C4) antes de emitir o som. Use a fonética 'PÁ' para um ataque seco e imediato.", actionText: 'CANTAR PÁ!', holdText: 'MENTALIZE A NOTA', command: 'ATAQUE AGORA', isLegato: false };
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

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const stabilityRef = useRef(100);
  const lastVolumeRef = useRef(0);
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
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAudioLevel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (stateRef.current === 'exhale') {
      let currentPitchScore = 0;
      if (config.isLegato) {
        if (volume > 1.5) {
          currentPitchScore = 98 + Math.random() * 2;
        } else if (volume > 0.5) {
          currentPitchScore = 60 + Math.random() * 10;
        }
      } else {
        if (volume > 2) {
          currentPitchScore = 95 + Math.random() * 5;
        } else if (volume > 0.5) {
          currentPitchScore = 70 + Math.random() * 10;
        }
      }
      stabilityRef.current = (stabilityRef.current + currentPitchScore) / 2;
      const newScore = Math.floor(stabilityRef.current);
      if (newScore !== stabilityScore) {
        setStabilityScore(newScore);
      }
    }
    lastVolumeRef.current = volume;
    animationRef.current = requestAnimationFrame(checkAudioLevel);
  };

  const startExercise = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      setRepCount(1);
      setExerciseState('inhale');
      setTimeLeft(config.inhale); 
      setFeedback("Inspire.");
      speak("Inspire.");
      checkAudioLevel();
    } catch (err) {
      console.error("Mic error:", err);
      setFeedback("Erro: Microfone necessário!");
    }
  };

  useEffect(() => {
    if (exerciseState === 'idle' || exerciseState === 'finished') return;
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
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
          setStabilityScore(100);
          setFeedback(config.command);
          speak(config.command);
        }
      }
      else if (exerciseState === 'hold') {
        setExerciseState('exhale');
        setTimeLeft(config.exhale); 
        stabilityRef.current = 100;
        setStabilityScore(100);
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
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
          window.speechSynthesis.cancel();
          
          setExerciseState('finished');
          const finalAverage = Math.floor(accumulatedScoreRef.current / totalSeries);
          setFeedback("Treino concluído.");
          speak("Treino concluído.");
          stopAnalysis(finalAverage);
        }
      } 
      else if (exerciseState === 'rest') {
        setRepCount(prev => prev + 1);
        setExerciseState('inhale');
        setTimeLeft(config.inhale); 
        setFeedback("Inspire.");
        speak("Inspire.");
      }
    }
  }, [timeLeft, exerciseState, repCount, config, setManualProgress, stopAnalysis, setStabilityScore]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      window.speechSynthesis.cancel();
    };
  }, []);

  const labels: Record<string, string> = {
    inhale: 'INSPIRA',
    hold: config.holdText || 'SEGURA',
    exhale: config.actionText,
    rest: 'PAUSA',
    idle: 'PRONTO',
    finished: 'FIM'
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8 w-full">
      <InstructorAvatar 
        phase={exerciseState === 'idle' || exerciseState === 'finished' ? 'rest' : exerciseState} 
        moduleType={moduleType} 
        actionPhaseName={config.actionText}
      />

      <div className="flex flex-col items-center space-y-8 flex-grow">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">
            {exerciseState === 'idle' ? "Checklist de Preparação" : activeExerciseTitle}
          </h3>
          
          <p className="text-gray-300 text-center max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
            {exerciseState === 'idle' ? (config?.prepText || "Instrução não encontrada. Por favor, reinicie a lição.") : feedback}
          </p>
          
          {exerciseState === 'idle' ? (
            <Button 
              onClick={startExercise}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-12 py-6 text-xl font-bold shadow-lg shadow-primary/30"
            >
              <CheckCircle2 className="h-6 w-6 mr-2" />
              ESTOU PRONTO
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className={cn(
                  "h-48 w-48 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl",
                  exerciseState === 'inhale' ? "border-primary bg-primary/10 scale-110" : 
                  exerciseState === 'hold' ? "border-yellow-500 bg-yellow-500/10 scale-105" :
                  exerciseState === 'exhale' ? "border-accent bg-accent/10 scale-105" :
                  "border-destructive bg-destructive/10 scale-95"
                )}>
                  <span className="text-6xl font-black text-foreground">{timeLeft}s</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {labels[exerciseState]}
                  </span>
                </div>
              </div>
              
              <div className="w-full p-4 glass-pillar border-2 border-primary/20 rounded-2xl text-center mt-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Comando do Instrutor</p>
                <h4 className="text-xl font-black text-primary neon-blue-glow animate-pulse">
                  {exerciseState === 'exhale' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-accent neon-gold-glow text-3xl font-black uppercase tracking-tighter">
                        {config.actionText}
                      </span>
                      <span className="text-primary text-sm font-bold mt-2 animate-pulse">
                        {config.command}
                      </span>
                    </div>
                  ) : (
                    labels[exerciseState]
                  )}
                </h4>
              </div>

              {repCount > 0 && (
                <p className="text-sm font-bold text-primary uppercase tracking-widest">
                  Série {repCount} de {totalSeries}
                </p>
              )}
            </div>
          )}
        </div>

        <Card className="glass-pillar border-2 border-accent/50 p-6 w-full max-w-sm">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-accent flex items-center gap-2 text-lg">
              {moduleType === 'rhythm' ? <Timer className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
              {moduleType === 'rhythm' ? "Monitor de Ritmo" : "Monitor de Apoio"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {moduleType === 'rhythm' ? "Precisão Rítmica" : "Estabilidade do Sopro"}
              </p>
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-border/30" />
                <div 
                  className={cn(
                    "absolute inset-0 rounded-full border-4 transition-all duration-300",
                    stabilityScore > 70 ? "border-primary" : stabilityScore > 40 ? "border-accent" : "border-destructive"
                  )}
                  style={{ 
                    clipPath: `inset(${100 - stabilityScore}% 0 0 0)`,
                    filter: 'drop-shadow(0 0 8px currentColor)'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black">{stabilityScore.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarinelliExercise;