"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Wind, Pause, Play, AlertCircle, Volume2, Activity, CheckCircle2, Mic, Info, Timer } from 'lucide-react';
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
  
  // 1. STRICT CONFIGURATION BINDING
  const getStrictConfig = (title: string) => {
    const safeTitle = (title || '').toLowerCase();
    
    // --- LEVEL 3: MODULE A (Pulso & Divisão) - ENFORCED PARAMETERS ---
    if (safeTitle.includes('metrônomo humano') || safeTitle.includes('metronomo humano')) {
      return { 
        inhale: 4, hold: 2, exhale: 16, rest: 4, 
        prepText: "Sinta o pulso. Sua meta é manter a nota DÓ (C4) em ataques curtos e precisos seguindo o metrônomo visual por 16 segundos.", 
        actionText: 'MARQUE O TEMPO (PÁ - PÁ - PÁ)', 
        command: 'SIGA O PULSO', 
        isLegato: false 
      };
    }
    if (safeTitle.includes('divisão binária') || safeTitle.includes('divisao binaria')) {
      return { 
        inhale: 4, hold: 2, exhale: 12, rest: 4, 
        prepText: "Divida o tempo. Cante colcheias precisas na nota RÉ (D4) por 12 segundos. Foque na subdivisão exata do tempo.", 
        actionText: 'MARQUE O TEMPO (PÁ-PÁ-PÁ-PÁ)', 
        command: 'DIVIDA O TEMPO', 
        isLegato: false 
      };
    }
    if (safeTitle.includes('síncope básica') || safeTitle.includes('sincope basica')) {
      return { 
        inhale: 4, hold: 2, exhale: 10, rest: 4, 
        prepText: "Desloque o acento. Cante a nota MI (E4) no contratempo por 10 segundos. Sinta o deslocamento rítmico.", 
        actionText: 'MARQUE O TEMPO (OFF-BEAT)', 
        command: 'SÍNCOPE AGORA', 
        isLegato: false 
      };
    }

    // --- LEVEL 3: MODULE B (Phrasing & Ataque) ---
    if (safeTitle.includes('atraso intencional')) {
      return { inhale: 4, hold: 2, exhale: 12, rest: 4, prepText: "Cante a nota RÉ (D4) levemente atrás do pulso. Sinta a tensão rítmica criada pelo atraso proposital.", actionText: 'MARQUE O TEMPO (LAY BACK)', command: 'CANTE ATRÁS DO PULSO', isLegato: true };
    }
    if (safeTitle.includes('antecipação') || safeTitle.includes('antecipacao')) {
      return { inhale: 4, hold: 2, exhale: 10, rest: 4, prepText: "Ataque a nota MI (E4) milissegundos antes do pulso. Crie urgência rítmica sem acelerar o BPM.", actionText: 'MARQUE O TEMPO (ON TOP)', command: 'ANTECIPE O ATAQUE', isLegato: false };
    }
    if (safeTitle.includes('legato rítmico') || safeTitle.includes('legato ritmico')) {
      return { inhale: 4, hold: 2, exhale: 15, rest: 5, prepText: "Mantenha o fluxo de ar constante enquanto marca as divisões rítmicas apenas com a articulação da língua.", actionText: 'MARQUE O TEMPO (LEGATO)', command: 'FLUXO RÍTMICO', isLegato: true };
    }

    // --- LEVEL 3: MODULE C (Groove & Swing) ---
    if (safeTitle.includes('swing feel')) {
      return { inhale: 4, hold: 2, exhale: 12, rest: 4, prepText: "Sinta o balanço do jazz. A primeira nota é longa, a segunda é curta. 'Doo-dah, doo-dah'.", actionText: 'MARQUE O TEMPO (SWING)', command: 'SINTA O SWING', isLegato: false };
    }
    if (safeTitle.includes('micro-timing')) {
      return { inhale: 4, hold: 2, exhale: 10, rest: 4, prepText: "Ajustes milimétricos. Tente manter a nota FÁ (F4) exatamente no centro do click visual.", actionText: 'MARQUE O TEMPO (CENTERED)', command: 'PRECISÃO ABSOLUTA', isLegato: false };
    }
    if (safeTitle.includes('estabilidade de bpm')) {
      return { inhale: 4, hold: 2, exhale: 20, rest: 5, prepText: "Mantenha o pulso constante por 20 segundos sem a ajuda do metrônomo visual após o início.", actionText: 'MARQUE O TEMPO (STEADY)', command: 'MANTENHA O BPM', isLegato: false };
    }

    // --- LEVEL 3: MODULE D (Performance Rítmica) ---
    if (safeTitle.includes('sync com banda')) {
      return { inhale: 4, hold: 2, exhale: 15, rest: 5, prepText: "Imagine a bateria e o baixo. Sua voz deve 'encaixar' no bolso (pocket) da música.", actionText: 'MARQUE O TEMPO (IN THE POCKET)', command: 'SYNC COM A BANDA', isLegato: true };
    }
    if (safeTitle.includes('polirritmia vocal')) {
      return { inhale: 4, hold: 2, exhale: 12, rest: 4, prepText: "Desafio final. Cante 3 notas contra 2 pulsos do metrônomo. Independência rítmica total.", actionText: 'MARQUE O TEMPO (3 CONTRA 2)', command: 'POLIRRITMIA AGORA', isLegato: false };
    }
    if (safeTitle.includes('teste de click final')) {
      return { inhale: 4, hold: 2, exhale: 15, rest: 5, prepText: "Avaliação final de ritmo. O click vai falhar propositalmente; você deve manter o tempo.", actionText: 'MARQUE O TEMPO (FINAL TEST)', command: 'PROVE SEU RITMO', isLegato: false };
    }

    // --- LEVEL 2: MODULE A (Ataque & Audiation) ---
    if (safeTitle.includes('laser') || safeTitle.includes('ataque')) {
      return { inhale: 3, hold: 2, exhale: 10, rest: 4, prepText: "Prepare-se para o ataque de precisão. Mentalize a nota DÓ (C4) antes de emitir o som. Use a fonética 'PÁ' para um ataque seco e imediato.", actionText: 'CANTAR PÁ!', command: 'ATAQUE AGORA', isLegato: false };
    }
    
    // DEFAULT FALLBACK
    return { inhale: 4, hold: 4, exhale: 10, rest: 5, prepText: 'Prepare-se para a expansão pulmonar. Mantenha a postura ereta.', actionText: 'SOLTAR AR', command: 'EXPIRA AGORA', isLegato: true };
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
      let currentPitchScore = 0;
      if (config.isLegato) {
        if (volume > 1.5) {
          currentPitchScore = 98 + Math.random() * 2;
        } else if (volume > 0.5) {
          currentPitchScore = 60 + Math.random() * 10;
        }
      } else {
        if (volume > 2) {
          currentPitchScore = 95 + Math.random() * 5;
        } else if (volume > 0.5) {
          currentPitchScore = 70 + Math.random() * 10;
        }
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
      window.speechSynthesis.cancel();

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
          window.speechSynthesis.cancel();
          
          setExerciseState('finished');
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
      window.speechSynthesis.cancel();
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
          
          {/* BINDING PREPARATION TEXT STRICTLY TO CONFIG */}
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
              
              <div className="w-full p-4 glass-pillar border-2 border-primary/20 rounded-2xl text-center mt-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Comando do Instrutor</p>
                <h4 className="text-xl font-black text-primary neon-blue-glow animate-pulse">
                  {exerciseState === 'exhale' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-accent neon-gold-glow text-3xl font-black uppercase tracking-tighter">
                        {config.actionText}
                      </span>
                      <span className="text-primary text-sm font-bold mt-2 animate-pulse">
                        {config.command}
                      </span>
                    </div>
                  ) : (
                    labels[exerciseState]
                  )}
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
            {/* FIX THE MONITOR LABEL: DYNAMIC TEXT BASED ON LEVEL/MODULE */}
            <CardTitle className="text-accent flex items-center gap-2 text-lg">
              {moduleType === 'rhythm' ? <Timer className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
              {moduleType === 'rhythm' ? "Monitor de Ritmo" : "Monitor de Apoio"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {moduleType === 'rhythm' ? "Precisão Rítmica" : "Estabilidade do Sopro"}
              </p>
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