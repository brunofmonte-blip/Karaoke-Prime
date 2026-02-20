"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Target, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalibrationSubModule, useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import PitchTuner from './PitchTuner';
import { toast } from 'sonner';
import { level4Modules } from './AcademyLevel4Menu';

interface PitchCalibrationExerciseProps {
  subModule: CalibrationSubModule;
  frequency: number;
  currentTime: number;
}

const PitchCalibrationExercise: React.FC<PitchCalibrationExerciseProps> = ({ subModule, frequency, currentTime }) => {
  const { activeExerciseTitle, activeExerciseId } = useVocalSandbox();
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const config = useMemo(() => {
    const safeTitle = normalize(activeExerciseTitle || '');
    const safeId = (activeExerciseId || '').toLowerCase();

    // --- DYNAMIC LOOKUP FROM LEVEL 4 ROOT DATA ---
    for (const module of level4Modules) {
      const found = module.exercises.find(ex => ex.id.toLowerCase() === safeId || normalize(ex.title).includes(safeTitle));
      if (found && found.prepText) {
        return {
          title: found.title,
          description: module.description,
          command: found.command || 'ATAQUE AGORA',
          prepText: found.prepText,
          actionText: found.actionText || 'CANTAR'
        };
      }
    }

    // Fallback for generic calibration
    return {
      title: 'Calibração de Tom',
      description: 'Ajuste sua frequência vocal com precisão.',
      command: 'CANTAR',
      prepText: 'Prepare-se para a calibração. Mentalize a nota alvo antes de emitir o som.',
      actionText: 'CANTAR'
    };
  }, [activeExerciseTitle, activeExerciseId]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isReady && config.prepText) {
      const timer = setTimeout(() => speak(config.prepText), 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, config.prepText]);

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        speak(countdown.toString());
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        speak(config.command);
        setCountdown(null);
      }
    }
  }, [countdown, config.command]);

  const isTunerVisible = subModule !== 'blind-tuning' || (currentTime < 10 || currentTime > 20);

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
        <InstructorAvatar phase="rest" moduleType="pitch-calibration" subModule={subModule} actionPhaseName={config.actionText} />
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-4 uppercase tracking-widest">{config.title}</h3>
          <p className="text-lg text-foreground mb-8 leading-relaxed">{config.prepText}</p>
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
      <InstructorAvatar 
        phase={frequency > 0 ? 'exhale' : 'rest'} 
        moduleType="pitch-calibration" 
        subModule={subModule} 
        actionPhaseName={config.actionText}
      />

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
            {config.actionText}
          </h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
            {frequency > 0 ? "VOZ ATIVA - ANALISANDO..." : "AGUARDANDO VOZ..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PitchCalibrationExercise;