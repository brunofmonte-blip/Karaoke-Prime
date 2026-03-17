import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, ArrowLeft, Wind, X, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// O Motor de Treino Respiratório
import { VocalSandboxProvider } from '@/hooks/use-vocal-sandbox';
import FarinelliExercise from '@/components/FarinelliExercise';

// ============================================================================
// COMPONENTES DOS NÍVEIS EMBUTIDOS
// ============================================================================

const Level1Menu = () => {
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // 🚨 INVENTÁRIO DO NÍVEL 1 INJETADO
  const lessons1 = [
    { id: "1.1", title: "Respiração Diafragmática", desc: "Aprenda a respirar usando o diafragma para maior controle.", videoId: "Wl6xUHg9iAQ" },
    { id: "1.2", title: "Controle de Fluxo de Ar", desc: "Exercícios para manter a saída de ar constante e controlada.", videoId: "fQKI_SFrrOo" },
    { id: "1.3", title: "Sustentação Vocal", desc: "Segurando notas longas sem perder o fôlego ou tremer.", videoId: "X65IOyha6EQ" },
    { id: "1.4", title: "Aquecimento Labial", desc: "Lip trills (vibração) para aquecer sem forçar as cordas.", videoId: "3nL733b7rgQ" },
    { id: "1.5", title: "Soltando a Língua", desc: "Exercícios para relaxar a base da língua e evitar tensão.", videoId: "vImzV9TdLdo" },
    { id: "1.6", title: "Sirene Vocal", desc: "Conectando os registros grave e agudo de forma suave.", videoId: "ZsvFS4u2P8I" },
    { id: "1.7", title: "Articulação Exagerada", desc: "Melhorando a dicção inicial para clareza das palavras.", videoId: "PW3Oj_uagpI" },
    { id: "1.8", title: "Ataque Suave", desc: "Iniciando notas sem golpes de glote (sem machucar a voz).", videoId: "KqVkz8jdcpc" },
    { id: "1.9", title: "Ressonância Básica", desc: "Direcionando o som para a máscara facial pela primeira vez.", videoId: "dHVMUp4MRD8" },
    { id: "1.10", title: "Prática Geral", desc: "Juntando todos os fundamentos em uma rotina prática.", videoId: "qpQuTYKLC-U" },
  ];

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /></Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 1</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Fundamentos do Apoio Vocal</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 1</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Fundamentos e <span className="text-cyan-400">Respiração</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">A fundação de todo grande cantor. Domine o seu fluxo de ar e prepare suas cordas vocais para a evolução.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO FUNDAMENTAL</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/m75jPge9QUM?rel=0&modestbranding=1" title="Introdução Nível 1" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons1.map((lesson) => (
            <Card key={lesson.id} onClick={() => lesson.videoId ? setActiveVideo(lesson.videoId) : null} className={`p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${lesson.videoId ? 'bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group' : 'bg-black/50 border-white/5 opacity-60 cursor-not-allowed'}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border ${lesson.videoId ? 'bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all' : 'bg-zinc-900 border-white/5 text-gray-600'}`}>
                {lesson.videoId ? <PlayCircle size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
                {!lesson.videoId && <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* MODAL DE VÍDEO NÍVEL 1 */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <Button variant="ghost" onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full"><X size={32} /></Button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} title="Aula Prática" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

const Level2Menu = () => {
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // 🚨 INVENTÁRIO DO NÍVEL 2 INJETADO (Com títulos originais gerados para Afinação)
  const lessons2 = [
    { id: "2.1", title: "Percepção Auditiva", desc: "Treinando o ouvido para reconhecer notas e intervalos.", videoId: "TTVVJTnentM" },
    { id: "2.2", title: "Escalas Maiores", desc: "Subindo e descendo a escala com precisão matemática.", videoId: "uIgaE7Ekh1k" },
    { id: "2.3", title: "Saltos de Terça", desc: "Acertando notas distantes sem 'escorregar' na afinação.", videoId: "fsIczoqU89M" },
    { id: "2.4", title: "Memória Muscular Vocal", desc: "Travando o tom exato no seu corpo.", videoId: "Ld6XC8dlNlA" },
    { id: "2.5", title: "Arpejos Simples", desc: "Treino de agilidade mantendo a afinação impecável.", videoId: "JRqTqIRCoWo" },
    { id: "2.6", title: "Afinação com Vibrato", desc: "Mantendo o centro da nota mesmo durante a oscilação.", videoId: "cp1ICtprIwU" },
    { id: "2.7", title: "Harmonia Básica", desc: "Como cantar afinado junto com acordes complexos.", videoId: "sYQ_iugBGDE" },
    { id: "2.8", title: "Correção de Pitch", desc: "Identificando quando e como corrigir sua voz em tempo real.", videoId: "yfHrDfNBBH0" },
    { id: "2.9", title: "Sustentação Afinada", desc: "Segurando a nota longa sem deixar a afinação cair no final.", videoId: "iOOrgqzN0tY" },
    { id: "2.10", title: "Desafio A Capella", desc: "Cantando sem acompanhamento mantendo o tom original.", videoId: "_nkKaweJPSk" },
  ];

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /></Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 2</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Estabilidade do Sopro</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 2</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Afinação <span className="text-cyan-400">Precisa</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Treine o seu ouvido e a sua musculatura para acertar o centro exato de cada nota musical sem hesitar.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO INTERMEDIÁRIO</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/8bR5O0hEMYU?rel=0&modestbranding=1" title="Introdução Nível 2" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons2.map((lesson) => (
            <Card key={lesson.id} onClick={() => lesson.videoId ? setActiveVideo(lesson.videoId) : null} className={`p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${lesson.videoId ? 'bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group' : 'bg-black/50 border-white/5 opacity-60 cursor-not-allowed'}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border ${lesson.videoId ? 'bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all' : 'bg-zinc-900 border-white/5 text-gray-600'}`}>
                {lesson.videoId ? <PlayCircle size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
                {!lesson.videoId && <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* MODAL DE VÍDEO NÍVEL 2 */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <Button variant="ghost" onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full"><X size={32} /></Button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} title="Aula Prática" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

const Level3Menu = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);

  const lessons3 = [
    { id: "3.1", title: "O Poder do Humming", desc: "Encontrar e fortalecer a ressonância na máscara facial.", videoId: "vWuOiC1PqX0" },
    { id: "3.2", title: "Ginástica Articulatória", desc: "Destravar a mandíbula, a língua e os lábios com trava-línguas.", videoId: "ErZxD3GAP-o" },
    { id: "3.3", title: "Sirenes e Conexão", desc: "Eliminar as 'quebras' na voz usando o Mix Voice.", videoId: "6U2Xk0OzsfA" },
    { id: "3.4", title: "Acordando o Peito", desc: "Dominar a voz de peito para criar tons graves e quentes.", videoId: "kp4Whqij-DE" },
    { id: "3.5", title: "O Brilho da Cabeça", desc: "Diferenciar a voz de cabeça do falsete para notas agudas.", videoId: "GSR3YUQPHyM" },
    { id: "3.6", title: "Modificação de Vogais", desc: "O segredo para arredondar as vogais nas notas altas.", videoId: "K66Di3oSw7M" },
    { id: "3.7", title: "O Groove da Dicção", desc: "Usar consoantes duras como ferramentas rítmicas.", videoId: "ZBL2BM-XqvI" },
    { id: "3.8", title: "O Brilho do Twang", desc: "O estreitamento do epilaringe para cortar a banda.", videoId: "" },
    { id: "3.9", title: "Costurando os Registros", desc: "Juntar peito e cabeça com exercícios de choro e lamento.", videoId: "" },
    { id: "3.10", title: "Prova de Fogo da Dicção", desc: "Aplicar ressonância e vogais puras na música real.", videoId: "" },
  ];

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /> FECHAR TREINO</Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 3</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Prove que você tem pulmão nível Julliard</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Activity size={14} /> Level 3</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Ressonância e <span className="text-cyan-400">Dicção</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Deixe de apenas "emitir som" e passe a dar cor, brilho e clareza à sua voz.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO FARINELLI</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/IzZCDVzsghA?rel=0&modestbranding=1" title="Introdução Nível 3" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons3.map((lesson) => (
            <Card key={lesson.id} onClick={() => lesson.videoId ? setActiveVideo(lesson.videoId) : null} className={`p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${lesson.videoId ? 'bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group' : 'bg-black/50 border-white/5 opacity-60 cursor-not-allowed'}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border ${lesson.videoId ? 'bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all' : 'bg-zinc-900 border-white/5 text-gray-600'}`}>
                {lesson.videoId ? <PlayCircle size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
                {!lesson.videoId && <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <Button variant="ghost" onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full"><X size={32} /></Button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} title="Aula Prática" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

const Level4Menu = () => {
  const [isFarinelliActive, setIsFarinelliActive] = useState(false);
  const lessons4 = [
    { id: "4.1", title: "Bocejo-Suspiro", desc: "Técnica para relaxar a voz e melhorar o alcance vocal.", videoId: "" },
    { id: "4.2", title: "Boca Chiusa (scale)", desc: "Aquecimento sem sobrecarga com 'hmmm' na escala maior.", videoId: "" },
    { id: "4.3", title: "Exercício com Canudo", desc: "Cantarolar através do canudo do grave ao agudo para controle.", videoId: "" },
    { id: "4.4", title: "Vibração Labial", desc: "Aquecimento simples fazendo o som de um barco a motor.", videoId: "" },
    { id: "4.5", title: "Vibração da Língua", desc: "Enrolar a língua e rolar os 'Rs' através do seu alcance vocal.", videoId: "" },
    { id: "4.6", title: "Afrouxar a Mandíbula", desc: "Bocejar com a boca fechada e sentir onde a mandíbula solta.", videoId: "" },
    { id: "4.7", title: "Portamento em Duas Oitavas", desc: "Deslizando gradualmente pelas notas cromáticas.", videoId: "" },
    { id: "4.8", title: "Exercício da Sirene", desc: "Som de 'oooo' do grave ao agudo e de volta.", videoId: "" },
    { id: "4.9", title: "Técnica de Deslize Vocal", desc: "Portamento entre notas próximas sem cantar as intermediárias.", videoId: "" },
    { id: "4.10", title: "Cantar com o Diafragma", desc: "Técnica de respiração correta para dar força e controle.", videoId: "" },
  ];

  if (isFarinelliActive) {
    return (
      <VocalSandboxProvider>
        <div className="min-h-[80vh] bg-zinc-950 border border-cyan-500/30 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
          <Button variant="ghost" onClick={() => setIsFarinelliActive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white rounded-full"><X size={24} /></Button>
          <div className="mb-4 text-center"><h2 className="text-3xl font-black text-cyan-400 uppercase tracking-widest italic flex items-center justify-center gap-3"><Wind className="h-8 w-8" /> Laboratório de Respiração Lvl 4</h2><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Controle Dinâmico da Coluna de Ar</p></div>
          <FarinelliExercise moduleType="farinelli" />
        </div>
      </VocalSandboxProvider>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 4</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Interpretação <span className="text-cyan-400">Vocal</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Nível focado em expressão e emoção ao cantar. Aguardando texto introdutório oficial.</p>
          <Button onClick={() => setIsFarinelliActive(true)} className="w-full h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"><Wind size={20} /> ABRIR TREINO DE DINÂMICA</Button>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">Aguardando Vídeo Introdutório do Nível 4</div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas do Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons4.map((lesson) => (
            <Card key={lesson.id} className="p-6 rounded-[2rem] bg-black/50 border-white/5 opacity-60 cursor-not-allowed flex items-start gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/5 text-gray-600"><Lock size={20} /></div>
              <div><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div><h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4><p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p><p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-3">Em Breve</p></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// A TELA PRINCIPAL (ROTEADOR MESTRE)
// ============================================================================

export default function Academy() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const isPremiumUser = user?.email === 'bruno.fmonte@gmail.com';

  const modulos = [
    { id: 1, titulo: 'INTRODUÇÃO E AFINAÇÃO', desc: 'Fundamentos de ouvido e intervalos básicos.', time: '10 min', locked: false },
    { id: 2, titulo: 'AFINAÇÃO PRECISA', desc: 'Treinamento intermediário e controle tonal.', time: '12 min', locked: true },
    { id: 3, titulo: 'RESSONÂNCIA E DICÇÃO', desc: 'A cor da voz e a clareza das palavras.', time: '15 min', locked: true },
    { id: 4, titulo: 'INTERPRETAÇÃO VOCAL', desc: 'Expressão e emoção ao cantar.', time: '20 min', locked: true },
    { id: 5, titulo: 'FALSETES E MELISMAS', desc: 'Técnicas avançadas de R&B e POP.', time: '25 min', locked: true },
    { id: 6, titulo: 'VIBRATO MASTER', desc: 'Oscilação perfeita e controle.', time: '20 min', locked: true },
    { id: 7, titulo: 'DRIVES E RASPS', desc: 'Distorção vocal com segurança.', time: '25 min', locked: true },
    { id: 8, titulo: 'AGUDOS (BELTING)', desc: 'Potência sem machucar a garganta.', time: '30 min', locked: true },
    { id: 9, titulo: 'DINÂMICA E MICROFONE', desc: 'Uso correto do equipamento de palco.', time: '20 min', locked: true },
    { id: 10, titulo: 'SHOW COMPLETO', desc: 'A prova final. Rotina de 40 minutos.', time: '40 min', locked: true },
  ];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans text-white">
        <div className="h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-cyan-400 font-black uppercase tracking-widest text-xs">Autenticando VIP...</p>
      </div>
    );
  }

  // Renderizador Inteligente
  const renderActiveLevel = () => {
    switch(activeLevel) {
        case 1: return <Level1Menu />;
        case 2: return <Level2Menu />;
        case 3: return <Level3Menu />;
        case 4: return <Level4Menu />;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      
      <div className="absolute inset-0 z-0 fixed">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" alt="Studio Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
      </div>

      <div className="z-10 max-w-7xl mx-auto w-full relative">
        
        <button 
          onClick={() => activeLevel ? setActiveLevel(null) : navigate('/')} 
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors bg-black/50 px-4 py-2 rounded-full border border-white/10 w-fit backdrop-blur-md"
        >
          <ArrowLeft size={16} /> {activeLevel ? 'Voltar para os Níveis' : 'Voltar para o Palco'}
        </button>

        {activeLevel ? (
            <div className="animate-in slide-in-from-right-10 duration-500">
                {renderActiveLevel()}
            </div>
        ) : (
            <div className="animate-in fade-in duration-500">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]"><GraduationCap size={14} /> Centro de Treinamento</div>
                    <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">ACADEMY <span className="text-cyan-400 neon-blue-glow">PRIME</span></h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Aprenda as técnicas dos maiores vocalistas do mundo, {user?.displayName?.split(' ')[0] || 'Cantor'}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modulos.map((mod) => {
                        const isLockedForUser = mod.locked && !isPremiumUser;
                        return (
                            <Card key={mod.id} className={`relative p-8 rounded-[2rem] border transition-all flex flex-col items-center text-center h-full ${isLockedForUser ? 'bg-zinc-950/40 border-white/5 opacity-50' : 'bg-zinc-950/80 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-500/50 hover:bg-zinc-900'}`}>
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${isLockedForUser ? 'bg-white/5 border-white/5' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
                                    {isLockedForUser ? <Lock size={20} className="text-gray-600" /> : <PlayCircle size={24} className="text-cyan-400" />}
                                </div>
                                <h3 className="font-black text-white text-sm uppercase italic tracking-widest mb-2">{mod.titulo}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mb-6 flex-1 italic">{mod.desc}</p>
                                <div className="flex gap-4 mb-8">
                                    <div className="text-center"><p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Dificuldade</p><p className="text-xs font-black text-white italic">Lvl {mod.id}</p></div>
                                    <div className="text-center"><p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Duração</p><p className="text-xs font-black text-white italic">{mod.time}</p></div>
                                </div>
                                {!isLockedForUser ? (
                                    <Button onClick={() => handleLevelClick(mod.id)} className="w-full rounded-full bg-white text-black font-black uppercase tracking-tighter text-[10px] h-10 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                        Iniciar Módulo
                                    </Button>
                                ) : (
                                    <Button onClick={() => navigate('/premium')} className="w-full rounded-full bg-white/5 text-gray-600 font-black uppercase tracking-tighter text-[10px] h-10 border border-white/5 hover:border-white/20">
                                        Assinar para Desbloquear
                                    </Button>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}