"use client";

import React, { useState, useEffect, useRef } from 'react';
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

const moduleConfigs: Record<ConservatoryModule, { 
  title: string, 
  music: string, 
  phases: BreathingPhase[], 
  durations: number[],
  labels: Record<string, string>,
  narration: Record<string, string>,
  checklist: string
}> = {
  farinelli: {
    title: 'Breathing Gym',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA (Ssss)', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Inspira profundamente, expandindo o diafragma.', suspend: 'Segura o ar com o core engajado.', exhale: 'Expira de forma controlada.', rest: 'Pausa', idle: '' },
    checklist: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta e os ombros relaxados.'
  },
  sovt: {
    title: 'Método Arnold Jacobs',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    phases: ['inhale', 'exhale'],
    durations: [4, 8],
    labels: { inhale: 'INSPIRA', exhale: 'BOLHAS CONSTANTES', suspend: '', rest: '', idle: 'PRONTO' },
    narration: { inhale: 'Inspira pelo nariz, relaxando os ombros.', exhale: 'Expira criando bolhas constantes no canudo.', suspend: '', rest: '', idle: '' },
    checklist: 'Antes de começarmos, separe seu canudo e seu copo d\'água. Clique em "Estou Pronto" para iniciar.'
  },
  panting: {
    title: 'Appoggio Clássico',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Inspira e expande as costelas.', suspend: 'Mantém o suporte abdominal.', exhale: 'Solta o ar com apoio constante.', rest: 'Pausa', idle: '' },
    checklist: 'Foco no diafragma. Separe um livro pesado para o biofeedback abdominal. Clique em "Estou Pronto" para iniciar.'
  },
  alexander: {
    title: 'Técnica de Alexander',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    phases: ['inhale', 'suspend', 'exhale', 'rest'],
    durations: [6, 2, 6, 2],
    labels: { inhale: 'EXPANDA', suspend: 'MANTENHA', exhale: 'SOLTE', rest: 'RELAXE', idle: 'PRONTO' },
    narration: { inhale: 'Expanda as costelas lateralmente.', suspend: 'Mantenha a expansão sem tensão.', exhale: 'Solte o ar devagar, alongando a coluna.', rest: 'Relaxe os ombros', idle: '' },
    checklist: 'Alinhamento total. Relaxe o pescoço e alongue a coluna para ressonância máxima.'
  },
  none: {
    title: 'Treinamento Vocal',
    music: '',
    phases: [],
    durations: [],
    labels: { inhale: '', suspend: '', exhale: '', rest: '', idle: '' },
    narration: { inhale: '', suspend: '', exhale: '', rest: '', idle: '' },
    checklist: ''
  }
};

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const config = moduleConfigs[moduleType];
  const { setStabilityScore, stabilityScore, stopAnalysis } = useVocalSandbox();
  
  // Engine States
  const [exerciseState, setExerciseState] = useState<BreathingPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(config.checklist);
  const [repCount, setRepCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Refs for Audio Engine
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stabilityRef = useRef(100);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window && isActive) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const ptBrVoice = voices.find(v => v.lang === 'pt-BR' && (v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('Google')));
      if (ptBrVoice) utterance.voice = ptBrVoice;
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; 
      utterance.pitch = 1.0; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const startExercise = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const runCircuit = async (currentRep: number) => {
        if (currentRep > 3 || !isActive) {
          setExerciseState('idle');
          setFeedback("Treino concluído! Excelente trabalho.");
          speak("Treino concluído! Excelente trabalho.");
          
          // Trigger manual stop with final stability score
          stopAnalysis(stabilityRef.current);
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          return;
        }

        setRepCount(currentRep);

        // Phase 1: Inhale
        setExerciseState('inhale');
        setTimeLeft(4);
        setFeedback(`Série ${currentRep}/3: Inspire profundamente...`);
        speak("Inspire.");
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Phase 2: Suspend
        setExerciseState('suspend');
        setTimeLeft(4);
        setFeedback("Segure o ar...");
        speak("Segure.");
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Phase 3: Exhale
        setExerciseState('exhale');
        setTimeLeft(10);
        setFeedback("Solte o ar (Sssss) constante!");
        speak("Solte.");
        
        const checkStability = () => {
          if (exerciseState !== 'exhale') return;
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
          const diff = Math.abs(volume - 20); 
          if (diff > 5 && volume > 2) {
            stabilityRef.current = Math.max(0, stabilityRef.current - 0.5);
            setStabilityScore(stabilityRef.current);
          }
          if (timeLeft > 0) {
            requestAnimationFrame(checkStability);
          }
        };
        checkStability();
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Phase 4: Rest
        setExerciseState('rest');
        setTimeLeft(5);
        setFeedback("Descanse e prepare-se para a próxima série...");
        speak("Descanse.");
        await new Promise(resolve => setTimeout(resolve, 5000));

        runCircuit(currentRep + 1);
      };

      runCircuit(1);

    } catch (err) {
      console.error("Mic error:", err);
      setFeedback("Erro: Microfone necessário para o exercício.");
    }
  };

  // Helper hook for the countdown timer
  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isActive]);

  useEffect(() => {
    return () => {
      setIsActive(false);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8 w-full">
      <InstructorAvatar phase={exerciseState === 'idle' ? 'rest' : exerciseState} moduleType={moduleType} />

      <div className="flex flex-col items-center space-y-8 flex-grow">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">
            {exerciseState === 'idle' ? "Checklist de Preparação" : config.title}
          </h3>
          <p className="text-lg text-foreground mb-8 leading-relaxed">{feedback}</p>
          
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
                  exerciseState === 'exhale' ? "border-accent bg-accent/10 scale-105" :
                  exerciseState === 'suspend' ? "border-yellow-500 bg-yellow-500/10 scale-100" :
                  "border-destructive bg-destructive/10 scale-95"
                )}>
                  <span className="text-6xl font-black text-foreground">{timeLeft}s</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {config.labels[exerciseState]}
                  </span>
                </div>
              </div>
              {repCount > 0 && (
                <p className="text-sm font-bold text-primary uppercase tracking-widest">
                  Série {repCount} de 3
                </p>
              )}
            </div>
          )}
        </div>

        {/* Monitor de Apoio Integrated */}
        <Card className="glass-pillar border-2 border-accent/50 p-6 w-full max-w-sm">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-accent flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Monitor de Apoio (SOVT)
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