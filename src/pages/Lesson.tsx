import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Info, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Lesson = () => {
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
      { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", description: "A aplicação do fluxo de ar, mas agora usando a voz de verdade.", hasPractice: true, exercise: "Sustentação de Nota", practiceDesc: "Treino de constância de afinação e fôlego.", locked: true },
      { id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", description: "O exercício mais famoso dos cantores.", hasPractice: true, exercise: "Lip Trill de 10s", practiceDesc: "Vibração contínua dos lábios.", locked: true },
      { id: 5, displayTitle: "Aula 5", title: "Soltando a Língua", youtubeId: "vImzV9TdLdo", description: "Exercício fundamental de vibração de língua.", hasPractice: true, exercise: "Trinado de Língua", practiceDesc: "Vibração de língua contínua.", locked: true },
      { id: 6, displayTitle: "Aula 6", title: "Sirene Vocal", youtubeId: "ZsvFS4u2P8I", description: "Conectando Graves e Agudos sem a voz 'quebrar'.", hasPractice: true, exercise: "Sirene Completa", practiceDesc: "Transição suave de registros.", locked: true },
      { id: 7, displayTitle: "Aula 7", title: "Articulação Exagerada", youtubeId: "PW3Oj_uagpI", description: "Aprenda a abrir espaço interno para o som brilhar.", hasPractice: true, exercise: "Leitura Articulada", practiceDesc: "Projeção clara de vogais.", locked: true },
      { id: 8, displayTitle: "Aula 8", title: "Ataque Vocal Suave", youtubeId: "KqVkz8jdcpc", description: "Evite o 'Golpe de Glote'.", hasPractice: true, exercise: "Início com 'H'", practiceDesc: "Inícios suaves sem impacto na glote.", locked: true },
      { id: 9, displayTitle: "Aula 9", title: "Ressonância Básica", youtubeId: "dHVMUp4MRD8", description: "O Som na Máscara.", hasPractice: true, exercise: "Humming", practiceDesc: "Posicionamento tonal no rosto.", locked: true },
      { id: 10, displayTitle: "Aula 10", title: "Avaliação Final", youtubeId: "qpQuTYKLC-U", description: "O teste final do Nível 1.", hasPractice: true, exercise: "Performance Completa", practiceDesc: "Execução com IA.", locked: true }
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
    
    switch (currentLesson.id) {
      case 1: { 
        const t = elapsed % 22; 
        if (t < 4) return { phase: 'INSPIRAR', instruction: 'Inspira por 4 segundos', color: 'cyan', icon: Wind };
        if (t < 8) return { phase: 'SEGURAR', instruction: 'Segura por 4 segundos', color: 'orange', icon: Lock };
        if (t < 18) return { phase: 'EXPIRAR', instruction: 'Expira por 10 segundos', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa por 4 segundos', color: 'gray', icon: Coffee };
      }
      case 2: { 
        const t = elapsed % 22;
        if (t < 4) return { phase: 'INSPIRAR', instruction: 'Inspira por 4 segundos', color: 'cyan', icon: Wind };
        if (t < 19) return { phase: 'EMITIR S', instruction: 'Solte o ar com som de pneu esvaziando por 15 segundos', color: 'blue', icon: Activity };
        return { phase: 'DESCANSAR', instruction: 'Descansa por 3 segundos', color: 'gray', icon: Coffee };
      }
      case 3: { 
        const t = elapsed % 22;
        if (t < 4) return { phase: 'INSPIRAR', instruction: 'Inspira por 4 segundos', color: 'cyan', icon: Wind };
        if (t < 19) return { phase: 'SUSTENTAR', instruction: 'Sustente uma nota confortável por 15 segundos', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa por 3 segundos', color: 'gray', icon: Coffee };
      }
      case 4: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'LIP TRILL', instruction: 'Faça a vibração dos lábios contínua por 10 segundos', color: 'blue', icon: Activity };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 5: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'LÍNGUA', instruction: 'Trinado de língua contínuo por 10 segundos', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 6: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'SIRENE', instruction: 'Faça o som de sirene subindo e descendo', color: 'blue', icon: Activity };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 7: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'ARTICULAR', instruction: 'Leia o texto abrindo bem a boca nas vogais', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 8: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'ATAQUE SUAVE', instruction: 'Inicie o som com um sopro, falando Aga-Amor', color: 'blue', icon: Activity };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 9: { 
        const t = elapsed % 22;
        if (t < 4) return { phase: 'INSPIRAR', instruction: 'Inspira por 4 segundos', color: 'cyan', icon: Wind };
        if (t < 19) return { phase: 'HUMMING', instruction: 'Faça o som de Hummmm sentindo vibrar o rosto', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa por 3 segundos', color: 'gray', icon: Coffee };
      }
      default: { 
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRAR', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 13) return { phase: 'PRATICAR', instruction: 'Execute o exercício focado na técnica', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSAR', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
    }
  };

  const cycleState = getCycleState();
  const CycleIcon = cycleState.icon;

  useEffect(() => {
    if (trainingStatus === 'active' && cycleState.instruction) {
      window.speechSynthesis.cancel();
      const locucao = new SpeechSynthesisUtterance(cycleState.instruction);
      locucao.lang = 'pt-BR'; 
      locucao.rate = 1.1; 
      window.speechSynthesis.speak(locucao);
    }
    return () => {
      if (trainingStatus !== 'active') window.speechSynthesis.cancel();
    };
  }, [cycleState.instruction, trainingStatus]); 

  const startTraining = () => {
    setTrainingStatus('countdown');
    setCountdown(3);
  };

  // A MÁGICA DE REDIRECIONAMENTO ACONTECE AQUI
  const changeLesson = (index: number) => {
    if (moduleContent.lessons[index].locked) {
      navigate('/premium'); // Joga direto para o funil de vendas
      return;
    }
    setActiveLessonIndex(index);
    setStep('video');
    setTrainingStatus('idle');
    window.speechSynthesis.cancel(); 
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://picsum.photos/seed/masterclass/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-3 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              <PlayCircle size={14} /> Masterclass • {moduleContent.level} 
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">
              {currentLesson.displayTitle}:<br/>
              <span className={!currentLesson.hasPractice ? "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"}>{currentLesson.title}</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-medium max-w-sm">{currentLesson.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3">
            {step === 'video' && (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(34,211,238,0.15)] bg-zinc-900 mb-8 relative">
                  {!currentLesson.locked && currentLesson.youtubeId ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0&modestbranding=1`} title={currentLesson.title} frameBorder="0" allowFullScreen></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <Lock className="w-16 h-16 text-gray-500 mb-4" />
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Aula Bloqueada</h3>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  {currentLesson.hasPractice ? (
                    <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-cyan-400 hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
                      Ir para Treinamento <ArrowLeft size={20} className="ml-3 rotate-180" />
                    </Button>
                  ) : (
                    <Button onClick={() => changeLesson(activeLessonIndex + 1)} className="h-16 px-12 rounded-full bg-orange-500 hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                      Ir para a Aula 1 <ArrowLeft size={20} className="ml-3 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {step === 'practice' && currentLesson.hasPractice && (
              <Card className="bg-zinc-950/80 backdrop-blur-xl border-cyan-400/30 rounded-[3rem] shadow-[0_0_50px_rgba(34,211,238,0.1)] p-8 md:p-12 animate-in zoom-in-95 duration-500 min-h-[500px] flex flex-col justify-center items-center">
                
                {trainingStatus === 'idle' && (
                  <div className="flex flex-col items-center text-center animate-in fade-in zoom-in">
                    <div className="h-24 w-24 rounded-full border-4 border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center mb-6">
                      <Mic2 className="h-10 w-10 text-cyan-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Exercício: {currentLesson.exercise}</h2>
                    <p className="text-gray-400 font-medium max-w-2xl mb-10">{currentLesson.practiceDesc}</p>
                    <div className="flex gap-4 w-full max-w-md mt-4">
                      <Button onClick={startTraining} className="flex-1 h-16 rounded-full bg-cyan-400 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:scale-105">
                        INICIAR TREINAMENTO
                      </Button>
                      <Button onClick={() => setStep('video')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                        Rever Aula
                      </Button>
                    </div>
                  </div>
                )}

                {trainingStatus === 'countdown' && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in">
                    <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-8">Prepare-se</h2>
                    <div className="text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_0_50px_rgba(34,211,238,0.5)] animate-pulse">{countdown}</div>
                  </div>
                )}

                {trainingStatus === 'active' && (
                  <div className="flex flex-col items-center text-center w-full animate-in fade-in">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Treinamento em Andamento</h2>
                    
                    <div className="relative flex items-center justify-center mb-8">
                      <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className={`transition-all duration-1000 ease-linear 
                            ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : cycleState.color === 'blue' ? 'text-blue-500' : 'text-gray-400'}`} 
                        />
                      </svg>
                      
                      <div className={`absolute flex items-center justify-center h-28 w-28 rounded-full border-4 animate-pulse backdrop-blur-md
                        ${cycleState.color === 'cyan' ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.4)]' : 
                          cycleState.color === 'orange' ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : 
                          cycleState.color === 'blue' ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.4)]' : 
                          'border-gray-400 bg-gray-400/20 shadow-[0_0_40px_rgba(156,163,175,0.4)]'}`}>
                        <CycleIcon size={40} className={cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : cycleState.color === 'blue' ? 'text-blue-500' : 'text-gray-400'} />
                      </div>
                    </div>

                    <div className="mb-4 h-8 flex items-center justify-center text-center px-4">
                      <p className={`text-xl font-black uppercase tracking-widest animate-in slide-in-from-bottom-2 fade-in
                        ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : cycleState.color === 'blue' ? 'text-blue-500' : 'text-gray-400'}`}>
                        {cycleState.instruction}
                      </p>
                    </div>

                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-4">Tempo restante: {timeLeft}s</p>
                  </div>
                )}

                {trainingStatus === 'finished' && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500 w-full">
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-sm mb-6 bg-cyan-400/10 px-6 py-2 rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                      <CheckCircle2 size={18} /> Treinamento Concluído
                    </div>
                    
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-8">Bom Trabalho!</h1>
                    
                    <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-3xl p-8 mb-10 text-left w-full max-w-2xl shadow-[0_0_40px_rgba(34,211,238,0.05)]">
                      <h4 className="text-cyan-400 font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                        <Info size={18} /> Observações e Recomendações
                      </h4>
                      <ul className="space-y-4 text-gray-300 text-sm font-medium leading-relaxed">
                        <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5" /> <span>Pratique este exercício 3 vezes ao dia durante uma semana para fixar a memória muscular.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5" /> <span>Mantenha a postura ereta e relaxe os ombros.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5" /> <span>Beba água em temperatura ambiente para hidratar as pregas vocais.</span></li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-4 w-full max-w-md">
                      {activeLessonIndex < moduleContent.lessons.length - 1 ? (
                        <Button onClick={() => changeLesson(activeLessonIndex + 1)} className="flex-1 h-16 rounded-full bg-cyan-500 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
                          Próxima Aula <ArrowLeft size={20} className="ml-3 rotate-180" />
                        </Button>
                      ) : (
                        <Button onClick={() => navigate('/academy')} className="flex-1 h-16 rounded-full bg-cyan-500 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
                          Concluir Módulo
                        </Button>
                      )}
                      <Button onClick={() => setTrainingStatus('idle')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                        Repetir
                      </Button>
                    </div>
                  </div>
                )}
                
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm mb-6 sticky top-0 bg-black/90 py-2 z-10 backdrop-blur-md">
              <ListVideo size={18} className="text-cyan-400" /> Playlist
            </div>
            
            <div className="flex flex-col gap-3 pb-8">
              {moduleContent.lessons.map((lesson, idx) => {
                const isActive = activeLessonIndex === idx;
                return (
                  <Card 
                    key={lesson.id} onClick={() => changeLesson(idx)}
                    className={`cursor-pointer transition-all duration-300 border p-4 rounded-2xl flex items-start gap-4 flex-shrink-0
                      ${isActive ? (lesson.hasPractice ? 'bg-cyan-400/10 border-cyan-400' : 'bg-orange-500/10 border-orange-500') : lesson.locked ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed hover:border-cyan-400/50 hover:opacity-100' : 'bg-zinc-950 border-white/10 hover:border-white/30 hover:bg-zinc-900'}`}
                  >
                    <div className="mt-1">
                      {lesson.locked ? <Lock size={16} className="text-gray-500" /> : isActive ? <PlayCircle size={18} className={lesson.hasPractice ? "text-cyan-400 animate-pulse" : "text-orange-500 animate-pulse"} /> : <CheckCircle2 size={16} className="text-gray-600" />}
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? (lesson.hasPractice ? 'text-cyan-400' : 'text-orange-500') : 'text-gray-500'}`}>{lesson.displayTitle}</p>
                      <h4 className={`text-sm font-black italic tracking-tighter leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>{lesson.title}</h4>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Lesson;