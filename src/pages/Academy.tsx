import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// 🚨 IMPORTANDO OS NOVOS MENUS PREMIUM PADRONIZADOS
import AcademyLevel1Menu from '@/components/AcademyLevel1Menu';
import AcademyLevel2Menu from '@/components/AcademyLevel2Menu';
import AcademyLevel3Menu from '@/components/AcademyLevel3Menu';
import AcademyLevel4Menu from '@/components/AcademyLevel4Menu';

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

  // 🚨 FUNÇÃO DE ROTEAMENTO PREMIUM ATUALIZADA (Níveis 1, 2, 3 e 4)
  const handleLevelClick = (levelId: number) => {
    // Lista de níveis que já possuem a tela premium construída
    const builtLevels = [1, 2, 3, 4];
    
    if (builtLevels.includes(levelId)) {
        setActiveLevel(levelId);
    } else {
        // Fallback antigo para os níveis que ainda não construímos a tela premium
        navigate(`/lesson/${levelId}`);
    }
  };

  // Renderizador dinâmico do conteúdo do nível
  const renderActiveLevel = () => {
    switch(activeLevel) {
        case 1: return <AcademyLevel1Menu />;
        case 2: return <AcademyLevel2Menu />;
        case 3: return <AcademyLevel3Menu />;
        case 4: return <AcademyLevel4Menu />;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      
      <div className="absolute inset-0 z-0 fixed">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" 
          alt="Studio Background" 
          className="w-full h-full object-cover opacity-40" 
        />
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
                    <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <GraduationCap size={14} /> Centro de Treinamento
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        ACADEMY <span className="text-cyan-400 neon-blue-glow">PRIME</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                        Aprenda as técnicas dos maiores vocalistas do mundo, {user?.displayName?.split(' ')[0] || 'Cantor'}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modulos.map((mod) => {
                        const isLockedForUser = mod.locked && !isPremiumUser;

                        return (
                            <Card 
                                key={mod.id}
                                className={`relative p-8 rounded-[2rem] border transition-all flex flex-col items-center text-center h-full ${
                                    isLockedForUser 
                                    ? 'bg-zinc-950/40 border-white/5 opacity-50' 
                                    : 'bg-zinc-950/80 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-500/50 hover:bg-zinc-900'
                                }`}
                            >
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 border transition-colors ${isLockedForUser ? 'bg-white/5 border-white/5' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
                                    {isLockedForUser ? <Lock size={20} className="text-gray-600" /> : <PlayCircle size={24} className="text-cyan-400" />}
                                </div>

                                <h3 className="font-black text-white text-sm uppercase italic tracking-widest mb-2">{mod.titulo}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mb-6 flex-1 italic">
                                    {mod.desc}
                                </p>

                                <div className="flex gap-4 mb-8">
                                    <div className="text-center">
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Dificuldade</p>
                                        <p className="text-xs font-black text-white italic">Lvl {mod.id}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Duração</p>
                                        <p className="text-xs font-black text-white italic">{mod.time}</p>
                                    </div>
                                </div>

                                {!isLockedForUser ? (
                                    <Button 
                                        onClick={() => handleLevelClick(mod.id)} 
                                        className="w-full rounded-full bg-white text-black font-black uppercase tracking-tighter text-[10px] h-10 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                    >
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