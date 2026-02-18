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

const moduleConfigs: Record<ConservatoryModule, { 
  title: string, 
  phases: BreathingPhase[], 
  durations: number[],
  labels: Record<string, string>,
  narration: Record<string, string>,
  checklist: string
}> = {
  farinelli: {
    title: 'Breathing Gym',
    phases: ['inhale', 'hold', 'exhale', 'rest'],
    durations: [4, 4, 4, 4],
    labels: { inhale: 'INSPIRA', hold: 'SEGURA', exhale: 'EXPIRA', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Inspira.', hold: 'Segura.', exhale: 'Solta.', rest: 'Pausa.', idle: '' },
    checklist: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta.'
  },
  sovt: {
    title: 'Método Arnold Jacobs',
    phases: ['inhale', 'hold', 'exhale', 'rest'],
    durations: [4, 2, 8, 2],
    labels: { inhale: 'INSPIRA', hold: 'TRAVA', exhale: 'BOLHAS', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Inspira.', hold: 'Trava.', exhale: 'Bolhas.', rest: 'Pausa.', idle: '' },
    checklist: 'Separe seu canudo e copo d\'água. Foco no fluxo constante.'
  },
  panting: {
    title: 'Appoggio Clássico',
    phases: ['inhale', 'hold', 'exhale', 'rest'],
    durations: [2, 2, 2, 2],
    labels: { inhale: 'INSPIRA', hold: 'SEGURA', exhale: 'EXPIRA', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Inspira.', hold: 'Segura.', exhale: 'Solta.', rest: 'Pausa.', idle: '' },
    checklist: 'Foco no diafragma. Use o livro para biofeedback abdominal.'
  },
  alexander: {
    title: 'Técnica de Alexander',
    phases: ['inhale', 'hold', 'exhale', 'rest'],
    durations: [6, 2, 6, 2],
    labels: { inhale: 'EXPANDA', hold: 'MANTENHA', exhale: 'SOLTE', rest: 'RELAXE', idle: 'PRONTO' },
    narration: { inhale: 'Expanda.', hold: 'Mantenha.', exhale: 'Solte.', rest: 'Relaxe.', idle: '' },
    checklist: 'Alinhamento total. Relaxe o pescoço e alongue a coluna.'
  },
  'pitch-calibration': {
    title: 'Calibração de Tom',
    phases: ['inhale', 'hold', 'exhale', 'rest'],
    durations: [2, 1, 10, 2],
    labels: { inhale: 'PREPARE', hold: 'FOCO', exhale: 'CANTE', rest: 'PAUSA', idle: 'PRONTO' },
    narration: { inhale: 'Prepare.', hold: 'Foco.', exhale: 'Cante.', rest: 'Pausa.', idle: '' },
    checklist: 'Foco na precisão tonal. Mantenha a nota no centro.'
  },
  none: {
    title: 'Treinamento Vocal',
    phases: [],
    durations: [],
    labels: { inhale: '', hold: '', exhale: '', rest: '', idle: '' },
    narration: { inhale: '', hold: '', exhale: '', rest: '', idle: '' },
    checklist: ''
  }
};

const FarinelliExercise: React.FC<FarinelliExerciseProps> = ({ moduleType }) => {
  const config = useMemo(() => moduleConfigs[moduleType], [moduleType]);
  const { setStabilityScore, stabilityScore, stopAnalysis, setManualProgress } = useVocalSandbox();
  
  const [exerciseState, setExerciseState] = useState<BreathingPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(config.checklist);
  const [repCount, setRepCount] = useState(0);

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

      const firstPhase = config.phases[0];
      const firstDuration = config.durations[0];
      const firstMsg = config.narration[firstPhase];

      setRepCount(1);
      setExerciseState(firstPhase);
      setTimeLeft(firstDuration);
      setFeedback(firstMsg);
      speak(firstMsg);
      
      checkAudioLevel();
    } catch (err) {
      console.error("Mic error:", err);
      setFeedback("Erro: Microfone necessário!");
    }
  };

  useEffect(() => {
    if (exerciseState === 'idle') return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, exerciseState]);

  useEffect(() => {
    if (timeLeft === 0 && exerciseState !== 'idle') {
      const currentPhaseIndex = config.phases.indexOf(exerciseState);
      const nextPhaseIndex = currentPhaseIndex + 1;

      if (nextPhaseIndex < config.phases.length) {
        const nextPhase = config.phases[nextPhaseIndex];
        const nextDuration = config.durations[nextPhaseIndex];
        const nextMsg = config.narration[nextPhase];

        setExerciseState(nextPhase);
        setTimeLeft(nextDuration);
        setFeedback(nextMsg);
        speak(nextMsg);

        if (nextPhase === 'exhale') {
          stabilityRef.current = 100;
          setStabilityScore(100);
        }
      } else {
        accumulatedScoreRef.current += stabilityRef.current;
        const totalSeries = 3;
        setManualProgress(Math.floor((repCount / totalSeries) * 100));

        if (repCount < totalSeries) {
          const nextRep = repCount + 1;
          const firstPhase = config.phases[0];
          const firstDuration = config.durations[0];
          const firstMsg = config.narration[firstPhase];

          setRepCount(nextRep);
          setExerciseState(firstPhase);
          setTimeLeft(firstDuration);
          setFeedback(firstMsg);
          speak(firstMsg);
        } else {
          const finalAvg = accumulatedScoreRef.current / totalSeries;
          setExerciseState('idle');
          setFeedback("Fim.");
          speak("Fim.");
          stopAnalysis(finalAvg);
        }
      }
    }
  }, [timeLeft, exerciseState, repCount, setManualProgress, stopAnalysis, config]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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
            {exerciseState === 'idle' ? "Checklist" : config.title}
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
                  exerciseState === 'hold' ? "border-yellow-500 bg-yellow-500/10 scale-105" :
                  exerciseState === 'exhale' ? "border-accent bg-accent/10 scale-105" :
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