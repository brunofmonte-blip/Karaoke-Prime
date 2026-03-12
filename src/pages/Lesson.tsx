import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Volume2, Activity, Star, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Controle de Usuário
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Estados da Aula e Treino
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [step, setStep] = useState<'video' | 'practice'>('video');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // VIP ACCESS: Verifica se o e-mail é o do desenvolvedor/dono
  const isPremiumUser = user?.email === 'bruno.fmonte@gmail.com';

  const moduleContent = {
    level: "Nível 1",
    moduleName: "Fundamentos e Respiração",
    lessons: [
      { 
        id: 0, displayTitle: "Introdução", title: "Fundamentos", youtubeId: "m75jPge9QUM", hasPractice: false, locked: false 
      },
      { 
        id: 1, displayTitle: "Aula 1", title: "Respiração Diafragmática", youtubeId: "Wl6xUHg9iAQ", hasPractice: true, locked: false,
        exercise: "Ciclo 4-4-10-4", practiceDesc: "Inspira (4s), Segura (4s), Expira (10s) e Descansa (4s).",
        feedbackTitle: "A Base da Resistência Vocal",
        feedbackDesc: "Sem ar, não há som. O controle do diafragma tira a sobrecarga da sua garganta e dá potência natural à voz.",
        frequency: "3x ao dia (Manhã, tarde e antes de cantar)"
      },
      { 
        id: 2, displayTitle: "Aula 2", title: "Controle de Fluxo de Ar", youtubeId: "fQKI_SFrrOo", hasPractice: true, locked: false,
        exercise: "Emissão de 'S'", practiceDesc: "Mantenha o som de 'S' constante e longo para economizar ar.",
        feedbackTitle: "Economia e Pressão",
        feedbackDesc: "Este exercício ensina suas pregas vocais a resistirem à pressão do ar, permitindo cantar frases muito mais longas sem perder o fôlego.",
        frequency: "2x ao dia (Até conseguir passar de 45 segundos ininterruptos)"
      },
      { 
        id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", hasPractice: true, locked: true,
        exercise: "Sustentação de Nota Única", practiceDesc: "Mantenha uma nota confortável em volume médio sem oscilar.",
        feedbackTitle: "Estabilidade Tonal",
        feedbackDesc: "Cantar notas longas sem tremer a voz demonstra domínio técnico e controle absoluto do diafragma acoplado à voz.",
        frequency: "Sempre como primeiro aquecimento antes de cantar"
      },
      { 
        id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", hasPractice: true, locked: true,
        exercise: "Lip Trill (Vibração de Lábios)", practiceDesc: "Faça a vibração dos lábios continuamente com o som de 'Brrr'.",
        feedbackTitle: "O Melhor Amigo do Cantor",
        feedbackDesc: "O Lip Trill massageia as cordas vocais, equilibra a pressão do ar e aquece a musculatura sem causar nenhum atrito. É a proteção definitiva.",
        frequency: "Sempre que for cantar ou quando sentir a voz cansada"
      },
      { 
        id: 5, displayTitle: "Aula 5", title: "Soltando a Língua", youtubeId: "vImzV9TdLdo", hasPractice: true, locked: true,
        exercise: "Trinado de Língua", practiceDesc: "Vibração de língua contínua e relaxada (som de 'Rrrr').",
        feedbackTitle: "Relaxamento Articulatório",
        feedbackDesc: "A tensão na raiz da língua é uma das maiores causas de 'quebra' de voz. Esse exercício solta a musculatura interna do pescoço.",
        frequency: "1x ao dia ou antes de cantar músicas muito rápidas"
      },
      { 
        id: 6, displayTitle: "Aula 6", title: "Sirene Vocal", youtubeId: "ZsvFS4u2P8I", hasPractice: true, locked: true,
        exercise: "Sirene do Grave ao Agudo", practiceDesc: "Deslize a voz imitando uma sirene, passando por todas as notas sem quebrar.",
        feedbackTitle: "Conexão de Registros",
        feedbackDesc: "A sirene apaga a 'linha' que divide a voz de peito e a voz de cabeça, criando uma passagem suave (o famoso mix).",
        frequency: "2x ao dia focando em não mudar o volume durante a subida"
      },
      { 
        id: 7, displayTitle: "Aula 7", title: "Articulação Exagerada", youtubeId: "PW3Oj_uagpI", hasPractice: true, locked: true,
        exercise: "Leitura Hiperarticulada", practiceDesc: "Fale ou cante abrindo bastante a boca em cada vogal.",
        feedbackTitle: "Dicção de Palco",
        feedbackDesc: "Abre espaço interno na boca, permitindo que a ressonância natural do crânio amplifique sua voz sem precisar gritar.",
        frequency: "Sempre antes de cantar em outro idioma ou músicas complexas"
      },
      { 
        id: 8, displayTitle: "Aula 8", title: "Ataque Suave", youtubeId: "KqVkz8jdcpc", hasPractice: true, locked: true,
        exercise: "Início com Sopros (Aga-Amor)", practiceDesc: "Inicie as frases com um leve sopro antes de emitir a nota.",
        feedbackTitle: "Fim da Borda de Glote",
        feedbackDesc: "O golpe de glote (começar a cantar com um 'soco' na garganta) cria nódulos. O ataque suave é a cura para pregas vocais cansadas.",
        frequency: "3x ao dia para reeducar a maneira de começar a falar/cantar"
      },
      { 
        id: 9, displayTitle: "Aula 9", title: "Ressonância Básica", youtubeId: "dHVMUp4MRD8", hasPractice: true, locked: true,
        exercise: "Humming (Boca Fechada)", practiceDesc: "Faça o som de 'Hummm' sentindo a vibração nos lábios e nariz.",
        feedbackTitle: "Colocação na Máscara",
        feedbackDesc: "Traz o som da garganta para o rosto. Isso dá brilho profissional à voz e permite alcançar agudos com extrema facilidade.",
        frequency: "2x ao dia, buscando o máximo de vibração no nariz"
      },
      { 
        id: 10, displayTitle: "Aula 10", title: "Prática Geral", youtubeId: "qpQuTYKLC-U", hasPractice: true, locked: true,
        exercise: "Rotina Completa Nível 1", practiceDesc: "Passagem por todos os exercícios focando em precisão.",
        feedbackTitle: "Consolidação Muscular",
        feedbackDesc: "O canto é memória muscular. A repetição correta substitui antigos vícios por técnicas que vão preservar sua voz por décadas.",
        frequency: "Treino diário oficial de aquecimento"
      }
    ]
  };

  const currentLesson = moduleContent.lessons[activeLessonIndex];

  // Controle de Timer e Áudio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (trainingStatus === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setTrainingStatus('active');
        if (audioRef.current) {
          audioRef.current.volume = 0.2;
          audioRef.current.play().catch(e => console.log("Áudio bloqueado pelo navegador"));
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

  // Motor Dinâmico de Exercícios (Gera o ciclo certo para cada aula do Nível 1)
  const getCycleState = () => {
    const elapsed = 60 - timeLeft; 
    
    switch (currentLesson.id) {
      case 1: { // 4-4-10-4
        const t = elapsed % 22; 
        if (t < 4) return { phase: 'INSPIRA', instruction: 'Puxe o ar (4s)', color: 'cyan', icon: Wind };
        if (t < 8) return { phase: 'SEGURA', instruction: 'Mantenha o ar (4s)', color: 'orange', icon: Lock };
        if (t < 18) return { phase: 'EXPIRA', instruction: 'Solte o ar devagar (10s)', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSA', instruction: 'Relaxe (4s)', color: 'gray', icon: Coffee };
      }
      case 2: { // Controle S
        const t = elapsed % 20;
        if (t < 5) return { phase: 'INSPIRA', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 18) return { phase: 'SOLTE O S', instruction: 'Mantenha o som de S constante', color: 'orange', icon: Volume2 };
        return { phase: 'DESCANSA', instruction: 'Descansa', color: 'gray', icon: Coffee };
      }
      case 3: 
      case 6: 
      case 9: { // Exercícios de Sustentação/Sirene/Humming (15s ativo, 5s pausa)
        const t = elapsed % 20;
        if (t < 4) return { phase: 'INSPIRA', instruction: 'Preparação profunda', color: 'cyan', icon: Wind };
        if (t < 16) return { phase: 'EXECUTA', instruction: 'Mantenha o som constante e focado', color: 'orange', icon: Mic2 };
        return { phase: 'DESCANSA', instruction: 'Relaxe a garganta', color: 'gray', icon: Coffee };
      }
      case 4: 
      case 5: { // Exercícios rápidos de vibração labial/língua (10s ativo, 5s pausa)
        const t = elapsed % 15;
        if (t < 3) return { phase: 'INSPIRA', instruction: 'Apoio no diafragma', color: 'cyan', icon: Wind };
        if (t < 12) return { phase: 'VIBRAÇÃO', instruction: 'Mantenha a vibração solta', color: 'blue', icon: Activity };
        return { phase: 'DESCANSA', instruction: 'Respire normal', color: 'gray', icon: Coffee };
      }
      default: { // Padrão genérico
        const t = elapsed % 15;
        if (t < 5) return { phase: 'PREPARAÇÃO', instruction: 'Mantenha a postura', color: 'cyan', icon: Wind };
        return { phase: 'PRÁTICA', instruction: 'Atenção na técnica', color: 'blue', icon: Activity };
      }
    }
  };

  const cycleState = getCycleState();
  const CycleIcon = cycleState.icon;

  const changeLesson = (index: number) => {
    const lessonTarget = moduleContent.lessons[index];
    const isLockedForUser = lessonTarget.locked && !isPremiumUser;

    if (isLockedForUser) {
      navigate('/premium');
      return;
    }
    
    setActiveLessonIndex(index);
    setStep('video');
    setTrainingStatus('idle');
    setTimeLeft(60);
    setCountdown(3);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans text-white">
      {/* Elemento de Áudio - Trilha Sonora */}
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" loop />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
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
          
          {/* TELA DE VÍDEO OU PRÁTICA */}
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
                  <div className="flex flex-col items-center text-center animate-in zoom-in">
                    <Mic2 className="h-16 w-16 text-cyan-400 mb-6" />
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{currentLesson.exercise}</h2>
                    <p className="text-gray-400 mb-10 max-w-lg">{currentLesson.practiceDesc}</p>
                    <Button onClick={() => setTrainingStatus('countdown')} className="h-16 px-12 rounded-full bg-cyan-400 text-black font-black uppercase">INICIAR TREINO DE 60s</Button>
                  </div>
                ) : trainingStatus === 'countdown' ? (
                  <h1 className="text-9xl font-black italic text-cyan-400 animate-pulse">{countdown}</h1>
                ) : trainingStatus === 'active' ? (
                  <div className="flex flex-col items-center text-center w-full animate-in fade-in">
                    <div className="relative flex items-center justify-center mb-8">
                      <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`transition-all duration-1000 ease-linear ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <CycleIcon size={32} className={`mb-2 ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} />
                        <p className="font-black text-3xl italic">{timeLeft}s</p>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black italic uppercase mb-2 text-white">{cycleState.phase}</h3>
                    <p className="text-xl font-bold text-cyan-400 uppercase tracking-widest">{cycleState.instruction}</p>
                  </div>
                ) : (
                  <div className="text-center animate-in slide-in-from-bottom-4 w-full max-w-2xl">
                    <CheckCircle2 size={64} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-black italic mb-8 uppercase text-white">Treino Concluído!</h2>
                    
                    {/* FEEDBACK PERSONALIZADO */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-10 text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <Info size={20} className="text-cyan-400" />
                        <h4 className="text-cyan-400 font-black uppercase tracking-widest text-sm">{currentLesson.feedbackTitle}</h4>
                      </div>
                      <p className="text-gray-300 text-sm font-medium leading-relaxed mb-6">
                        {currentLesson.feedbackDesc}
                      </p>
                      <div className="bg-black/50 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                        <Activity size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Frequência Recomendada</p>
                          <p className="text-sm font-bold text-white">{currentLesson.frequency}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => { setStep('video'); setTrainingStatus('idle'); setTimeLeft(60); }} className="bg-white text-black font-black uppercase rounded-full px-8 h-12">VOLTAR PARA AULA</Button>
                      <Button onClick={() => { setTrainingStatus('countdown'); setCountdown(3); setTimeLeft(60); }} variant="outline" className="border-white/20 text-white font-black uppercase rounded-full px-8 h-12 hover:bg-white hover:text-black">REPETIR TREINO</Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* PLAYLIST LATERAL */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs mb-4">
              <ListVideo size={18} className="text-cyan-400" /> Playlist Nível 1
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {moduleContent.lessons.map((lesson, idx) => {
                const isLockedForUser = lesson.locked && !isPremiumUser;
                return (
                  <Card 
                    key={idx} 
                    onClick={() => changeLesson(idx)} 
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3
                      ${activeLessonIndex === idx ? 'bg-cyan-400/10 border-cyan-400' : 'bg-zinc-950 border-white/10 hover:border-white/30'} 
                      ${isLockedForUser ? 'opacity-50' : 'opacity-100'}
                    `}
                  >
                    {isLockedForUser ? <Lock size={16} className="text-gray-500 shrink-0" /> : <PlayCircle size={18} className={`shrink-0 ${activeLessonIndex === idx ? 'text-cyan-400' : 'text-gray-400'}`} />}
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${activeLessonIndex === idx ? 'text-cyan-400' : 'text-gray-500'}`}>{lesson.displayTitle}</p>
                      <h4 className="text-xs font-black uppercase italic leading-tight">{lesson.title}</h4>
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
}