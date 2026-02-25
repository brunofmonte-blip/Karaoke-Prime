"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Lock, CheckCircle2, 
  Clock, Mic, Target, BrainCircuit, 
  Trophy, Sparkles, Play, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstructorAvatar from '@/components/InstructorAvatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Lesson() {
  const navigate = useNavigate();

  const modules = [
    {
      id: '1', title: 'A Base: Respiração Diafragmática', time: '01:00', type: 'practice', locked: false, hasScore: false,
      desc: 'Aprenda a ativar o diafragma para sustentar notas longas sem cansar as cordas vocais.',
      objectives: ['Inspirar (4s)', 'Segurar (4s)', 'Expirar emitindo som (10s)', 'Descansar (4s)'],
      recommendation: 'Pratique este exercício 3 vezes ao dia durante uma semana para automatizar o controle do seu diafragma e proteger suas cordas vocais.'
    },
    {
      id: '2', title: 'Controle de Fluxo de Ar', time: '01:00', type: 'practice', locked: false, hasScore: false,
      desc: 'Entenda como a pressão do ar afeta diretamente a estabilidade da sua voz. Mantenha um fluxo constante.',
      objectives: ['Inspirar (4s)', 'Expirar som contínuo de "S" (15s)', 'Descansar (3s)'],
      recommendation: 'Faça este aquecimento sempre antes de cantar para garantir que o ar não vaze nas notas mais difíceis.'
    },
    { id: '3', title: 'Prática: Sustentação de 5 Segundos', time: '03:00', type: 'mic', locked: true, hasScore: true, desc: 'Teste de resistência básica.', objectives: [], recommendation: '' },
    { id: '4', title: 'Aquecimento Labial (Trill)', time: '04:10', type: 'video', locked: true, hasScore: false, desc: 'Exercício de vibração labial.', objectives: [], recommendation: '' },
  ];

  const [activeMod, setActiveMod] = useState(modules[0]);
  const [step, setStep] = useState('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [breathPhase, setBreathPhase] = useState('PREPARAR');

  const streamRef = useRef<any>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // AUDIO & TTS SETUP
  useEffect(() => {
    bgMusicRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3');
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.15;
    }
    return () => {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'pt-BR';
      msg.rate = 1.0;
      msg.pitch = 1.0;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSelect = (mod: any) => {
    if (mod.locked) navigate('/premium');
    else {
      setActiveMod(mod);
      setStep('idle');
      stopPractice();
    }
  };

  const stopPractice = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: any) => track.stop());
      streamRef.current = null;
    }
    if (bgMusicRef.current) bgMusicRef.current.pause();
    window.speechSynthesis.cancel();
  };

  const startPractice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      if (bgMusicRef.current) {
        bgMusicRef.current.currentTime = 0;
        bgMusicRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      
      setStep('recording');
      setTimeLeft(60);
      speak("Iniciando ciclo de respiração. Prepare-se.");
    } catch (err) {
      toast.error("Erro ao acessar microfone");
    }
  };

  // TRIGGER VOICE WHEN PHASE CHANGES
  useEffect(() => {
    if (step === 'recording' && breathPhase !== 'PREPARAR') {
      const cleanText = breathPhase.split('(')[0].trim().toLowerCase();
      speak(cleanText);
    }
  }, [breathPhase, step]);

  // DYNAMIC BREATHING ENGINE
  useEffect(() => {
    let interval: any;
    if (step === 'recording') {
      let elapsed = 0;
      interval = setInterval(() => {
        elapsed++;
        setTimeLeft(60 - elapsed);
        
        if (activeMod.id === '1') {
          // Lesson 1: 4-4-10-4 (22s cycle)
          const cyclePos = elapsed % 22;
          if (cyclePos < 4) setBreathPhase('INSPIRAR');
          else if (cyclePos < 8) setBreathPhase('SEGURAR');
          else if (cyclePos < 18) setBreathPhase('EXPIRAR');
          else setBreathPhase('DESCANSAR');
        } else if (activeMod.id === '2') {
          // Lesson 2: 4-15-3 (22s cycle)
          const cyclePos = elapsed % 22;
          if (cyclePos < 4) setBreathPhase('INSPIRAR');
          else if (cyclePos < 19) setBreathPhase('EXPIRAR');
          else setBreathPhase('DESCANSAR');
        }

        if (elapsed >= 60) {
          clearInterval(interval);
          stopPractice();
          setStep('analyzing');
          setTimeout(() => {
            if (activeMod.hasScore) {
              setScore(Math.floor(Math.random() * 25) + 70);
            }
            setStep('result');
          }, 3000);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, activeMod.id, activeMod.hasScore]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/academy')} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Academy
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Nível 1: Breathing Gym
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-video rounded-3xl bg-black border-2 border-primary/30 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center p-6 w-full h-full justify-center">
                {step === 'idle' && (
                  <>
                    <InstructorAvatar />
                    <Button 
                      onClick={startPractice}
                      className="mt-8 h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/50 animate-in zoom-in duration-300"
                    >
                      <Mic className="h-10 w-10" />
                    </Button>
                    <p className="mt-4 text-white font-bold uppercase tracking-widest animate-pulse">
                      Iniciar Ciclo de Respiração
                    </p>
                  </>
                )}

                {step === 'recording' && (
                  <div className="flex flex-col items-center gap-6 w-full animate-in zoom-in duration-500">
                    <div className="relative">
                      <div className={cn(
                        "absolute inset-0 rounded-full animate-ping opacity-20",
                        breathPhase === 'EXPIRAR' ? "bg-accent" : "bg-primary"
                      )} />
                      <InstructorAvatar phase={breathPhase === 'EXPIRAR' ? 'exhale' : breathPhase === 'INSPIRAR' ? 'inhale' : 'suspend'} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className={cn(
                        "px-8 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all duration-500",
                        breathPhase === 'EXPIRAR' ? "bg-accent/20 border-accent shadow-[0_0_20px_rgba(255,153,0,0.3)]" : "bg-primary/20 border-primary shadow-[0_0_20px_rgba(0,168,225,0.3)]"
                      )}>
                        <span className="text-3xl font-black text-white tracking-tighter uppercase">{breathPhase}</span>
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tempo Restante: {timeLeft}s</span>
                      </div>
                    </div>

                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 linear" 
                        style={{ width: `${(timeLeft / 60) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}

                {step === 'analyzing' && (
                  <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                    <BrainCircuit className="h-20 w-20 text-accent animate-pulse" />
                    <h3 className="text-3xl font-black text-accent neon-gold-glow">IA Analisando...</h3>
                    <p className="text-gray-300 max-w-xs">Processando suporte diafragmático e constância de fluxo.</p>
                  </div>
                )}

                {step === 'result' && (
                  <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500 max-w-md">
                    {activeMod.hasScore ? (
                      <>
                        <div className="p-6 rounded-full bg-primary/20 border-4 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)]">
                          <Trophy className="h-16 w-16 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-5xl font-black text-white mb-1">{score}%</h3>
                          <p className="text-primary font-bold uppercase tracking-widest">Eficiência Respiratória</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-6 rounded-full bg-green-500/20 border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                          <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Treino Concluído!</h3>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left">
                          <div className="flex items-center gap-2 text-accent mb-2">
                            <Lightbulb className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Recomendação IA</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {activeMod.recommendation}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="flex gap-4 w-full">
                      <Button onClick={() => setStep('idle')} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">Tentar Novamente</Button>
                      <Button onClick={() => navigate('/academy')} className="flex-1 bg-primary text-black font-bold">Concluir Módulo</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-8 rounded-3xl glass-pillar border-2 border-primary/20 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{activeMod.title}</h2>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {activeMod.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground">
                  <Clock className="h-3 w-3" /> {activeMod.time}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" /> Objetivos da Aula
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeMod.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Conteúdo do Nível</h3>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">4 MÓDULOS</span>
            </div>
            <div className="space-y-3">
              {modules.map((mod) => (
                <Card 
                  key={mod.id} 
                  onClick={() => handleSelect(mod)}
                  className={cn(
                    "border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                    activeMod.id === mod.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-white/5 bg-white/5 hover:border-white/20",
                    mod.locked && "opacity-60"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center font-bold shrink-0",
                        activeMod.id === mod.id ? "bg-primary text-black" : "bg-white/10 text-gray-400"
                      )}>
                        {mod.type === 'practice' || mod.type === 'mic' ? <Mic className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className={cn("font-bold text-sm truncate", activeMod.id === mod.id ? "text-white" : "text-gray-400")}>{mod.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold mt-1">
                          <Clock className="h-3 w-3" /> {mod.time}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {mod.locked ? <Lock className="h-4 w-4 text-gray-600" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              onClick={() => navigate('/basic')}
              className="w-full py-8 mt-4 bg-accent hover:bg-accent/90 text-black font-black rounded-2xl shadow-lg shadow-accent/20 group"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              INICIAR PRÁTICA GUIADA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}