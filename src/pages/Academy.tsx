import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// ============================================================================
// COMPONENTES DOS NÍVEIS
// ============================================================================

const Level1Menu = () => {
  const navigate = useNavigate();
  const lessons1 = [
    { id: "1.1", title: "Respiração Diafragmática", desc: "Aprenda a respirar usando o diafragma para maior controle." },
    { id: "1.2", title: "Controle de Fluxo de Ar", desc: "Exercícios para manter a saída de ar constante e controlada." },
    { id: "1.3", title: "Sustentação Vocal", desc: "Segurando notas longas sem perder o fôlego ou tremer." },
    { id: "1.4", title: "Aquecimento Labial", desc: "Lip trills (vibração) para aquecer sem forçar as cordas." },
    { id: "1.5", title: "Soltando a Língua", desc: "Exercícios para relaxar a base da língua e evitar tensão." },
    { id: "1.6", title: "Sirene Vocal", desc: "Conectando os registros grave e agudo de forma suave." },
    { id: "1.7", title: "Articulação Exagerada", desc: "Melhorando a dicção inicial para clareza das palavras." },
    { id: "1.8", title: "Ataque Suave", desc: "Iniciando notas sem golpes de glote (sem machucar a voz)." },
    { id: "1.9", title: "Ressonância Básica", desc: "Direcionando o som para a máscara facial pela primeira vez." },
    { id: "1.10", title: "Prática Geral", desc: "Juntando todos os fundamentos em uma rotina prática." },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 1</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Fundamentos e <span className="text-cyan-400">Respiração</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">A fundação de todo grande cantor. Domine o seu fluxo de ar e prepare suas cordas vocais para a evolução.</p>
          <div className="w-full h-16 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            BEM VINDO AO NÍVEL INTRODUÇÃO E AFINAÇÃO
          </div>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/m75jPge9QUM?rel=0&modestbranding=1" title="Introdução Nível 1" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas e Exercícios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons1.map((lesson) => (
            <Card key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)} className="p-6 rounded-[2rem] border transition-all flex items-start gap-4 bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all"><PlayCircle size={20} /></div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Level2Menu = () => {
  const navigate = useNavigate();
  const lessons2 = [
    { id: "2.1", title: "Percepção Auditiva", desc: "Treinando o ouvido para reconhecer notas e intervalos." },
    { id: "2.2", title: "Escalas Maiores", desc: "Subindo e descendo a escala com precisão matemática." },
    { id: "2.3", title: "Saltos de Terça", desc: "Acertando notas distantes sem 'escorregar' na afinação." },
    { id: "2.4", title: "Memória Muscular Vocal", desc: "Travando o tom exato no seu corpo." },
    { id: "2.5", title: "Arpejos Simples", desc: "Treino de agilidade mantendo a afinação impecável." },
    { id: "2.6", title: "Afinação com Vibrato", desc: "Mantendo o centro da nota mesmo durante a oscilação." },
    { id: "2.7", title: "Harmonia Básica", desc: "Como cantar afinado junto com acordes complexos." },
    { id: "2.8", title: "Correção de Pitch", desc: "Identificando quando e como corrigir sua voz em tempo real." },
    { id: "2.9", title: "Sustentação Afinada", desc: "Segurando a nota longa sem deixar a afinação cair no final." },
    { id: "2.10", title: "Desafio A Capella", desc: "Cantando sem acompanhamento mantendo o tom original." },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 2</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Afinação <span className="text-cyan-400">Precisa</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Treine o seu ouvido e a sua musculatura para acertar o centro exato de cada nota musical sem hesitar.</p>
          <div className="w-full h-16 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            BEM VINDO AO NÍVEL AFINAÇÃO PRECISA
          </div>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/8bR5O0hEMYU?rel=0&modestbranding=1" title="Introdução Nível 2" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas e Exercícios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons2.map((lesson) => (
            <Card key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)} className="p-6 rounded-[2rem] border transition-all flex items-start gap-4 bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all"><PlayCircle size={20} /></div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Level3Menu = () => {
  const navigate = useNavigate();
  const lessons3 = [
    { id: "3.1", title: "O Poder do Humming", desc: "Encontrar e fortalecer a ressonância na máscara facial." },
    { id: "3.2", title: "Ginástica Articulatória", desc: "Destravar a mandíbula, a língua e os lábios com trava-línguas." },
    { id: "3.3", title: "Sirenes e Conexão", desc: "Eliminar as 'quebras' na voz usando o Mix Voice." },
    { id: "3.4", title: "Acordando o Peito", desc: "Dominar a voz de peito para criar tons graves e quentes." },
    { id: "3.5", title: "O Brilho da Cabeça", desc: "Diferenciar a voz de cabeça do falsete para notas agudas." },
    { id: "3.6", title: "Modificação de Vogais", desc: "O segredo para arredondar as vogais nas notas altas." },
    { id: "3.7", title: "O Groove da Dicção", desc: "Usar consoantes duras como ferramentas rítmicas." },
    { id: "3.8", title: "O Brilho do Twang", desc: "O estreitamento do epilaringe para cortar a banda." },
    { id: "3.9", title: "Costurando os Registros", desc: "Juntar peito e cabeça com exercícios de choro e lamento." },
    { id: "3.10", title: "Prova de Fogo da Dicção", desc: "Aplicar ressonância e vogais puras na música real." },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 3</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Ressonância e <span className="text-cyan-400">Dicção</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Deixe de apenas "emitir som" e passe a dar cor, brilho e clareza à sua voz.</p>
          <div className="w-full h-16 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            BEM VINDO AO NÍVEL RESSONÂNCIA E DICÇÃO
          </div>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px]">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/IzZCDVzsghA?rel=0&modestbranding=1" title="Introdução Nível 3" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full object-cover"></iframe>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas e Exercícios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons3.map((lesson) => (
            <Card key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)} className="p-6 rounded-[2rem] border transition-all flex items-start gap-4 bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all"><PlayCircle size={20} /></div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Level4Menu = () => {
  const navigate = useNavigate();
  const lessons4 = [
    { id: "4.1", title: "Bocejo-Suspiro", desc: "Técnica para relaxar a voz e melhorar o alcance vocal." },
    { id: "4.2", title: "Boca Chiusa (scale)", desc: "Aquecimento sem sobrecarga com 'hmmm' na escala maior." },
    { id: "4.3", title: "Exercício com Canudo", desc: "Cantarolar através do canudo do grave ao agudo para controle." },
    { id: "4.4", title: "Vibração Labial", desc: "Aquecimento simples fazendo o som de um barco a motor." },
    { id: "4.5", title: "Vibração da Língua", desc: "Enrolar a língua e rolar os 'Rs' através do seu alcance vocal." },
    { id: "4.6", title: "Afrouxar a Mandíbula", desc: "Bocejar com a boca fechada e sentir onde a mandíbula solta." },
    { id: "4.7", title: "Portamento em Duas Oitavas", desc: "Deslizando gradualmente pelas notas cromáticas." },
    { id: "4.8", title: "Exercício da Sirene", desc: "Som de 'oooo' do grave ao agudo e de volta." },
    { id: "4.9", title: "Técnica de Deslize Vocal", desc: "Portamento entre notas próximas sem cantar as intermediárias." },
    { id: "4.10", title: "Cantar com o Diafragma", desc: "Técnica de respiração correta para dar força e controle." },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-4 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 w-fit"><Target size={14} /> Level 4</div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">Interpretação <span className="text-cyan-400">Vocal</span></h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-8">Nível focado em expressão e emoção ao cantar. Aguardando texto introdutório oficial.</p>
          <div className="w-full h-16 rounded-full bg-cyan-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            BEM VINDO AO NÍVEL INTERPRETAÇÃO VOCAL
          </div>
        </div>
        <div className="lg:w-1/2 bg-black relative min-h-[300px] flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">Aguardando Vídeo Introdutório do Nível 4</div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8 flex items-center gap-3"><PlayCircle className="text-cyan-400" /> Aulas e Exercícios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons4.map((lesson) => (
            <Card key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)} className="p-6 rounded-[2rem] border transition-all flex items-start gap-4 bg-zinc-950 border-white/10 hover:border-cyan-500/50 cursor-pointer hover:bg-white/5 group">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border bg-zinc-900 border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-white transition-all"><PlayCircle size={20} /></div>
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded-md">Lição {lesson.id}</span></div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{lesson.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ROTEADOR MESTRE
// ============================================================================

export default function Academy() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else { setUser(currentUser); setLoadingAuth(false); }
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

  if (loadingAuth) return <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans text-white"><div className="h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-cyan-400 font-black uppercase tracking-widest text-xs">Autenticando VIP...</p></div>;

  const handleLevelClick = (levelId: number) => {
    const builtLevels = [1, 2, 3, 4];
    if (builtLevels.includes(levelId)) setActiveLevel(levelId);
    else navigate(`/lesson/${levelId}`);
  };

  const renderActiveLevel = () => {
    switch(activeLevel) {
        case 1: return <Level1Menu />; case 2: return <Level2Menu />; case 3: return <Level3Menu />; case 4: return <Level4Menu />; default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 fixed"><img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" alt="Studio" className="w-full h-full object-cover opacity-40" /><div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" /></div>
      <div className="z-10 max-w-7xl mx-auto w-full relative">
        <button onClick={() => activeLevel ? setActiveLevel(null) : navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors bg-black/50 px-4 py-2 rounded-full border border-white/10 w-fit backdrop-blur-md">
          <ArrowLeft size={16} /> {activeLevel ? 'Voltar para os Níveis' : 'Voltar para o Palco'}
        </button>

        {activeLevel ? (
            <div className="animate-in slide-in-from-right-10 duration-500">{renderActiveLevel()}</div>
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