// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/BasicLobby.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, PlayCircle, Star, Activity, CheckCircle2, Trophy, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  
  // Estados do Palco: 'selecao' (escolhendo música) -> 'cantando' (karaoke) -> 'resultado' (nota)
  const [stage, setStage] = useState<'selecao' | 'cantando' | 'resultado'>('selecao');
  
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  // Músicas de demonstração para o MVP
  const songs = [
    { id: 1, title: "Someone Like You", artist: "Adele", difficulty: "Avançado", duration: 15 },
    { id: 2, title: "Evidências", artist: "Chitãozinho & Xororó", difficulty: "Intermediário", duration: 15 },
    { id: 3, title: "Yellow", artist: "Coldplay", difficulty: "Iniciante", duration: 15 }
  ];

  // Lógica de simulação do Karaokê (15 segundos para MVP)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'cantando') {
      if (progress < 100) {
        timer = setTimeout(() => setProgress(progress + 1), 150); // 15s total aprox
      } else {
        setScore(Math.floor(Math.random() * 15) + 80); // Nota entre 80 e 95
        setStage('resultado');
      }
    }
    return () => clearTimeout(timer);
  }, [stage, progress]);

  const handleStartSinging = (song: any) => {
    setSelectedSong(song);
    setProgress(0);
    setStage('cantando');
  };

  const handleReset = () => {
    setStage('selecao');
    setSelectedSong(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      {/* Background dinâmico baseado no estágio */}
      <img src="https://images.unsplash.com/photo-1516280440502-6178bc57c0e8?q=80&w=2000" alt="Stage" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === 'cantando' ? 'opacity-30' : 'opacity-10'}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-0" />
      
      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        {/* 1. ESTADO: SELEÇÃO DE MÚSICAS */}
        {stage === 'selecao' && (
          <div className="animate-in slide-in-from-bottom-10">
            <div className="mb-12 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Music size={14} /> Palco Livre
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight mb-4">
                Escolha o seu <span className="text-primary neon-blue-glow">Hit</span>
              </h1>
              <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto md:mx-0">
                Coloque em prática o que aprendeu na Academy. Nossa IA vai monitorar sua afinação, ritmo e sustentação em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {songs.map((song) => (
                <Card key={song.id} className="bg-zinc-950/80 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center group">
                  <div className="h-20 w-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)]">
                    <Mic2 className="h-8 w-8 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">{song.title}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">{song.artist}</p>
                  
                  <div className="w-full flex justify-between items-center mb-6 px-4 py-2 bg-black/50 rounded-full border border-white/5">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Dificuldade</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${song.difficulty === 'Iniciante' ? 'text-green-400' : song.difficulty === 'Intermediário' ? 'text-yellow-400' : 'text-orange-500'}`}>
                      {song.difficulty}
                    </span>
                  </div>

                  <Button onClick={() => handleStartSinging(song)} className="w-full h-14 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest transition-all">
                    CANTAR AGORA <PlayCircle className="ml-2 h-5 w-5" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 2. ESTADO: CANTANDO (TELEPROMPTER) */}
        {stage === 'cantando' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-700">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{selectedSong.artist}</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-16 drop-shadow-[0_0_30px_rgba(0,168,225,0.5)]">
              {selectedSong.title}
            </h1>

            {/* Simulação de Teleprompter e Letras */}
            <div className="text-center space-y-4 mb-16 max-w-3xl overflow-hidden h-32 relative mask-image-fade">
              <p className="text-2xl md:text-4xl font-black text-gray-500 uppercase italic tracking-tighter opacity-50 transform -translate-y-4 transition-all">
                Never mind, I'll find
              </p>
              <p className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter scale-110 drop-shadow-lg transition-all text-primary neon-blue-glow">
                Someone like you...
              </p>
              <p className="text-2xl md:text-4xl font-black text-gray-500 uppercase italic tracking-tighter opacity-50 transform translate-y-4 transition-all">
                I wish nothing but the best
              </p>
            </div>

            {/* Ondas Sonoras e Progresso */}
            <div className="w-full max-w-2xl relative">
              <div className="flex justify-center items-center gap-1 mb-8 h-12">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 bg-primary/50 rounded-full animate-pulse" 
                       style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              
              <div className="w-full bg-zinc-900 rounded-full h-3 mb-2 overflow-hidden border border-white/10">
                <div className="bg-gradient-to-r from-blue-500 to-primary h-full rounded-full transition-all duration-150 ease-linear shadow-[0_0_20px_rgba(0,168,225,0.5)]" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between w-full text-[10px] text-primary font-black tracking-widest uppercase">
                <span className="animate-pulse flex items-center gap-2"><Activity size={12} /> IA Analisando Voz...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. ESTADO: RESULTADO (NOTA DA IA) */}
        {stage === 'resultado' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
            <div className="h-32 w-32 rounded-full border-4 border-green-500/30 bg-green-500/10 flex items-center justify-center mb-6 shadow-[0_0_80px_rgba(34,197,94,0.3)]">
              <Star className="h-16 w-16 text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" fill="currentColor" />
            </div>
            
            <div className="inline-flex items-center gap-2 text-green-500 font-black uppercase tracking-widest text-sm mb-4 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/30">
              <CheckCircle2 size={18} /> Performance Concluída
            </div>
            
            <h2 className="text-xl text-gray-400 font-bold uppercase tracking-widest mb-2">Sua Pontuação de IA</h2>
            <h1 className="text-8xl font-black text-white italic tracking-tighter drop-shadow-lg mb-8">
              {score}<span className="text-4xl text-gray-500">%</span>
            </h1>
            
            <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 mb-10 text-left w-full max-w-xl shadow-xl">
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                <Trophy size={18} className="text-yellow-500" /> Relatório de Performance
              </h4>
              <ul className="space-y-4 text-gray-400 text-sm font-medium">
                <li className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="uppercase tracking-widest text-xs">Afinação (Pitch)</span>
                  <span className="text-green-400 font-black">Excelente</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="uppercase tracking-widest text-xs">Sustentação de Ar</span>
                  <span className="text-yellow-400 font-black">Bom</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="uppercase tracking-widest text-xs">Ritmo (Timing)</span>
                  <span className="text-green-400 font-black">Perfeito</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-4 w-full max-w-md">
              <Button onClick={handleReset} className="flex-1 h-16 rounded-full bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all">
                Cantar Outra
              </Button>
              <Button onClick={() => navigate('/academy')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                Voltar aos Treinos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicLobby;