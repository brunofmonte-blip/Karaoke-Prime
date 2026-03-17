import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic, Lock, Copy, ListVideo } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // 🚨 A CORREÇÃO ESTÁ AQUI: IMPORTAÇÃO DO BOTÃO!

// ============================================================================
// O GRANDE BANCO DE DADOS DE AULAS E VÍDEOS (NÍVEIS 1 A 4)
// ============================================================================
const academyData: Record<string, any> = {
  "1": {
    title: "FUNDAMENTOS E RESPIRAÇÃO",
    introVideo: "m75jPge9QUM",
    lessons: [
      { id: "1.1", title: "Respiração Diafragmática", videoId: "Wl6xUHg9iAQ", desc: "Aprenda a respirar usando o diafragma." },
      { id: "1.2", title: "Controle de Fluxo de Ar", videoId: "fQKI_SFrrOo", desc: "Exercícios para manter a saída de ar constante." },
      { id: "1.3", title: "Sustentação Vocal", videoId: "X65IOyha6EQ", desc: "Segurando notas longas sem perder o fôlego." },
      { id: "1.4", title: "Aquecimento Labial", videoId: "3nL733b7rgQ", desc: "Lip trills para aquecer sem forçar as cordas." },
      { id: "1.5", title: "Soltando a Língua", videoId: "vImzV9TdLdo", desc: "Exercícios para relaxar a base da língua." },
      { id: "1.6", title: "Sirene Vocal", videoId: "ZsvFS4u2P8I", desc: "Conectando grave e agudo de forma suave." },
      { id: "1.7", title: "Articulação Exagerada", videoId: "PW3Oj_uagpI", desc: "Melhorando a dicção inicial para clareza." },
      { id: "1.8", title: "Ataque Suave", videoId: "KqVkz8jdcpc", desc: "Iniciando notas sem golpes de glote." },
      { id: "1.9", title: "Ressonância Básica", videoId: "dHVMUp4MRD8", desc: "Direcionando o som para a máscara facial." },
      { id: "1.10", title: "Prática Geral", videoId: "qpQuTYKLC-U", desc: "Juntando todos os fundamentos em uma rotina." },
    ]
  },
  "2": {
    title: "AFINAÇÃO PRECISA",
    introVideo: "8bR5O0hEMYU",
    lessons: [
      { id: "2.1", title: "Percepção Auditiva", videoId: "TTVVJTnentM", desc: "Reconhecer notas e intervalos." },
      { id: "2.2", title: "Escalas Maiores", videoId: "uIgaE7Ekh1k", desc: "Subindo e descendo a escala com precisão." },
      { id: "2.3", title: "Saltos de Terça", videoId: "fsIczoqU89M", desc: "Acertando notas distantes sem escorregar." },
      { id: "2.4", title: "Memória Muscular Vocal", videoId: "Ld6XC8dlNlA", desc: "Travando o tom exato no seu corpo." },
      { id: "2.5", title: "Arpejos Simples", videoId: "JRqTqIRCoWo", desc: "Agilidade mantendo a afinação impecável." },
      { id: "2.6", title: "Afinação com Vibrato", videoId: "cp1ICtprIwU", desc: "Mantendo o centro da nota na oscilação." },
      { id: "2.7", title: "Harmonia Básica", videoId: "sYQ_iugBGDE", desc: "Cantar afinado junto com acordes." },
      { id: "2.8", title: "Correção de Pitch", videoId: "yfHrDfNBBH0", desc: "Corrigir sua voz em tempo real." },
      { id: "2.9", title: "Sustentação Afinada", videoId: "iOOrgqzN0tY", desc: "Segurar a nota sem a afinação cair." },
      { id: "2.10", title: "Desafio A Capella", videoId: "_nkKaweJPSk", desc: "Cantando sem acompanhamento no tom." },
    ]
  },
  "3": {
    title: "RESSONÂNCIA E DICÇÃO",
    introVideo: "IzZCDVzsghA",
    lessons: [
      { id: "3.1", title: "O Poder do Humming", videoId: "vWuOiC1PqX0", desc: "Encontrar e fortalecer a ressonância na máscara facial." },
      { id: "3.2", title: "Ginástica Articulatória", videoId: "ErZxD3GAP-o", desc: "Destravar a mandíbula, a língua e os lábios com trava-línguas." },
      { id: "3.3", title: "Sirenes e Conexão", videoId: "6U2Xk0OzsfA", desc: "Eliminar as 'quebras' na voz usando o Mix Voice." },
      { id: "3.4", title: "Acordando o Peito", videoId: "kp4Whqij-DE", desc: "Dominar a voz de peito para criar tons graves e quentes." },
      { id: "3.5", title: "O Brilho da Cabeça", videoId: "GSR3YUQPHyM", desc: "Diferenciar a voz de cabeça do falsete para notas agudas." },
      { id: "3.6", title: "Modificação de Vogais", videoId: "K66Di3oSw7M", desc: "O segredo para arredondar as vogais nas notas altas." },
      { id: "3.7", title: "O Groove da Dicção", videoId: "ZBL2BM-XqvI", desc: "Usar consoantes duras como ferramentas rítmicas." },
      { id: "3.8", title: "O Brilho do Twang", videoId: "", desc: "Em breve" },
      { id: "3.9", title: "Costurando os Registros", videoId: "", desc: "Em breve" },
      { id: "3.10", title: "Prova de Fogo da Dicção", videoId: "", desc: "Em breve" },
    ]
  },
  "4": {
    title: "INTERPRETAÇÃO VOCAL",
    introVideo: "",
    lessons: [
      { id: "4.1", title: "Bocejo-Suspiro", videoId: "", desc: "Em breve" },
      { id: "4.2", title: "Boca Chiusa", videoId: "", desc: "Em breve" },
      { id: "4.3", title: "Exercício com Canudo", videoId: "", desc: "Em breve" },
      { id: "4.4", title: "Vibração Labial", videoId: "", desc: "Em breve" },
      { id: "4.5", title: "Vibração da Língua", videoId: "", desc: "Em breve" },
      { id: "4.6", title: "Afrouxar a Mandíbula", videoId: "", desc: "Em breve" },
      { id: "4.7", title: "Portamento Oitavas", videoId: "", desc: "Em breve" },
      { id: "4.8", title: "Exercício da Sirene", videoId: "", desc: "Em breve" },
      { id: "4.9", title: "Deslize Vocal", videoId: "", desc: "Em breve" },
      { id: "4.10", title: "Cantar com Diafragma", videoId: "", desc: "Em breve" },
    ]
  }
};

export default function Lesson() {
  const { id } = useParams<{ id: string }>(); // Pega a lição da URL (ex: '1.1')
  const navigate = useNavigate();
  
  // Extrai o número do nível (ex: '1' a partir de '1.1')
  const levelId = id?.split('.')[0] || "1"; 
  const currentLevelData = academyData[levelId];
  
  // Encontra qual é a aula ativa baseada na URL
  const [activeLessonId, setActiveLessonId] = useState<string>(id || `${levelId}.1`);

  // Efeito para atualizar caso a URL mude
  useEffect(() => {
    if (id) setActiveLessonId(id);
  }, [id]);

  // Se não encontrar os dados do nível, mostra um fallback elegante
  if (!currentLevelData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-black text-cyan-400 mb-4">NÍVEL EM CONSTRUÇÃO</h1>
        <Button onClick={() => navigate('/academy')} variant="outline" className="text-white border-white/20">Voltar</Button>
      </div>
    );
  }

  // Descobre os detalhes da lição atualmente ativa
  const activeLessonData = currentLevelData.lessons.find((l: any) => l.id === activeLessonId);
  const videoToPlay = activeLessonData?.videoId || currentLevelData.introVideo;
  
  // Nomes e descrições para a tela principal
  const displayTitle = activeLessonData ? activeLessonData.title : "Introdução";
  const displayLabel = activeLessonData ? `AULA ${activeLessonData.id.split('.')[1]}` : "AULA INTRODUTÓRIA";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link da aula copiado!');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col pt-24 pb-12 font-sans text-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors w-fit">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-3">
             <PlayCircle size={14} /> MASTERCLASS - NÍVEL {levelId}
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight flex flex-col">
            {displayLabel}: <span className="text-cyan-400">{displayTitle}</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* PLAYER DE VÍDEO E EXERCÍCIO (ÁREA ESQUERDA) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            
            {/* O VÍDEO DO YOUTUBE */}
            <div className="w-full aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group">
              {videoToPlay ? (
                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${videoToPlay}?autoplay=1&rel=0&modestbranding=1`} 
                  title="Aula Academy" frameBorder="0" allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-black">
                    <Lock className="h-12 w-12 mb-4 opacity-50" />
                    <p className="font-bold uppercase tracking-widest text-xs">VÍDEO EM PRODUÇÃO</p>
                 </div>
              )}
              
              <button onClick={copyLink} className="absolute top-4 right-4 bg-black/60 hover:bg-cyan-500 hover:text-black text-white p-3 rounded-xl backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 border border-white/10">
                <Copy size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">Copiar Link</span>
              </button>
            </div>

            {/* O CARD DE "INICIAR TREINO" OFICIAL */}
            <div className="bg-zinc-950 border border-cyan-500/20 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(6,182,212,0.1)] mt-4">
               <Mic className="h-12 w-12 text-cyan-400 mb-4 opacity-80" />
               <h2 className="text-2xl font-black text-white italic uppercase tracking-widest mb-2">TREINO PRÁTICO</h2>
               <p className="text-sm text-gray-400 font-medium mb-8">Execute a técnica aprendida no vídeo acima utilizando o Motor Julliard de Análise Vocal.</p>
               <Button onClick={() => toast.success("Aguardando ativação do Sandbox...")} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest h-14 px-12 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                 INICIAR TREINO DE 60S
               </Button>
            </div>
          </div>

          {/* A PLAYLIST LATERAL (ÁREA DIREITA) */}
          <div className="lg:w-1/3 flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <ListVideo className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black text-white uppercase tracking-widest text-sm">PLAYLIST NÍVEL {levelId}</h3>
             </div>
             
             <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[2rem] p-4 overflow-y-auto max-h-[800px] space-y-3 custom-scrollbar">
                
                {/* Botão da Introdução */}
                <div 
                  onClick={() => navigate(`/lesson/${levelId}.intro`)}
                  className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeLessonId.includes('intro') ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'}`}
                >
                   <PlayCircle size={20} className="shrink-0" />
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Introdução</p>
                     <p className="text-sm font-black italic uppercase line-clamp-1">{currentLevelData.title}</p>
                   </div>
                </div>

                {/* Botões das 10 Aulas */}
                {currentLevelData.lessons.map((lesson: any, index: number) => (
                  <div 
                    key={lesson.id}
                    onClick={() => lesson.videoId ? navigate(`/lesson/${lesson.id}`) : toast.error("Aula ainda não liberada.")}
                    className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeLessonId === lesson.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'} ${!lesson.videoId ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                     {lesson.videoId ? <PlayCircle size={20} className="shrink-0" /> : <Lock size={20} className="shrink-0" />}
                     <div>
                       <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Aula {index + 1}</p>
                       <p className="text-sm font-black italic uppercase line-clamp-1">{lesson.title}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}