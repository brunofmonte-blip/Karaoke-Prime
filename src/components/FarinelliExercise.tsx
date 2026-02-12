import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

type Phase = 'inhale' | 'suspend' | 'exhale';

const FarinelliExercise: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [timeLeft, setTimeLeft] = useState(4);
  const [repCount, setRepCount] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice Narration Function
  const speak = (text: string) => {
    if ('speechSynthesis' in window && isActive) {
      // Cancel any ongoing speech to avoid overlap
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isActive) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    // Start background music if not playing
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => console.log("Audio playback blocked"));
    }

    // Initial narration for the first phase
    if (timeLeft === seconds) {
      const text = phase === 'inhale' ? "Inspira" : phase === 'suspend' ? "Segura" : "Expira";
      speak(text);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch Phase
          let nextPhase: Phase;
          if (phase === 'inhale') {
            nextPhase = 'suspend';
          } else if (phase === 'suspend') {
            nextPhase = 'exhale';
          } else {
            nextPhase = 'inhale';
            setRepCount(r => r + 1);
            // Increase difficulty every 2 reps
            if (repCount % 2 === 0 && seconds < 12) {
              setSeconds(s => s + 1);
            }
          }
          
          setPhase(nextPhase);
          const text = nextPhase === 'inhale' ? "Inspira" : nextPhase === 'suspend' ? "Segura" : "Expira";
          speak(text);
          
          return seconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, seconds, isActive, repCount]);

  const progress = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {/* Background Zen Music (Placeholder URL for low-tempo instrumental) */}
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
        hidden 
      />

      <div className="text-center">
        <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-1 uppercase tracking-widest">
          Exercício de Farinelli
        </h3>
        <p className="text-sm text-muted-foreground">Repetição: {repCount} | Ciclo: {seconds}s</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Visual Metronome Ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-4 border-primary/20 animate-ping",
          !isActive && "animate-none"
        )} />
        
        <div className={cn(
          "h-64 w-64 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl",
          phase === 'inhale' ? "border-primary bg-primary/10 scale-110" :
          phase === 'suspend' ? "border-accent bg-accent/10 scale-105" :
          "border-destructive bg-destructive/10 scale-95"
        )}>
          <span className="text-6xl font-black text-foreground mb-2">{timeLeft}</span>
          <span className={cn(
            "text-xl font-bold uppercase tracking-tighter",
            phase === 'inhale' ? "text-primary" :
            phase === 'suspend' ? "text-accent" :
            "text-destructive"
          )}>
            {phase === 'inhale' ? "INSPIRA" :
             phase === 'suspend' ? "SEGURA" :
             "EXPIRA (Ssss)"}
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
        <Button 
          variant="outline" 
          onClick={() => setIsActive(!isActive)}
          className="rounded-xl border-2 border-primary/50"
        >
          {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
          {isActive ? "Pausar" : "Retomar"}
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-card/50 border border-border/50 flex items-start gap-3 max-w-md">
        <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">Dica de Segurança:</span> Se sentir tontura, pare imediatamente. O excesso de oxigênio é comum no início.
        </p>
      </div>
    </div>
  );
};

export default FarinelliExercise;