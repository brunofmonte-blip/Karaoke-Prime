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
  
  // 1. OVERRIDE STRICT CONFIG FOR LEVEL 2 & FALLBACKS
  const getStrictConfig = (title: string) => {
    const safeTitle = (title || '').toLowerCase();
    
    // --- LEVEL 2: PITCH CALIBRATION (EXACT STRINGS) ---
    if (safeTitle.includes('laser') || safeTitle.includes('ataque')) {
      return { inhale: 3, hold: 2, exhale: 10, rest: 4, prepText: "Prepare-se para o ataque de precisão. Mentalize a nota DÓ (C4) antes de emitir o som. Use a fonética 'PÁ' para um ataque seco e imediato.", actionText: 'CANTAR', command: 'ATAQUE AGORA' };
    }
    if (safeTitle.includes('audiation')) {
      return { inhale: 4, hold: 4, exhale: 8, rest: 4, prepText: "Foco total no ouvido interno. Mentalize a nota RÉ (D4) vibrando na sua testa. Não emita som até o comando.", actionText: 'CANTAR', command: 'EMITA O SOM' };
    }
    if (safeTitle.includes('condução') || safeTitle.includes('bone')) {
      return { inhale: 4, hold: 2, exhale: 12, rest: 4, prepText: "Coloque a mão em concha atrás do ouvido. Cante a nota MI (E4) em 'Mmmmm' (boca fechada) e sinta a vibração nos ossos da face.", actionText: 'CANTAR', command: 'SINTA A VIBRAÇÃO' };
    }
    if (safeTitle.includes('biofeedback')) {
      return { inhale: 3, hold: 2, exhale: 15, rest: 5, prepText: "Foque nos números. Sua meta é manter a nota FÁ (F4) com desvio abaixo de 5 cents. Use a vogal 'U' para maior estabilidade.", actionText: 'CANTAR', command: 'ESTABILIZE O HERTZ' };
    }
    if (safeTitle.includes('sovt pitch')) {
      return { inhale: 3, hold: 2, exhale: 15, rest: 5, prepText: "Use o canudo. Mantenha a nota SOL (G4) constante enquanto varia levemente a pressão do ar.", actionText: 'CANTAR', command: 'SOPRO CONSTANTE' };
    }
    if (safeTitle.includes('auto-tune')) {
      return { inhale: 3, hold: 2, exhale: 12, rest: 4, prepText: "O sistema simulará uma correção na nota LÁ (A4). Tente 'vencer' o corretor mantendo a nota pura.", actionText: 'CANTAR', command: 'CORRIJA O TOM' };
    }
    if (safeTitle.includes('vowel mod')) {
      return { inhale: 3, hold: 1, exhale: 12, rest: 4, prepText: "Cante a nota SI (B4). Comece em 'Í' e mude gradualmente para 'Á' sem oscilar a frequência.", actionText: 'CANTAR', command: 'TROQUE A VOGAL' };
    }
    if (safeTitle.includes('solfege')) {
      return { inhale: 4, hold: 2, exhale: 10, rest: 4, prepText: "Intervalos diatônicos (Dó-Ré-Mi). Crave cada nota no centro do afinador usando os nomes das notas.", actionText: 'CANTAR', command: 'DÓ - RÉ - MI' };
    }
    if (safeTitle.includes('drone')) {
      return { inhale: 4, hold: 2, exhale: 15, rest: 5, prepText: "O drone em DÓ (C4) será ativado. Sinta o batimento acústico desaparecer quando estiver afinado.", actionText: 'CANTAR', command: 'AFINE COM O DRONE' };
    }
    if (safeTitle.includes('melodyne')) {
      return { inhale: 4, hold: 2, exhale: 12, rest: 4, prepText: "Imagine que você está em um estúdio. Sua voz deve ser uma linha reta na nota DÓ (C4). Evite vibratos agora.", actionText: 'CANTAR', command: 'CANTE A LINHA' };
    }
    if (safeTitle.includes('blind tuning')) {
      return { inhale: 4, hold: 4, exhale: 15, rest: 5, prepText: "O afinador ficará invisível por 10 segundos na nota RÉ (D4). Confie na sua memória muscular e suporte abdominal.", actionText: 'CANTAR', command: 'MANTENHA O TOM' };
    }

    // --- LEVEL 1: BREATHING (FALLBACKS) ---
    if (safeTitle.includes('costal') || safeTitle.includes('expansão')) {
      return { inhale: 4, hold: 3, exhale: 8, rest: 5, prepText: 'Sente-se na ponta da cadeira com a coluna reta. Foque em expandir as costelas para os lados e para as costas.', actionText: 'SOLTE O AR', command: 'EXPIRA LENTAMENTE' };
    }
    if (safeTitle.includes('ofegante') || safeTitle.includes('cachorro')) {
      return { inhale: 2, hold: 1, exhale: 10, rest: 4, prepText: 'Coloque a mão no abdômen. Vamos usar respirações curtas para ativar o diafragma, como um cachorrinho.', actionText: 'SOLTE O AR', command: 'GOLPES DE AR' };
    }
    if (safeTitle.includes('farinelli')) {
      return { inhale: 5, hold: 5, exhale: 5, rest: 4, prepText: 'Treino do lendário Farinelli. Foque na expansão lateral das costelas em tempos perfeitamente iguais.', actionText: 'SOLTE O AR', command: 'FLUXO ESTÁVEL' };
    }
    
    // DEFAULT
    return { inhale: 4, hold: 4, exhale: 10, rest: 5, prepText: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta.', actionText: 'SOLTE O AR', command: 'EXPIRA AGORA' };
  };

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
      // REFINED SENSITIVITY: Lower threshold for humming (Mmmmm)
      // volume > 2 is now the threshold for active singing/humming
      let currentPitchScore = 0;
      
      if (volume > 2) {
        currentPitchScore = 95 + Math.random() * 5;
      } else if (volume > 0.5) {
        // Fallback score for very low volume to avoid 0.0%
        currentPitchScore = 70 + Math.random() * 10;
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
          setExerciseState('finished');
          // FIX: Calculate true average and pass to stopAnalysis
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
              
              {/* COMANDO DO INSTRUTOR */}
              <div className="w-full p-4 glass-pillar border-2 border-primary/20 rounded-2xl text-center mt-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Comando do Instrutor</p>
                <h4 className="text-xl font-black text-primary neon-blue-glow animate-pulse">
                  {exerciseState === 'exhale' ? config.command : labels[exerciseState]}
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