// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Lesson.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Lesson = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [step, setStep] = useState<'intro' | 'video' | 'practice'>('intro');

  // 💡 A NOSSA NOVA ESTRUTURA DE PLAYLIST DINÂMICA
  const moduleContent = {
    level: "Nível 1",
    moduleName: "Fundamentos e Respiração",
    lessons: [
      {
        id: 1,
        title: "A Base: Respiração Diafragmática",
        hasIntro: true,
        introYoutubeId: "ID_DA_INTRODUCAO_AQUI", // 🚨 Troque pelo ID do vídeo de Introdução
        lessonYoutubeId: "Wl6xUHg9iAQ", // ✅ SEU VÍDEO REAL DA AULA 1 JÁ ESTÁ AQUI
        description: "A fundação de tudo. Aprenda a parar de respirar pelo peito/ombros e a mandar o ar para o abdômen (diafragma).",
        exercise: "Ciclo 4-4-10-4",
        practiceDesc: "Inspirar (4s), Segurar (4s), Expirar (10s) e Descansar (4s). A IA vai analisar a estabilidade do seu fluxo de ar.",
        locked: false
      },
      {
        id: 2,
        title: "Controle de Fluxo de Ar",
        hasIntro: false, // Aula 2 não precisa de intro, vai direto pro vídeo
        lessonYoutubeId: "fQKI_SFrrOo", // 🚨 Pegue no YouTube depois
        description: "Mostra que cantar não é sobre a força do ar, mas sobre o controle. Você vai aprender a não soltar todo o ar de uma vez.",
        exercise: "Emissão Contínua de 'S' (15s)",
        practiceDesc: "Você precisará soltar o ar fazendo o som de 'S' de forma constante e ininterrupta por 15 segundos. A IA vai medir oscilações.",
        locked: false
      },
      {
        id: 3,
        title: "Sustentação Vocal",
        hasIntro: false,
        lessonYoutubeId: "COLOQUE_O_ID_DA_AULA_3_AQUI", // 🚨 Pegue no YouTube depois
        description: "A aplicação do fluxo de ar, mas agora usando a voz de verdade em vez de apenas chiado.",
        exercise: "Sustentação de Nota Única",
        practiceDesc: "Segure uma nota confortável no microfone pelo máximo de tempo possível. Nossa IA avaliará a firmeza do som.",
        locked: false
      }
    ]
  };

  const currentLesson = moduleContent.lessons[activeLessonIndex];

  // Função para o usuário pular de aula pela barra lateral
  const changeLesson = (index: number) => {
    if (moduleContent.lessons[index].locked) return;
    setActiveLessonIndex(index);
    // Se a aula tiver introdução, começa nela. Se não tiver, vai direto pro vídeo técnico.
    setStep(moduleContent.lessons[index].hasIntro ? 'intro' : 'video');
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
              {step === 'intro' && " (Introdução)"}
              {step === 'video' && " (Aula Técnica)"}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">
              {step === 'intro' ? "Boas-vindas" : `Aula ${currentLesson.id}:`}<br/>
              <span className={step === 'intro' ? "text-orange-500 neon-gold-glow" : "text-primary neon-blue-glow"}>
                {step === 'intro' ? moduleContent.moduleName : currentLesson.title.split(':')[1] || currentLesson.title}
              </span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-medium max-w-sm">
              {step === 'intro' ? "Assista a esta introdução para entender a mentalidade antes de ir para a técnica." : currentLesson.description}
            </p>
          </div>
        </div>

        {/* 💡 NOVO LAYOUT COM GRID: CONTEÚDO (ESQUERDA) + PLAYLIST (DIREITA) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* COLUNA ESQUERDA: O PLAYER DE VÍDEO OU ÁREA DE PRÁTICA */}
          <div className="lg:col-span-3">
            
            {/* VÍDEO DE INTRODUÇÃO */}
            {step === 'intro' && currentLesson.hasIntro && (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(249,115,22,0.15)] bg-zinc-900 mb-8">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.introYoutubeId}?rel=0&modestbranding=1`} title="Intro" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep('video')} className="h-16 px-12 rounded-full bg-orange-500 hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                    Ir para a Aula Técnica <ArrowLeft size={20} className="ml-3 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* VÍDEO DA AULA TÉCNICA */}
            {step === 'video' && (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,168,225,0.15)] bg-zinc-900 mb-8">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentLesson.lessonYoutubeId}?rel=0&modestbranding=1`} title="Lesson" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex justify-between items-center">
                  {currentLesson.hasIntro ? (
                    <Button onClick={() => setStep('intro')} variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs transition-all">
                      <ArrowLeft size={16} className="mr-2" /> Rever Introdução
                    </Button>
                  ) : <div></div>}
                  <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-primary hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all">
                    Ir para a Prática <ArrowLeft size={20} className="ml-3 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* EXERCÍCIO COM IA */}
            {step === 'practice' && (
              <Card className="bg-zinc-950/80 backdrop-blur-xl border-primary/30 rounded-[3rem] shadow-[0_0_50px_rgba(0,168,225,0.1)] p-8 md:p-12 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full border-4 border-orange-500/30 bg-orange-500/10 flex items-center justify-center mb-6">
                    <Mic2 className="h-10 w-10 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Exercício: {currentLesson.exercise}</h2>
                  <p className="text-gray-400 font-medium max-w-2xl mb-10">{currentLesson.practiceDesc}</p>
                  
                  <div className="flex gap-4 w-full max-w-md mt-4">
                    <Button onClick={() => alert("A IA de Avaliação Respiratória será injetada aqui na próxima etapa!")} className="flex-1 h-16 rounded-full bg-orange-500 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                      INICIAR GRAVAÇÃO
                    </Button>
                    <Button onClick={() => setStep('video')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                      Rever Aula
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* COLUNA DIREITA: A BARRA LATERAL DA PLAYLIST */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm mb-6">
              <ListVideo size={18} className="text-primary" /> Conteúdo do Módulo
            </div>
            
            <div className="flex flex-col gap-3">
              {moduleContent.lessons.map((lesson, idx) => {
                const isActive = activeLessonIndex === idx;
                return (
                  <Card 
                    key={lesson.id} 
                    onClick={() => changeLesson(idx)}
                    className={`cursor-pointer transition-all duration-300 border p-4 rounded-2xl flex items-start gap-4 
                      ${isActive 
                        ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,168,225,0.15)]' 
                        : lesson.locked 
                          ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-zinc-950 border-white/10 hover:border-white/30 hover:bg-zinc-900'
                      }`}
                  >
                    <div className="mt-1">
                      {lesson.locked ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : isActive ? (
                        <PlayCircle size={18} className="text-primary animate-pulse" />
                      ) : (
                        <CheckCircle2 size={16} className="text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                        Aula {lesson.id}
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