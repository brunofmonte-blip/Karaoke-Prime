import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Info, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [step, setStep] = useState<'video' | 'practice'>('video');
  
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 

  const moduleContent = {
    level: "Nível 1",
    moduleName: "Fundamentos e Respiração",
    lessons: [
      { id: 0, displayTitle: "Introdução", title: "Fundamentos e Respiração", youtubeId: "m75jPge9QUM", description: "Bem-vindo ao seu primeiro passo.", hasPractice: false, locked: false },
      { id: 1, displayTitle: "Aula 1", title: "Respiração Diafragmática", youtubeId: "Wl6xUHg9iAQ", description: "A fundação de tudo.", hasPractice: true, exercise: "Ciclo 4-4-10-4", practiceDesc: "Inspirar (4s), Segurar (4s), Expirar (10s) e Descansar (4s).", locked: false },
      { id: 2, displayTitle: "Aula 2", title: "Controle de Fluxo de Ar", youtubeId: "fQKI_SFrrOo", description: "Cantar não é sobre a força do ar, mas sobre o controle.", hasPractice: true, exercise: "Emissão de 'S' (15s)", practiceDesc: "Treino de resistência e economia de ar.", locked: false },
      { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", description: "A aplicação do fluxo de ar, agora usando a voz.", hasPractice: true, exercise: "Sustentação de Nota", practiceDesc: "Treino de constância de afinação e fôlego.", locked: true },
      { id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", description: "O exercício mais famoso dos cantores.", hasPractice: true, exercise: "Lip Trill de 10s", practiceDesc: "Vibração contínua dos lábios.", locked: true }
    ]
  };

  const currentLesson = moduleContent.lessons[activeLessonIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (trainingStatus === 'countdown') {
      if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      else { setTrainingStatus('active'); setTimeLeft(60); }
    } else if (trainingStatus === 'active') {
      if (timeLeft > 0) timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      else setTrainingStatus('finished');
    }
    return () => clearTimeout(timer);
  }, [trainingStatus, countdown, timeLeft]);

  const getCycleState = () => {
    const elapsed = 60 - timeLeft; 
    const t = elapsed % 22; 
    if (t < 4) return { phase: 'INSPIRAR', instruction: 'Inspira por 4 segundos', color: 'cyan', icon: Wind };
    if (t < 8) return { phase: 'SEGURAR', instruction: 'Segura por 4 segundos', color: 'orange', icon: Lock };
    if (t < 18) return { phase: 'EXPIRAR', instruction: 'Expira por 10 segundos', color: 'blue', icon: Mic2 };
    return { phase: 'DESCANSAR', instruction: 'Descansa por 4 segundos', color: 'gray', icon: Coffee };
  };

  const cycleState = getCycleState();
  const CycleIcon = cycleState.icon;

  const changeLesson = (index: number) => {
    if (moduleContent.lessons[index].locked) {
      navigate('/premium');
      return;
    }
    setActiveLessonIndex(index);
    setStep('video');
    setTrainingStatus('idle');
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700 text-white">
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-3 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              <PlayCircle size={14} /> Masterclass • {moduleContent.level} 
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase drop-shadow-lg leading-tight">
              {currentLesson.displayTitle}:<br/>
              <span className={!currentLesson.hasPractice ? "text-orange-500" : "text-cyan-400"}>{currentLesson.title}</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {step === 'video' ? (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 mb-8">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0&modestbranding=1`} title={currentLesson.title} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex justify-end">
                  {currentLesson.hasPractice && (
                    <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xl italic uppercase tracking-tighter transition-all">
                      Ir para Treinamento <ArrowLeft size={20} className="ml-3 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Card className="bg-zinc-950/80 backdrop-blur-xl border-cyan-400/30 rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col justify-center items-center">
                {trainingStatus === 'idle' ? (
                  <div className="flex flex-col items-center text-center">
                    <Mic2 className="h-16 w-16 text-cyan-400 mb-6" />
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{currentLesson.exercise}</h2>
                    <p className="text-gray-400 mb-10">{currentLesson.practiceDesc}</p>
                    <Button onClick={() => setTrainingStatus('countdown')} className="h-16 px-12 rounded-full bg-cyan-400 text-black font-black uppercase">INICIAR TREINO</Button>
                  </div>
                ) : trainingStatus === 'active' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative flex items-center justify-center mb-8">
                      <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`transition-all duration-1000 ease-linear ${cycleState.color === 'cyan' ? 'text-cyan-400' : 'text-orange-500'}`} />
                      </svg>
                      <div className="absolute text-center">
                        <CycleIcon size={40} className="mx-auto mb-2" />
                        <p className="font-black text-2xl italic">{cycleState.phase}</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-cyan-400 uppercase tracking-widest">{cycleState.instruction}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle2 size={64} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-black italic mb-8">TREINO CONCLUÍDO!</h2>
                    <Button onClick={() => setStep('video')} className="bg-white text-black font-black rounded-full px-12 h-14">VOLTAR PARA AULA</Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs mb-4">
              <ListVideo size={18} className="text-cyan-400" /> Playlist
            </div>
            {moduleContent.lessons.map((lesson, idx) => (
              <Card key={idx} onClick={() => changeLesson(idx)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeLessonIndex === idx ? 'bg-cyan-400/10 border-cyan-400' : 'bg-zinc-950 border-white/10 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  {lesson.locked ? <Lock size={16} /> : <PlayCircle size={18} />}
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">{lesson.displayTitle}</p>
                    <h4 className="text-xs font-black uppercase italic">{lesson.title}</h4>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}