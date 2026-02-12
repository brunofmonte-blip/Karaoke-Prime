"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, User, Headphones, CheckCircle2, ChevronRight } from 'lucide-react';
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
    checklist: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta e os ombros relaxados.'
  },
  sovt: {
    title: 'Método Arnold Jacobs',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    phases: ['inhale', 'exhale'],
    durations: [4, 8],
    labels: { inhale: 'INSPIRA', exhale: 'BOLHAS CONSTANTES', suspend: '', rest: '' },
    narration: { inhale: 'Inspira pelo nariz, relaxando os ombros.', exhale: 'Expira criando bolhas constantes no canudo.', suspend: '', rest: '' },
    avatarAction: 'Bolhas no Canudo',
    checklist: 'Antes de começarmos, separe seu canudo e um copo com 3 dedos de água.'
  },
  panting: {
    title: 'Appoggio Clássico',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    phases: ['inhale', 'suspend', 'exhale'],
    durations: [4, 4, 4],
    labels: { inhale: 'INSPIRA', suspend: 'SEGURA', exhale: 'EXPIRA', rest: 'PAUSA' },
    narration: { inhale: 'Inspira e expande as costelas.', suspend: 'Mantém o suporte abdominal.', exhale: 'Solta o ar com apoio constante.', rest: 'Pausa' },
    avatarAction: 'Suporte Diafragmático',
    checklist: 'Foco no diafragma. Sinta a pressão abdominal e mantenha o suporte constante.'
  },
  alexander: {
    title: 'Técnica de Alexander',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    phases: ['inhale', 'suspend', 'exhale', 'rest'],
    durations: [6, 2, 6, 2],
    labels: { inhale: 'EXPANDA', suspend: 'MANTENHA', exhale: 'SOLTE', rest: 'RELAXE' },
    narration: { inhale: 'Expanda as costelas lateralmente.', suspend: 'Mantenha a expansão sem tensão.', exhale: 'Solte o ar devagar, alongando a coluna.', rest: 'Relaxe os ombros' },
    avatarAction: 'Alinhamento Postural',
    checklist: 'Alinhamento total. Relaxe o pescoço e alongue a coluna para ressonância máxima.'
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

const StudioSpecialistAvatar = ({ phase, action }: { phase: Phase, action: string }) => {
  return (
    <div className="w-full lg:w-64 h-80 rounded-3xl glass-pillar border-2 border-primary/30 overflow-hidden relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-card/50 to-background/80">
      <div className="absolute top-2 left-2 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/30 z-20">
        STUDIO SPECIALIST
      </div>
      
      {/* Avatar Visual Representation */}
      <div className="relative w-40 h-48 flex flex-col items-center">
        {/* Head with Grey Hair */}
        <div className="w-16 h-16 rounded-full bg-[#f3f4f6] border-2 border-border relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#9ca3af]" /> {/* Grey Hair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground/50" />
          </div>
        </div>
        
        {/* Headphones */}
        <Headphones className="absolute top-[-4px] h-20 w-20 text-accent amazon-gold-glow z-20" />
        
        {/* Body (Dark Blazer over Light Grey Sweater) */}
        <div className={cn(
          "w-32 h-32 bg-[#1f2937] rounded-t-[40px] mt-[-10px] relative transition-all duration-1000",
          phase === 'inhale' && "scale-x-110 scale-y-105",
          phase === 'suspend' && "scale-x-105",
          phase === 'exhale' && "scale-x-95 scale-y-95"
        )}>
          {/* Light Grey Sweater V-Neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-[#d1d5db] clip-path-v-neck" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* Hands demonstrating breathing */}
          <div className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 transition-all duration-1000",
            phase === 'inhale' && "translate-y-[-10px] gap-12",
            phase === 'suspend' && "translate-y-[-5px]",
            phase === 'exhale' && "translate-y-[5px] gap-4"
          )}>
            <div className="w-4 h-4 rounded-full bg-[#f3f4f6] shadow-md" />
            <div className="w-4 h-4 rounded-full bg-[#f3f4f6] shadow-md" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-bold text-foreground uppercase tracking-wider">{action}</p>
        <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Observe o movimento do diafragma e ombros.</p>
      </div>
      
      {/* Phase Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
        <div 
          className={cn(
            "h-full transition-all duration-100",
            phase === 'inhale' ? "bg-primary" : phase === 'suspend' ? "bg-accent" : "bg-destructive"
          )} 
        />
      </div>
    </div>
  );
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
      utterance.pitch = 0.85; 
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
        <StudioSpecialistAvatar phase="rest" action="Preparação" />
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

      <StudioSpecialistAvatar phase={currentPhase} action={config.avatarAction} />

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