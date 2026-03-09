// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Lesson.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Activity, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Lesson = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [step, setStep] = useState<'video' | 'practice'>('video');
  
  // 💡 ESTADOS DO NOVO MOTOR DE TREINAMENTO
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  // 💡 A NOSSA SUPER PLAYLIST COM TODOS OS SEUS VÍDEOS REAIS
  const moduleContent = {
    level: "Nível 1",
    moduleName: "Fundamentos e Respiração",
    lessons: [
      {
        id: 0,
        displayTitle: "Introdução",
        title: "Fundamentos e Respiração",
        youtubeId: "m75jPge9QUM",
        description: "Bem-vindo ao seu primeiro passo como um artista de elite. Assista a esta introdução para entender a mentalidade necessária antes das técnicas.",
        hasPractice: false,
        locked: false
      },
      {
        id: 1,
        displayTitle: "Aula 1",
        title: "Respiração Diafragmática",
        youtubeId: "Wl6xUHg9iAQ",
        description: "A fundação de tudo. Aprenda a parar de respirar pelo peito/ombros e a mandar o ar para o abdômen.",
        hasPractice: true,
        exercise: "Ciclo 4-4-10-4",
        practiceDesc: "Inspirar (4s), Segurar (4s), Expirar (10s) e Descansar (4s). A IA vai analisar a estabilidade do seu fluxo de ar.",
        locked: false
      },
      {
        id: 2,
        displayTitle: "Aula 2",
        title: "Controle de Fluxo de Ar",
        youtubeId: "fQKI_SFrrOo",
        description: "Cantar não é sobre a força do ar, mas sobre o controle. Aprenda a não soltar todo o ar de uma vez.",
        hasPractice: true,
        exercise: "Emissão de 'S' (15s)",
        practiceDesc: "Solte o ar fazendo o som de 'S' de forma constante por 15 segundos. A IA medirá as oscilações.",
        locked: false
      },
      {
        id: 3,
        displayTitle: "Aula 3",
        title: "Sustentação Vocal",
        youtubeId: "X65IOyha6EQ",
        description: "A aplicação do fluxo de ar, mas agora usando a voz de verdade em vez de apenas chiado.",
        hasPractice: true,
        exercise: "Sustentação de Nota Única",
        practiceDesc: "Segure uma nota confortável no microfone pelo máximo de tempo possível. Nossa IA avaliará a firmeza.",
        locked: false
      },
      {
        id: 4,
        displayTitle: "Aula 4",
        title: "Aquecimento Labial",
        youtubeId: "3nL733b7rgQ",
        description: "O exercício mais famoso dos cantores. Serve para relaxar a tensão do rosto e do maxilar (Lip Trill).",
        hasPractice: true,
        exercise: "Lip Trill de 10s",
        practiceDesc: "Faça a vibração dos lábios continuamente. A IA verificará se há quebras no som.",
        locked: false
      },
      {
        id: 5,
        displayTitle: "Aula 5",
        title: "Soltando a Língua",
        youtubeId: "vImzV9TdLdo",
        description: "Exercício fundamental de vibração de língua para soltar a musculatura interna.",
        hasPractice: true,
        exercise: "Trinado de Língua",
        practiceDesc: "Vibre a língua (RRRRR) mantendo o som o mais constante possível para o microfone.",
        locked: false
      },
      {
        id: 6,
        displayTitle: "Aula 6",
        title: "Sirene Vocal",
        youtubeId: "ZsvFS4u2P8I",
        description: "Conectando Graves e Agudos. Aprenda a transitar de um som para o outro sem a voz 'quebrar'.",
        hasPractice: true,
        exercise: "Sirene Completa",
        practiceDesc: "Faça o som de uma sirene (UuuUUUuuu) subindo e descendo. A IA avaliará a suavidade da transição.",
        locked: false
      },
      {
        id: 7,
        displayTitle: "Aula 7",
        title: "Articulação Exagerada",
        youtubeId: "PW3Oj_uagpI",
        description: "Cantores iniciantes costumam cantar com a boca fechada. Aprenda a abrir espaço interno para o som brilhar.",
        hasPractice: true,
        exercise: "Leitura Articulada",
        practiceDesc: "A IA pedirá para você ler uma frase projetando muito bem cada vogal.",
        locked: false
      },
      {
        id: 8,
        displayTitle: "Aula 8",
        title: "Ataque Vocal Suave",
        youtubeId: "KqVkz8jdcpc",
        description: "Evite o 'Golpe de Glote', aquela batida seca na garganta ao começar palavras iniciadas por vogais.",
        hasPractice: true,
        exercise: "Início com 'H'",
        practiceDesc: "Fale 'Hh-Amor' de forma suave. A IA detectará se houve impacto violento nas cordas vocais.",
        locked: false
      },
      {
        id: 9,
        displayTitle: "Aula 9",
        title: "Ressonância Básica",
        youtubeId: "dHVMUp4MRD8",
        description: "O Som na Máscara. Aprenda a tirar a força da garganta e direcionar a vibração para o rosto.",
        hasPractice: true,
        exercise: "Humming",
        practiceDesc: "Faça o som de 'Hummm' contínuo. A IA verificará o posicionamento tonal.",
        locked: false
      },
      {
        id: 10,
        displayTitle: "Aula 10",
        title: "Avaliação Final",
        youtubeId: "", // ⏳ Pendente
        description: "O teste final do Nível 1. Juntando todos os fundamentos em uma única execução.",
        hasPractice: true,
        exercise: "Performance Completa",
        practiceDesc: "Cante a estrofe aplicando o que aprendeu. A IA fará o diagnóstico para liberar o Nível 2.",
        locked: true
      }
    ]
  };

  const currentLesson = moduleContent.lessons[activeLessonIndex];

  // 💡 LÓGICA DO MOTOR DE TREINAMENTO (CRONÔMETRO E IA)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (trainingStatus === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setTrainingStatus('active');
        setProgress(0);
      }
    } else if (trainingStatus === 'active') {
      if (progress < 100) {
        // Aumenta a barra de progresso (Simula 10 segundos de treino)
        timer = setTimeout(() => setProgress(progress + 1), 100); 
      } else {
        setTrainingStatus('finished');
        // Gera uma nota VIP alta para o teste (entre 90 e 100)
        setScore(Math.floor(Math.random() * 11) + 90);
      }
    }
    
    return () => clearTimeout(timer);
  }, [trainingStatus, countdown, progress]);

  const startTraining = () => {
    setTrainingStatus('countdown');
    setCountdown(3);
  };

  const changeLesson = (index: number) => {
    if (moduleContent.lessons[index].locked) return;
    setActiveLessonIndex(index);
    setStep('video');
    setTrainingStatus('idle'); // Reseta o motor ao mudar de aula
  };

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
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <PlayCircle size={14} /> Masterclass • {moduleContent.level} 
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">
              {currentLesson.displayTitle}:<br/>
              <span className={!currentLesson.hasPractice ? "text-orange-500 neon-gold-glow" : "text-primary neon-blue-glow"}>
                {currentLesson.title}
              </span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-medium max-w-sm">
              {currentLesson.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* COLUNA ESQUERDA: VÍDEO E PRÁTICA */}
          <div className="lg:col-span-3">
            
            {/* ==================================================== */}
            {/* TELA DE VÍDEO                                        */}
            {/* ==================================================== */}
            {step === 'video' && (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,168,225,0.15)] bg-zinc-900 mb-8 relative">
                  {!currentLesson.locked && currentLesson.youtubeId ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0&modestbranding=1`} title={currentLesson.title} frameBorder="0" allowFullScreen></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <Lock className="w-16 h-16 text-gray-500 mb-4" />
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Aula Bloqueada</h3>
                      <p className="text-gray-400 mt-2">Em breve disponível.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  {currentLesson.hasPractice ? (
                    <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-primary hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all">
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

            {/* ==================================================== */}
            {/* TELA DE PRÁTICA (MOTOR DE IA)                        */}
            {/* ==================================================== */}
            {step === 'practice' && currentLesson.hasPractice && (
              <Card className="bg-zinc-950/80 backdrop-blur-xl border-primary/30 rounded-[3rem] shadow-[0_0_50px_rgba(0,168,225,0.1)] p-8 md:p-12 animate-in zoom-in-95 duration-500 min-h-[400px] flex flex-col justify-center">
                
                {/* ESTADO 1: PARADO (ESPERANDO INICIAR) */}
                {trainingStatus === 'idle' && (
                  <div className="flex flex-col items-center text-center animate-in fade-in zoom-in">
                    <div className="h-24 w-24 rounded-full border-4 border-primary/30 bg-primary/10 flex items-center justify-center mb-6">
                      <Mic2 className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Exercício: {currentLesson.exercise}</h2>
                    <p className="text-gray-400 font-medium max-w-2xl mb-10">{currentLesson.practiceDesc}</p>
                    
                    <div className="flex gap-4 w-full max-w-md mt-4">
                      <Button onClick={startTraining} className="flex-1 h-16 rounded-full bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all hover:scale-105">
                        INICIAR TREINAMENTO
                      </Button>
                      <Button onClick={() => setStep('video')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                        Rever Aula
                      </Button>
                    </div>
                  </div>
                )}

                {/* ESTADO 2: CONTAGEM REGRESSIVA */}
                {trainingStatus === 'countdown' && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-widest mb-8">Prepare-se</h2>
                    <div className="text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_0_50px_rgba(0,168,225,0.5)] animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* ESTADO 3: TREINAMENTO ATIVO (GRAVANDO) */}
                {trainingStatus === 'active' && (
                  <div className="flex flex-col items-center text-center w-full animate-in fade-in">
                    <div className="h-32 w-32 rounded-full border-4 border-orange-500 bg-orange-500/20 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_80px_rgba(249,115,22,0.5)] relative">
                      <Activity className="h-14 w-14 text-orange-500" />
                      <div className="absolute inset-0 rounded-full border border-orange-500 animate-ping opacity-75"></div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Treinamento em Andamento</h2>
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-12 animate-pulse">A IA está avaliando seu fluxo...</p>
                    
                    <div className="w-full max-w-2xl bg-zinc-900 rounded-full h-4 mb-2 overflow-hidden border border-white/10">
                      <div className="bg-gradient-to-r from-orange-500 to-primary h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between w-full max-w-2xl text-xs text-gray-500 font-bold tracking-widest uppercase">
                      <span>0%</span>
                      <span>Análise IA em tempo real</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}

                {/* ESTADO 4: RESULTADO E PONTUAÇÃO */}
                {trainingStatus === 'finished' && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                    <div className="h-28 w-28 rounded-full border-4 border-green-500/30 bg-green-500/10 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                      <Trophy className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="inline-flex items-center gap-2 text-green-500 font-black uppercase tracking-widest text-xs mb-3 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                      <CheckCircle2 size={14} /> Treinamento Concluído
                    </div>
                    
                    <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg mb-2">
                      {score}<span className="text-3xl text-gray-400">%</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-md mb-10">Desempenho excelente! Seu controle e execução técnica foram aprovados pelo nosso motor de IA.</p>
                    
                    <div className="flex gap-4 w-full max-w-md">
                      {activeLessonIndex < moduleContent.lessons.length - 1 ? (
                        <Button onClick={() => changeLesson(activeLessonIndex + 1)} className="flex-1 h-16 rounded-full bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all">
                          Próxima Aula <ArrowLeft size={20} className="ml-3 rotate-180" />
                        </Button>
                      ) : (
                        <Button onClick={() => navigate('/academy')} className="flex-1 h-16 rounded-full bg-green-500 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all">
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

          {/* ==================================================== */}
          {/* COLUNA DIREITA: A PLAYLIST COMPLETA                  */}
          {/* ==================================================== */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm mb-6 sticky top-0 bg-black/90 py-2 z-10 backdrop-blur-md">
              <ListVideo size={18} className="text-primary" /> Playlist do Módulo
            </div>
            
            <div className="flex flex-col gap-3 pb-8">
              {moduleContent.lessons.map((lesson, idx) => {
                const isActive = activeLessonIndex === idx;
                return (
                  <Card 
                    key={lesson.id} 
                    onClick={() => changeLesson(idx)}
                    className={`cursor-pointer transition-all duration-300 border p-4 rounded-2xl flex items-start gap-4 flex-shrink-0
                      ${isActive 
                        ? (lesson.hasPractice ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,168,225,0.15)]' : 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]') 
                        : lesson.locked 
                          ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-zinc-950 border-white/10 hover:border-white/30 hover:bg-zinc-900'
                      }`}
                  >
                    <div className="mt-1">
                      {lesson.locked ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : isActive ? (
                        <PlayCircle size={18} className={lesson.hasPractice ? "text-primary animate-pulse" : "text-orange-500 animate-pulse"} />
                      ) : (
                        <CheckCircle2 size={16} className="text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? (lesson.hasPractice ? 'text-primary' : 'text-orange-500') : 'text-gray-500'}`}>
                        {lesson.displayTitle}
                      </p>
                      <h4 className={`text-sm font-black italic tracking-tighter leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {lesson.title}
                      </h4>
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