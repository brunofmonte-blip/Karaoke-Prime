"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Target, Zap, AlertCircle, Volume2, Activity, CheckCircle2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalibrationSubModule } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import PitchTuner from './PitchTuner';

interface PitchCalibrationExerciseProps {
  subModule: CalibrationSubModule;
  frequency: number;
  currentTime: number;
}

const subModuleConfigs: Record<CalibrationSubModule, { 
  title: string, 
  description: string,
  commands: string[],
  narration: string[],
  checklist: string
}> = {
  'laser-attack': {
    title: 'Ataque Laser & Audiation',
    description: 'Mentalize a nota e atinja o centro instantaneamente.',
    commands: ['MENTALIZE A NOTA', 'ATAQUE AGORA', 'MANTENHA O CENTRO'],
    narration: ['Mentalize a nota Dó quatro.', 'Ataque agora!', 'Mantenha o centro do afinador.'],
    checklist: 'Prepare-se para o ataque de precisão. Mentalize a frequência antes de emitir o som.'
  },
  'drone-sustain': {
    title: 'Sustentação em Drone',
    description: 'Mantenha estabilidade absoluta contra a nota pedal.',
    commands: ['OUÇA O DRONE', 'SINTA A VIBRAÇÃO', 'ESTABILIZE'],
    narration: ['Ouça a nota pedal em Dó.', 'Sinta a vibração da nota.', 'Estabilize sua voz contra o drone.'],
    checklist: 'O drone em Dó será ativado. Foque na pureza do intervalo e na ausência de batimentos.'
  },
  'blind-tuning': {
    title: 'Teste de Blind Tuning',
    description: 'Mantenha o tom enquanto o afinador desaparece.',
    commands: ['FOCO NO TOM', 'AFINADOR OCULTO', 'MOMENTO DA VERDADE'],
    narration: ['Foque no centro do tom.', 'O afinador irá desaparecer agora. Mantenha!', 'O afinador voltou. Confira sua precisão.'],
    checklist: 'O afinador ficará invisível por 10 segundos. Confie na sua memória muscular vocal.'
  },
  'none': {
    title: 'Calibração de Tom',
    description: '',
    commands: [],
    narration: [],
    checklist: ''
  }
};

const PitchCalibrationExercise: React.FC<PitchCalibrationExerciseProps> = ({ subModule, frequency, currentTime }) => {
  const config = subModuleConfigs[subModule];
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [commandIndex, setCommandIndex] = useState(0);
  const droneAudioRef = useRef<HTMLAudioElement | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const ptBrVoice = voices.find(v => v.lang === 'pt-BR' && (v.name.includes('Daniel') || v.name.includes('Male')));
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
        speak("Calibração iniciada!");
        setCountdown(null);
      }
    }
  }, [countdown]);

  // Blind Tuning Logic: Hide tuner between 10s and 20s
  const isTunerVisible = subModule !== 'blind-tuning' || (currentTime < 10 || currentTime > 20);

  useEffect(() => {
    if (isReady && countdown === null) {
      // Simple command rotation based on time
      const newIndex = Math.floor(currentTime / 10) % config.commands.length;
      if (newIndex !== commandIndex) {
        setCommandIndex(newIndex);
        speak(config.narration[newIndex]);
      }
    }
  }, [currentTime, isReady, countdown, config, commandIndex]);

  const handleReady = () => {
    setIsReady(true);
    setCountdown(3);
    toast.info("Dica de Ouro", {
      description: "Não treine calibração por mais de 15 minutos. O ouvido precisa de descanso.",
      duration: 6000,
      icon: <AlertCircle className="h-5 w-5 text-accent" />
    });
  };

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12 animate-in fade-in duration-500">
        <InstructorAvatar phase="rest" moduleType="pitch-calibration" />
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">{config.title}</h3>
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
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-8 w-full">
      <InstructorAvatar phase={frequency > 0 ? 'exhale' : 'rest'} moduleType="pitch-calibration" />

      <div className="flex flex-col items-center space-y-8 flex-grow w-full max-w-2xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-1 uppercase tracking-widest">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        <div className="w-full">
          <PitchTuner frequency={frequency} isVisible={isTunerVisible} />
        </div>

        <div className="w-full p-6 glass-pillar border-2 border-primary/20 rounded-2xl text-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Comando do Instrutor</p>
          <h4 className="text-2xl font-black text-primary neon-blue-glow animate-pulse">
            {config.commands[commandIndex]}
          </h4>
        </div>

        {subModule === 'drone-sustain' && (
          <div className="flex items-center gap-2 text-accent font-bold animate-pulse">
            <Music className="h-5 w-5" />
            DRONE EM DÓ (C4) ATIVO
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchCalibrationExercise;