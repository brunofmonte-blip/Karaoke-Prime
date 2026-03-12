import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Volume2, Star, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [step, setStep] = useState<'video' | 'practice'>('video');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 

  // Configuração das Aulas e Exercícios específicos
  const moduleContent = {
    lessons: [
      { id: 0, displayTitle: "Introdução", title: "Fundamentos e Respiração", youtubeId: "m75jPge9QUM", hasPractice: false, locked: false },
      { 
        id: 1, 
        displayTitle: "Aula 1", 
        title: "Respiração Diafragmática", 
        youtubeId: "Wl6xUHg9iAQ", 
        hasPractice: true, 
        exercise: "Ciclo 4-4-10-4", 
        practiceDesc: "A base do controle de ar: Inspira, segura, expira e descansa.",
        cycleTime: 22, // 4+4+10+4
        locked: false 
      },
      { 
        id: 2, 
        displayTitle: "Aula 2", 
        title: "Controle de Fluxo (S)", 
        youtubeId: "fQKI_SFrrOo", 
        hasPractice: true, 
        exercise: "Emissão Constante de 'S'", 
        practiceDesc: "Mantenha o som de 'S' o mais constante e longo possível.",
        cycleTime: 20, // Ciclo diferente para a aula 2
        locked: false 
      },
      { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", hasPractice: true, locked: true },
    ]
  };

  const currentLesson = moduleContent.lessons[activeLessonIndex];

  // Controle do Cronômetro e Áudio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (trainingStatus === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setTrainingStatus('active');
        if (audioRef.current) {
          audioRef.current.volume = 0.2;
          audioRef.current.play();
        }
      }
    } else if (trainingStatus === 'active') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setTrainingStatus('finished');
        if (audioRef.current) audioRef.current.pause();
      }
    }
    return () => clearTimeout(timer);
  }, [trainingStatus, countdown, timeLeft]);

  // Lógica de Narração Visual Dinâmica
  const getInstruction = () => {
    const elapsed = 60 - timeLeft;
    
    // Lógica específica para Aula 1 (4-4-10-4)
    if (currentLesson.id === 1) {
      const t = elapsed % 22;
      if (t < 4) return { phase: 'INSPIRA', msg: 'Inspira por 4 segundos', color: 'text-cyan-400', icon: Wind };
      if (t < 8) return { phase: 'SEGURA', msg: 'Segura por 4 segundos', color: 'text-orange-500', icon: Lock };
      if (t < 18) return { phase: 'EXPIRA', msg: 'Expira por 10 segundos', color: 'text-blue-400', icon: Mic2 };
      return { phase: 'DESCANSA', msg: 'Descansa por 4 segundos', color: 'text-gray-500', icon: Coffee };
    }
    
    // Lógica específica para Aula 2 (Controle de S)
    if (currentLesson.id === 2) {
      const t = elapsed % 20;
      if (t < 5) return { phase: 'INSPIRA', msg: 'Inspira fundo pelo nariz', color: 'text-cyan-400', icon: Wind };
      if (t < 18) return { phase: 'SOLTE O "S"', msg: 'Mantenha o "S" constante', color: 'text-orange-500', icon: Volume2 };
      return { phase: 'DESCANSA', msg: 'Relaxe os ombros', color: 'text-gray-500', icon: Coffee };
    }

    return { phase: 'TREINANDO', msg: 'Continue o exercício', color: 'text-white', icon: Activity };
  };

  const instruction = getInstruction();
  const Icon = instruction.icon;

  // Círculo de Progresso
  const radius = 80;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (timeLeft / 60) * circ;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-12 px-4 relative overflow-hidden">
      {/* Áudio de Fundo (Trilha Zen) */}
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" loop />

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => navigate('/academy')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-all">
          <ArrowLeft size={14} /> Voltar para Academy
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ÁREA PRINCIPAL */}
          <div className="lg:col-span-2">
            {step === 'video' ? (
              <div className="animate-in fade-in duration-500">
                <div className="aspect-video w-full bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-6">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0`} frameBorder="0" allowFullScreen />
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{currentLesson.title}</h2>
                  {currentLesson.hasPractice && (
                    <Button onClick={() => setStep('practice')} className="bg-cyan-400 text-black font-black uppercase rounded-full px-8 h-12 hover:bg-white transition-all">
                      Iniciar Treinamento
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Card className="bg-zinc-950/50 border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center min-h-[500px] text-center">
                {trainingStatus === 'idle' ? (
                  <>
                    <Mic2 size={48} className="text-cyan-400 mb-6" />
                    <h2 className="text-3xl font-black uppercase italic mb-4">{currentLesson.exercise}</h2>
                    <p className="text-gray-400 max-w-md mb-8">{currentLesson.practiceDesc}</p>
                    <Button onClick={() => setTrainingStatus('countdown')} className="bg-white text-black font-black uppercase rounded-full px-12 h-16 text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      Começar Agora
                    </Button>
                  </>
                ) : trainingStatus === 'countdown' ? (
                  <h1 className="text-9xl font-black italic text-cyan-400 animate-pulse">{countdown}</h1>
                ) : trainingStatus === 'active' ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circ} strokeDashoffset={offset} className="text-cyan-400 transition-all duration-1000 ease-linear" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-black italic">{timeLeft}s</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Restantes</span>
                      </div>
                    </div>
                    <Icon size={32} className={`${instruction.color} mb-2 animate-bounce`} />
                    <h3 className={`text-4xl font-black italic uppercase ${instruction.color}`}>{instruction.phase}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{instruction.msg}</p>
                  </div>
                ) : (
                  <div className="animate-in zoom-in duration-500">
                    <CheckCircle2 size={64} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-black italic uppercase mb-4">Treino Concluído!</h2>
                    <p className="text-gray-400 mb-8 uppercase text-xs font-bold tracking-widest">Excelente progresso, continue assim.</p>
                    <Button onClick={() => {setStep('video'); setTrainingStatus('idle'); setTimeLeft(60);}} className="bg-white text-black font-black uppercase rounded-full px-10 h-14">
                      Voltar para Aula
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* PLAYLIST LATERAL */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-gray-400">
              <ListVideo size={16} /> Próximas Aulas
            </h3>
            {moduleContent.lessons.map((lesson, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (!lesson.locked) {
                    setActiveLessonIndex(idx);
                    setStep('video');
                    setTrainingStatus('idle');
                    setTimeLeft(60);
                  } else {
                    navigate('/premium');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeLessonIndex === idx ? 'bg-cyan-400/10 border-cyan-400' : 'bg-zinc-950 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${lesson.locked ? 'bg-white/5 text-gray-600' : 'bg-cyan-400/20 text-cyan-400'}`}>
                    {lesson.locked ? <Lock size={14} /> : activeLessonIndex === idx ? <Video size={14} /> : <PlayCircle size={14} />}
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase">{lesson.displayTitle}</p>
                    <h4 className="text-[10px] font-black uppercase italic">{lesson.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}