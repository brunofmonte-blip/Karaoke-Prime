// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Academy.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Mic2, Users, CheckCircle, GraduationCap, 
  Star, Airplay, PlayCircle, Lock, Trophy, Target, Flame 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  
  // 📚 Grade completa de Módulos (Com gamificação de níveis bloqueados)
  const trainingModules = [
    { id: 1, title: "Respiração e Apoio", description: "Controle de diafragma e fluxo de ar.", icon: Airplay, level: 1, duration: "10 min", locked: false },
    { id: 2, title: "Afinação Precisa", description: "Treinamento de ouvido e intervalos.", icon: Mic2, level: 2, duration: "12 min", locked: false },
    { id: 3, title: "Ressonância", description: "Melhora da qualidade tonal e clareza.", icon: BookOpen, level: 3, duration: "15 min", locked: false },
    { id: 4, title: "Interpretação Vocal", description: "Expressão e emoção ao cantar.", icon: Users, level: 4, duration: "20 min", locked: false },
    { id: 5, title: "Falsetes e Melismas", description: "Técnicas avançadas de R&B e Pop.", icon: Flame, level: 5, duration: "25 min", locked: true },
    { id: 6, title: "Aquecimento Master", description: "Rotina de show de 30 minutos.", icon: Target, level: 6, duration: "30 min", locked: true },
  ];

  return (
    <div className="min-h-screen relative pb-20 pt-28 px-4 font-sans overflow-hidden">
      
      {/* 🖼️ CAMADA 1: A IMAGEM DE FUNDO DA SALA/ESTÚDIO (Com mais opacidade para aparecer bem!) */}
      <img 
        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=80" 
        alt="Estúdio de Música / Sala de Aula" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" 
      />
      
      {/* 🌑 CAMADA 2: Gradiente ajustado para não engolir a foto, mas dar leitura ao texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
      
      {/* ========================================================= */}
      
      {/* ✨ CAMADA 3: O CONTEÚDO PRINCIPAL DO APP */}
      <div className="max-w-7xl mx-auto relative z-20 animate-in fade-in duration-700">
        
        {/* CABEÇALHO */}
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Palco
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-xs mb-3 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 backdrop-blur-md shadow-lg">
              <GraduationCap size={14} /> Centro de Treinamento
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight mb-4">
              Academy <span className="text-cyan-400 neon-blue-glow">Prime</span>
            </h1>
            <p className="text-gray-300 text-lg font-medium max-w-2xl drop-shadow-md">
              Aprenda as técnicas dos maiores vocalistas do mundo. Evolua seu nível e libere novos desafios.
            </p>
          </div>

          {/* PAINEL DE PROGRESSO (Gamificação) */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex gap-6 shadow-xl shrink-0">
            <div className="text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-white font-black text-lg">Nível 4</p>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Seu Rank</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <Star className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-white font-black text-lg">1.250</p>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">XP Acumulado</p>
            </div>
          </div>
        </div>

        {/* 📺 AULA EM DESTAQUE (A "metade" que estava faltando) */}
        <div className="mb-12 animate-in slide-in-from-bottom-5">
          <h2 className="text-white font-black uppercase tracking-widest flex items-center gap-2 mb-6">
            <PlayCircle className="text-cyan-400" /> Aula de Hoje em Destaque
          </h2>
          <Card className="bg-zinc-950/70 backdrop-blur-xl border-white/10 overflow-hidden rounded-[2rem] group flex flex-col md:flex-row relative shadow-[0_0_40px_rgba(34,211,238,0.1)]">
            <div className="md:w-1/2 relative aspect-video md:aspect-auto">
              {/* Thumbnail da Aula de Destaque */}
              <img 
                src="https://images.unsplash.com/photo-1520626887556-91e0a2cc1214?q=80&w=1000" 
                alt="Vocal Coach" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-500">
                <div className="w-20 h-20 rounded-full bg-cyan-400/20 border-2 border-cyan-400 backdrop-blur-md flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                  <PlayCircle className="w-10 h-10 text-cyan-400 translate-x-0.5" />
                </div>
              </div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                <Flame size={12} /> Aula Masterclass
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">
                Domine o seu <span className="text-cyan-400">Diafragma</span>
              </h3>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                Aprenda o segredo número 1 dos cantores profissionais para não perder o fôlego nas notas mais altas. Aula prática de 15 minutos com exercícios guiados.
              </p>
              <Button className="h-14 rounded-full bg-cyan-400 hover:bg-white text-black font-black uppercase tracking-widest text-xs transition-all w-full md:w-auto px-8 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                Assistir Aula Agora
              </Button>
            </div>
          </Card>
        </div>

        {/* 📚 MÓDULOS DE TREINAMENTO (A lista completa e gamificada) */}
        <h2 className="text-white font-black uppercase tracking-widest flex items-center gap-2 mb-6">
          <BookOpen className="text-cyan-400" /> Trilha de Conhecimento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5">
          {trainingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className={`bg-zinc-950/70 backdrop-blur-xl border-white/10 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl ${module.locked ? 'opacity-60 grayscale-[50%]' : 'hover:border-cyan-400/50 group'}`}>
                
                {module.locked && (
                  <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full border border-white/10 backdrop-blur-md">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                <div className={`h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 transition-transform shadow-lg ${!module.locked && 'group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] shrink-0'}`}>
                  <Icon className={`h-6 w-6 ${module.locked ? 'text-gray-500' : 'text-white group-hover:text-cyan-400'} transition-colors`} />
                </div>
                
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1">{module.title}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-2 min-h-[30px]">{module.description}</p>
                
                <div className="w-full grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <Star className={`w-4 h-4 mb-1 mx-auto ${module.locked ? 'text-gray-600' : 'text-yellow-500'}`} />
                    <p className="text-lg font-black text-white">Lvl {module.level}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Dificuldade</p>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <GraduationCap className={`w-4 h-4 mb-1 mx-auto ${module.locked ? 'text-gray-600' : 'text-cyan-400'}`} />
                    <p className="text-lg font-black text-white">{module.duration}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Duração</p>
                  </div>
                </div>
                
                <Button disabled={module.locked} className={`w-full h-12 rounded-full font-black uppercase tracking-widest text-[10px] transition-all mt-auto ${module.locked ? 'bg-zinc-800 text-gray-500' : 'bg-white hover:bg-cyan-400 text-black shadow-lg'}`}>
                  {module.locked ? 'DESBLOQUEIA NO LVL 5' : (
                    <>INICIAR EXERCÍCIO <CheckCircle className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Academy;