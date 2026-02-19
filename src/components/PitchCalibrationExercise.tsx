"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Target, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalibrationSubModule } from '@/hooks/use-vocal-sandbox';
import InstructorAvatar from './InstructorAvatar';
import PitchTuner from './PitchTuner';
import { toast } from 'sonner';

interface PitchCalibrationExerciseProps {
  subModule: CalibrationSubModule;
  frequency: number;
  currentTime: number;
}

// Standardized Config: Removed arrays to prevent ghost switching
const subModuleConfigs: Record<CalibrationSubModule, { 
  title: string, 
  description: string,
  command: string,
  prepText: string,
  actionText: string
}> = {
  'laser-attack': {
    title: 'Ataque Laser & Audiation',
    description: 'Mentalize a nota e atinja o centro instantaneamente.',
    command: 'ATAQUE AGORA',
    prepText: "Prepare-se para o ataque de precisão. Mentalize a nota DÓ (C4) antes de emitir o som. Use a fonética 'PÁ' para um ataque seco e imediato.",
    actionText: 'CANTAR PÁ!'
  },
  'audiation': {
    title: 'Audiation (Mentalization)',
    description: 'Treine seu ouvido interno para prever a nota.',
    command: 'EMITA O SOM',
    prepText: "Foco total no ouvido interno. Mentalize a nota RÉ (D4) vibrando na sua testa. Não emita som até o comando.",
    actionText: 'CANTAR AAAAA'
  },
  'bone-conduction': {
    title: 'Condução Óssea',
    description: 'Sinta a vibração interna para calibração física.',
    command: 'SINTA A VIBRAÇÃO',
    prepText: "Coloque a mão em concha atrás do ouvido. Cante a nota MI (E4) em 'Mmmmm' (boca fechada) e sinta a vibração nos ossos da face.",
    actionText: 'CANTAR MMMMM'
  },
  'biofeedback': {
    title: 'Biofeedback (Hertz/Cents)',
    description: 'A ciência exata da sua frequência vocal.',
    command: 'ESTABILIZE O HERTZ',
    prepText: "Foque nos números. Sua meta é manter a nota FÁ (F4) com desvio abaixo de 5 cents. Use a vogal 'U' para maior estabilidade.",
    actionText: 'CANTAR UUUUU'
  },
  'sovt-pitch': {
    title: 'SOVT Pitch Control',
    description: 'Controle de tom com resistência de fluxo.',
    command: 'SOPRO CONSTANTE',
    prepText: "Use o canudo. Mantenha a nota SOL (G4) constante enquanto varia levemente a pressão do ar.",
    actionText: 'SOPRAR UUUUU'
  },
  'autotune-realtime': {
    title: 'Auto-Tune Real-Time',
    description: 'Simulação de correção para percepção de erro.',
    command: 'CORRIJA O TOM',
    prepText: "O sistema simulará uma correção na nota LÁ (A4). Tente 'vencer' o corretor mantendo a nota pura.",
    actionText: 'CANTAR AAAAA'
  },
  'vowel-mod': {
    title: 'Vowel Modification',
    description: 'Mantenha a afinação ao trocar de vogal.',
    command: 'TROQUE A VOGAL',
    prepText: "Cante a nota SI (B4). Comece em 'Í' e mude gradualmente para 'Á' sem oscilar a frequência.",
    actionText: 'CANTAR AAAAA-OOOOO'
  },
  'solfege': {
    title: 'Solfège (Do-Re-Mi)',
    description: 'Treinamento de intervalos clássicos.',
    command: 'DÓ - RÉ - MI',
    prepText: "Intervalos diatônicos (Dó-Ré-Mi). Crave cada nota no centro do afinador usando os nomes das notas.",
    actionText: 'CANTAR DÓ-RÉ-MI'
  },
  'drone-sustain': {
    title: 'Sustentação em Drone',
    description: 'Mantenha estabilidade absoluta contra a nota pedal.',
    command: 'AFINE COM O DRONE',
    prepText: "O drone em DÓ (C4) será ativado. Sinta o batimento acústico desaparecer quando estiver afinado.",
    actionText: 'CANTAR AAAAA'
  },
  'melodyne-analysis': {
    title: 'Melodyne Analysis',
    description: 'Análise visual de estúdio da sua linha vocal.',
    command: 'CANTE A LINHA',
    prepText: "Imagine que você está em um estúdio. Sua voz deve ser uma linha reta na nota DÓ (C4). Evite vibratos agora.",
    actionText: 'CANTAR AAAAA'
  },
  'blind-tuning': {
    title: 'Teste de Blind Tuning',
    description: 'Mantenha o tom enquanto o afinador desaparece.',
    command: 'MANTENHA O TOM',
    prepText: "O afinador ficará invisível por 10 segundos na nota RÉ (D4). Confie na sua memória muscular e suporte abdominal.",
    actionText: 'CANTAR AAAAA'
  },
  'none': {
    title: 'Calibração de Tom',
    description: '',
    command: 'CANTAR',
    prepText: '',
    actionText: 'CANTAR'
  }
};

const PitchCalibrationExercise: React.FC<PitchCalibrationExerciseProps> = ({ subModule, frequency, currentTime }) => {
  const config = subModuleConfigs[subModule];
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

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
            {frequency > 0 ? config.command : "AGUARDANDO VOZ..."}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default PitchCalibrationExercise;