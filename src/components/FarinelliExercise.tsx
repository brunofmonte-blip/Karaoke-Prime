"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ConservatoryModule } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';

type Phase = 'inhale' | 'suspend' | 'exhale' | 'rest';

interface FarinelliExerciseProps {
  moduleType: ConservatoryModule;
}

const moduleConfigs: Record<ConservatoryModule, { 
  title: string, 
  music: string, 
  phases: Phase[], 
  durations: number[],
  labels: Record<Phase, string>,
  narration: Record<Phase, string>,
  avatarAction: string,
  checklist: string
}> = {
  farinelli: {
    title: 'Breathing Gym',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA (Ssss)', rest: 'PAUSA' },
    narration: { inhale: 'Inspira profundamente, expandindo o diafragma.', suspend: 'Segura o ar com o core engajado.', exhale: 'Expira de forma controlada.', rest: 'Pausa' },
    avatarAction: 'Expansão Pulmonar',
    checklist: 'Antes de começarmos, separe seu canudo e seu copo d\'água. Clique em "Estou Pronto" para iniciar.'
  },
  sovt: {
    title: 'Método Arnold Jacobs',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    phases: ['inhale', 'exhale'],
    durations: [4, 8],
    labels: { inhale: 'INSPIRA', exhale: 'BOLHAS CONSTANTES', suspend: '', rest: '' },
    narration: { inhale: 'Inspira pelo nariz, relaxando os ombros.', exhale: 'Expira criando bolhas constantes no canudo.', suspend: '', rest: '' },
    avatarAction: 'Bolhas no Canudo',
    checklist: 'Antes de começarmos, separe seu canudo e seu copo d\'água. Clique em "Estou Pronto" para iniciar.'
  },
  panting: {
    title: 'Appoggio Clássico',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA', rest: 'PAUSA' },
    narration: { inhale: 'Inspira e expande as costelas.', suspend: 'Mantém o suporte abdominal.', exhale: 'Solta o ar com apoio constante.', rest: 'Pausa' },
    avatarAction: 'Suporte Diafragmático',
    checklist: 'Antes de começarmos, separe seu canudo e seu copo d\'água. Clique em "Estou Pronto" para iniciar.'
  },
  alexander: {
    title: 'Técnica de Alexander',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    phases: ['inhale', 'suspend', 'exhale', 'rest'],
    durations: [6, 2, 6, 2],
    labels: { inhale: 'EXPANDA', suspend: 'MANTENHA', exhale: 'SOLTE', rest: 'RELAXE' },
    narration: { inhale: 'Expanda as costelas lateralmente.', suspend: 'Mantenha a expansão sem tensão.', exhale: 'Solte o ar devagar, alongando a coluna.', rest: 'Relaxe os ombros' },
    avatarAction: 'Alinhamento Postural',
    checklist: 'Antes de começarmos, separe seu canudo e seu copo d\'água. Clique em "Estou Pronto" para iniciar.'
  },
  none: {
    title: 'Treinamento Vocal',
    music: '',
    phases: [],
    durations: [],
    labels: { inhale: '', suspend: '', exhale: '', rest: '' },
    narration: { inhale: '', suspend: '', exhale: '', rest: '' },
    avatarAction: '',
    checklist: ''
  }
};

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const config = moduleConfigs[moduleType];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durations[0] || 4);
  const [repCount, setRepCount] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPhase = config.phases[phaseIndex];
  const currentDuration = config.durations[phaseIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window && isActive) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      // High-quality Brazilian Portuguese male voice selection
      const ptBrVoice = voices.find(v => v.lang === 'pt-BR' && (v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('Google')));
      
      if (ptBrVoice) utterance.voice = ptBrVoice;
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; 
      utterance.pitch = 1.05; 
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isReady && config.checklist) {
      const timer = setTimeout(() => speak(config.checklist), 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, config.checklist]);

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        speak(countdown.toString());
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        speak("O exercício começa agora!");
        setCountdown(null);
      }
    }
  }, [countdown]);

  useEffect(() => {
    if (!isReady || countdown !== null || !isActive) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (audioRef.current && audioRef.current.paused && config.music) {
      audioRef.current.play().catch(() => {});
    }

    if (timeLeft === currentDuration) {
      speak(config.narration[currentPhase]);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (phaseIndex + 1) % config.phases.length;
          if (nextIndex === 0) setRepCount(r => r + 1);
          setPhaseIndex(nextIndex);
          return config.durations[nextIndex];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIndex, isActive, config, currentPhase, currentDuration, countdown, isReady]);

  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  const handleReady = () => {
    setIsReady(true);
    setCountdown(3);
  };

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12 animate-in fade-in duration-500">
        <InstructorAvatar phase="rest" />
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">Checklist de Preparação</h3>
          <p className="text-lg text-foreground mb-8 leading-relaxed">{config.checklist}</p>
          <Button 
            onClick={handleReady}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-12 py-6 text-xl font-bold shadow-lg shadow-primary/30"
          >
            <CheckCircle2 className="h-6 w-6 mr-2" />
            ESTOU PRONTO
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8">
      {config.music && <audio ref={audioRef} src={config.music} loop hidden />}

      <InstructorAvatar phase={currentPhase} />

      <div className="flex flex-col items-center space-y-8 flex-grow">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-1 uppercase tracking-widest">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground">Repetição: {repCount} | Fase: {config.labels[currentPhase]}</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className={cn(
            "absolute inset-0 rounded-full border-4 border-primary/20 animate-ping",
            (!isActive || countdown !== null) && "animate-none"
          )} />
          
          <div className={cn(
            "h-64 w-64 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl",
            countdown !== null ? "border-muted bg-muted/10" :
            currentPhase === 'inhale' ? "border-primary bg-primary/10 scale-110" :
            currentPhase === 'suspend' ? "border-accent bg-accent/10 scale-105" :
            currentPhase === 'exhale' ? "border-destructive bg-destructive/10 scale-95" :
            "border-muted bg-muted/10 scale-100"
          )}>
            <span className="text-6xl font-black text-foreground mb-2">
              {countdown !== null ? countdown : timeLeft}
            </span>
            <span className={cn(
              "text-xl font-bold uppercase tracking-tighter text-center px-4",
              countdown !== null ? "text-muted-foreground" :
              currentPhase === 'inhale' ? "text-primary" :
              currentPhase === 'suspend' ? "text-accent" :
              currentPhase === 'exhale' ? "text-destructive" :
              "text-muted-foreground"
            )}>
              {countdown !== null ? "PREPARE-SE" : config.labels[currentPhase]}
            </span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-2">
          <Progress value={countdown !== null ? 0 : progress} className="h-2" />
          <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Início</span>
            <span className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" /> Guia de Voz Ativo
            </span>
            <span>Troca</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsActive(!isActive)} className="rounded-xl border-2 border-primary/50">
            {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isActive ? "Pausar" : "Retomar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarinelliExercise;