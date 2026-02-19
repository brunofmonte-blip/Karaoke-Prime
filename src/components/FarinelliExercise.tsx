"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, CheckCircle2, Mic } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ConservatoryModule, useVocalSandbox, BreathingPhase } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FarinelliExerciseProps {
  moduleType: ConservatoryModule;
}

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const { activeExerciseTitle, setStabilityScore, stabilityScore, stopAnalysis, setManualProgress } = useVocalSandbox();
  
  // 1. EXPANDED STRICT CONFIG DICTIONARY
  const getStrictConfig = (title: string) => {
    const safeTitle = (title || '').toLowerCase();
    
    // --- MÓDULO C: APPOGGIO CLÁSSICO ---
    if (safeTitle.includes('farinelli')) {
      return { inhale: 5, hold: 5, exhale: 5, rest: 4, prepText: 'Treino do lendário Farinelli. Foque na expansão lateral das costelas em tempos perfeitamente iguais.', exhaleMsg: 'Solte o ar num fluxo estável.' };
    }
    if (safeTitle.includes('livro')) {
      return { inhale: 4, hold: 2, exhale: 8, rest: 5, prepText: 'Deite-se no chão e coloque um livro sobre o abdômen. O livro deve subir quando você puxa o ar.', exhaleMsg: 'Solte devagar em Ssss, o livro desce.' };
    }
    if (safeTitle.includes('quadrante') || safeTitle.includes('quadrantes')) {
      return { inhale: 4, hold: 4, exhale: 4, rest: 4, prepText: 'A famosa Box Breathing. Vamos inspirar, segurar, soltar e pausar em tempos exatos.', exhaleMsg: 'Esvazie os pulmões.' };
    }
    // --- MÓDULO B: SOVT & RESISTÊNCIA ---
    if (safeTitle.includes('canudo')) {
      return { inhale: 3, hold: 2, exhale: 15, rest: 5, prepText: 'Pegue um copo com um pouco de água e um canudo. Mantenha a postura ereta.', exhaleMsg: 'Sopre no canudo constantemente.' };
    }
    if (safeTitle.includes('lip trills') || safeTitle.includes('trill')) {
      return { inhale: 3, hold: 2, exhale: 12, rest: 4, prepText: 'Relaxe os lábios e a mandíbula. Prepare-se para a vibração.', exhaleMsg: 'Vibre os lábios em Brrrrr.' };
    }
    if (safeTitle.includes('glissando')) {
      return { inhale: 3, hold: 1, exhale: 12, rest: 4, prepText: 'Prepare-se para variar o tom do grave ao agudo, como uma sirene.', exhaleMsg: 'Faça uma sirene contínua.' };
    }
    // --- MÓDULO A: GINÁSIO DE RESPIRAÇÃO ---
    if (safeTitle.includes('vácuo') || safeTitle.includes('vacuo')) {
      return { inhale: 2, hold: 2, exhale: 12, rest: 4, prepText: 'Prepare-se para puxar o ar rapidamente (inalação curta).', exhaleMsg: 'Solte o ar em Xis.' };
    } 
    if (safeTitle.includes('circular')) {
      return { inhale: 4, hold: 2, exhale: 15, rest: 4, prepText: 'Prepare-se para o teste máximo de resistência pulmonar.', exhaleMsg: 'Solte o ar em Efe.' };
    }
    // DEFAULT ("S" Explosivo)
    return { inhale: 4, hold: 4, exhale: 10, rest: 5, prepText: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta.', exhaleMsg: 'Solte o ar em Esse.' };
  };

  // 2. APPLY THE CONFIGURATION
  const config = useMemo(() => getStrictConfig(activeExerciseTitle), [activeExerciseTitle]);

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
      if (volume < 5) {
        stabilityRef.current = Math.max(0, stabilityRef.current - 0.5);
      } else if (Math.abs(volume - lastVolumeRef.current) > 15) {
        stabilityRef.current = Math.max(0, stabilityRef.current - 0.2);
      }
      
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

  // 3. UPDATED STATE MACHINE WITH DYNAMIC TTS
  useEffect(() => {
    if (timeLeft === 0 && exerciseState !== 'idle' && exerciseState !== 'finished') {
      if (exerciseState === 'inhale') {
        setExerciseState('hold');
        setTimeLeft(config.hold); 
        setFeedback("Segure.");
        speak("Segure.");
      }
      else if (exerciseState === 'hold') {
        setExerciseState('exhale');
        setTimeLeft(config.exhale); 
        stabilityRef.current = 100;
        setStabilityScore(100);
        setFeedback(config.exhaleMsg);
        speak(config.exhaleMsg); // UPDATED TTS
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
    };
  }, []);

  const labels: Record<string, string> = {
    inhale: 'INSPIRA',
    hold: 'SEGURA',
    exhale: 'EXPIRA',
    rest: 'PAUSA',
    idle: 'PRONTO',
    finished: 'FIM'
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8 w-full">
      <InstructorAvatar phase={exerciseState === 'idle' || exerciseState === 'finished' ? 'rest' : exerciseState} moduleType={moduleType} />

      <div className="flex flex-col items-center space-y-8 flex-grow">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">
            {exerciseState === 'idle' ? "Checklist" : activeExerciseTitle}
          </h3>
          
          {/* 3. UPDATED UI FOR IDLE PREPARATION SCREEN */}
          <p className="text-lg text-foreground mb-8 leading-relaxed">
            {exerciseState === 'idle' ? config.prepText : feedback}
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
              <Activity className="h-5 w-5" />
              Monitor de Apoio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Estabilidade do Sopro</p>
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