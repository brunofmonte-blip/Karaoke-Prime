import React, { useState } from 'react';
import { PlayCircle, Wind, CheckCircle2, Lock, X, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Importando o nosso Cérebro e a Arena de Treino
import { VocalSandboxProvider } from '@/hooks/use-vocal-sandbox';
import FarinelliExercise from './FarinelliExercise';

// 🚨 EXPORTAÇÃO DOS DADOS PARA O MOTOR LER OS TEMPOS DE RESPIRAÇÃO
export const level3Modules = [
  {
    id: "l3-ressonancia",
    title: "Nível 3: Ressonância e Dicção",
    exercises: [
      {
        id: "ex-farinelli-master",
        title: "Apoio Diafragmático",
        inhale: 4, 
        hold: 4, 
        exhale: 16, // Nível 3 já exige 16 segundos de sustentação!
        rest: 4,
        prepText: "Mantenha a postura ereta. Coloque a mão no abdômen. Ele deve expandir na inspiração.",
        actionText: "SOPRAR CONSTANTE",
        command: "EXPIRA AGORA",
        isLegato: true
      }
    ]
  }
];

const lessons = [
  { id: "3.1", title: "O Poder do Humming", desc: "Encontrar e fortalecer a ressonância na máscara facial (Bocca Chiusa).", videoId: "vWuOiC1PqX0" },
  { id: "3.2", title: "Ginástica Articulatória", desc: "Destravar a mandíbula, a língua e os lábios com trava-línguas rítmicos.", videoId: "ErZxD3GAP-o" },
  { id: "3.3", title: "Sirenes e Conexão", desc: "Eliminar as 'quebras' na voz usando o Mix Voice do peito para a cabeça.", videoId: "6U2Xk0OzsfA" },
  { id: "3.4", title: "Acordando o Peito", desc: "Dominar a voz de peito para criar tons graves, quentes e com autoridade.", videoId: "kp4Whqij-DE" },
  { id: "3.5", title: "O Brilho da Cabeça", desc: "Diferenciar a voz de cabeça do falsete para notas agudas com leveza.", videoId: "GSR3YUQPHyM" },
  { id: "3.6", title: "Modificação de Vogais", desc: "O segredo para arredondar as vogais nas notas altas sem soar estridente.", videoId: "K66Di3oSw7M" },
  { id: "3.7", title: "O Groove da Dicção", desc: "Usar consoantes duras como ferramentas rítmicas para músicas rápidas.", videoId: "ZBL2BM-XqvI" },
  { id: "3.8", title: "O Brilho do Twang", desc: "O estreitamento do epilaringe para cortar a banda sem precisar gritar.", videoId: "" }, // Sem vídeo ainda
  { id: "3.9", title: "Costurando os Registros", desc: "Juntar peito e cabeça com exercícios de 'choro' e lamento.", videoId: "" },
  { id: "3.10", title: "Prova de Fogo da Dicção", desc: "O teste prático final: aplicar ressonância e vogais puras na música real.", videoId: "" },
];

const AcademyLevel3Menu = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);

  // Se a Arena Farinelli estiver ativa, renderizamos ela com o Provider em volta
  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center">
          <Button 
            variant="ghost" 
            onClick={() => setIsFarinelliActive(false)} 
            className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"
          >
            <X size={24} /> FECHAR TREINO
          </Button>
          
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3">
              <Wind className="h-8 w-8" /> Laboratório de Respiração
            </h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">
              Prove que você tem pulmão nível Julliard
            </p>
          </div>

          {/* O NOSSO COMPONENTE CIRÚRGICO */}
          <FarinelliExercise moduleType="farinelli" />
          
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* CABEÇALHO DO NÍVEL E VÍDEO INTRODUTÓRIO */}
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit">
            <Activity size={14} /> Level 3
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
            Ressonância e <span className="text-cyan-400">Dicção</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">
            O momento em que você deixa de apenas "emitir som" e passa a dar cor, brilho e clareza à sua voz. Domine a transferência de ressonância do peito para a cabeça e articule as palavras como um profissional.
          </p>
          
          {/* 🚨 BOTÃO MÁGICO DO FARINELLI */}
          <Button 
            onClick={() => setIsFarinelliActive(true)}
            className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
          >
            <Wind size={20} /> ABRIR TREINO FARINELLI
          </Button>
        </div>
        
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe 
            width="100%" height="100%" 
            src="https://www.youtube.com/embed/IzZCDVzsghA?rel=0&modestbranding=1" 
            title="Introdução Nível 3" frameBorder="0" allowFullScreen
            className="absolute inset-0 w-full h-full object-cover"
          ></iframe>
        </div>
      </div>

      {/* GRADE DE AULAS */}
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3">
          <PlayCircle className="text-cyan-400" /> Aulas do Módulo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, idx) => (
            <Card 
              key={lesson.id} 
              onClick={() => lesson.videoId ? setActiveVideo(lesson.videoId) : null}
              className={`p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${lesson.videoId ? 'bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group' : 'bg-black/50 border-white/5 opacity-60 cursor-not-allowed'}`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border ${lesson.videoId ? 'bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all' : 'bg-zinc-900 border-white/5 text-gray-600'}`}>
                {lesson.videoId ? <PlayCircle size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">
                    Lição {lesson.id}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">
                  {lesson.title}
                </h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                  {lesson.desc}
                </p>
                {!lesson.videoId && (
                  <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL DE VÍDEO DAS AULAS */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <Button 
            variant="ghost" 
            onClick={() => setActiveVideo(null)}
            className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full"
          >
            <X size={32} />
          </Button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
              title="Aula Prática" frameBorder="0" allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default AcademyLevel3Menu;