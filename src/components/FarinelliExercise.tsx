import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ConservatoryModule } from '@/hooks/use-vocal-sandbox';

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
  narration: Record<Phase, string>
}> = {
  farinelli: {
    title: 'Exercício de Farinelli',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA (Ssss)', rest: 'PAUSA' },
    narration: { inhale: 'Inspira', suspend: 'Segura', exhale: 'Expira', rest: 'Pausa' }
  },
  sovt: {
    title: 'Exercício do Canudo (SOVT)',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    phases: ['inhale', 'exhale'],
    durations: [4, 8],
    labels: { inhale: 'INSPIRA', exhale: 'BOLHAS CONSTANTES', suspend: '', rest: '' },
    narration: { inhale: 'Inspira', exhale: 'Expira com bolhas', suspend: '', rest: '' }
  },
  panting: {
    title: 'Panting de Diafragma',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    phases: ['inhale', 'exhale'],
    durations: [2, 2],
    labels: { inhale: 'IN', exhale: 'OUT', suspend: '', rest: '' },
    narration: { inhale: 'In', exhale: 'Out', suspend: '', rest: '' }
  },
  alexander: {
    title: 'Expansão Costal',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    phases: ['inhale', 'suspend', 'exhale', 'rest'],
    durations: [6, 2, 6, 2],
    labels: { inhale: 'EXPANDA', suspend: 'MANTENHA', exhale: 'SOLTE', rest: 'RELAXE' },
    narration: { inhale: 'Expanda as costelas', suspend: 'Mantenha a expansão', exhale: 'Solte o ar devagar', rest: 'Relaxe os ombros' }
  },
  none: {
    title: 'Treinamento Vocal',
    music: '',
    phases: [],
    durations: [],
    labels: { inhale: '', suspend: '', exhale: '', rest: '' },
    narration: { inhale: '', suspend: '', exhale: '', rest: '' }
  }
};

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const config = moduleConfigs[moduleType];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durations[0] || 4);
  const [repCount, setRepCount] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPhase = config.phases[phaseIndex];
  const currentDuration = config.durations[phaseIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window && isActive) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isActive) {
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
  }, [phaseIndex, isActive, config, currentPhase, currentDuration]);

  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {config.music && <audio ref={audioRef} src={config.music} loop hidden />}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-1 uppercase tracking-widest">
          {config.title}
        </h3>
        <p className="text-sm text-muted-foreground">Repetição: {repCount} | Fase: {config.labels[currentPhase]}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className={cn(
          "absolute inset-0 rounded-full border-4 border-primary/20 animate-ping",
          !isActive && "animate-none"
        )} />
        
        <div className={cn(
          "h-64 w-64 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl",
          currentPhase === 'inhale' ? "border-primary bg-primary/10 scale-110" :
          currentPhase === 'suspend' ? "border-accent bg-accent/10 scale-105" :
          currentPhase === 'exhale' ? "border-destructive bg-destructive/10 scale-95" :
          "border-muted bg-muted/10 scale-100"
        )}>
          <span className="text-6xl font-black text-foreground mb-2">{timeLeft}</span>
          <span className={cn(
            "text-xl font-bold uppercase tracking-tighter text-center px-4",
            currentPhase === 'inhale' ? "text-primary" :
            currentPhase === 'suspend' ? "text-accent" :
            currentPhase === 'exhale' ? "text-destructive" :
            "text-muted-foreground"
          )}>
            {config.labels[currentPhase]}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} className="h-2" />
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
  );
};

export default FarinelliExercise;