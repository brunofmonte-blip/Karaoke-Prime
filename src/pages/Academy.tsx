import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, Star, ArrowLeft, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Academy() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  // Fica escutando se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Simulação do Banco de Dados dos Módulos Principais
  const modulos = [
    { id: 1, titulo: 'Respiração e Postura', desc: 'Fundamentos essenciais para não cansar a voz.', locked: false },
    { id: 2, titulo: 'Afinação Base', desc: 'Exercícios práticos para cravar as notas.', locked: true },
    { id: 3, titulo: 'Extensão Vocal', desc: 'Aprenda a alcançar agudos e graves sem esforço.', locked: true },
    { id: 4, titulo: 'Ressonância', desc: 'Projete a sua voz com potência de palco.', locked: true },
    { id: 5, titulo: 'Vibrato & Melismas', desc: 'Os segredos das grandes divas do R&B.', locked: true },
    { id: 6, titulo: 'Masterclass: Belting', desc: 'Técnica avançada de agudos de peito.', locked: true },
  ];

  // Simulação do Banco de Dados das Aulas do Nível 1
  const aulasNivel1 = [
    { id: 0, titulo: 'Introdução à Arena', desc: 'Conheça o método Prime', locked: false },
    { id: 1, titulo: 'Aula 1: Postura', desc: 'A base do cantor', locked: false },
    { id: 2, titulo: 'Aula 2: Respiração', desc: 'Controle do diafragma', locked: false },
    { id: 3, titulo: 'Aula 3: Aquecimento', desc: 'Proteja suas cordas vocais', locked: true },
    { id: 4, titulo: 'Aula 4: Afinação', desc: 'Encontrando o tom', locked: true },
    { id: 5, titulo: 'Aula 5: Extensão Vocal', desc: 'Graves e agudos', locked: true },
    { id: 6, titulo: 'Aula 6: Ressonância', desc: 'Projeção de voz', locked: true },
    { id: 7, titulo: 'Aula 7: Vibrato', desc: 'Oscilação controlada', locked: true },
    { id: 8, titulo: 'Aula 8: Melismas', desc: 'Agilidade vocal', locked: true },
    { id: 9, titulo: 'Aula 9: Dinâmica', desc: 'Emoção na música', locked: true },
    { id: 10, titulo: 'Aula 10: Prática', desc: 'Cantando sua primeira música', locked: true },
  ];

  // Função que decide o que acontece ao clicar em uma aula específica
  const handleLessonClick = (isLocked: boolean) => {
    if (isLocked) {
      navigate('/premium'); // Aula trancada vai pros planos
    } else {
      if (user) {
        // AQUI ESTÁ A MÁGICA: Redireciona para o Player de Vídeo sem o 'alert'
        navigate('/lesson');
      } else {
        // Se NÃO estiver logado, tem que se cadastrar pra assistir o grátis
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-black to-black z-0 pointer-events-none" />
      
      {/* Cabeçalho */}
      <div className="z-10 text-center mb-16 max-w-3xl mx-auto">
        <div className="h-20 w-20 mx-auto rounded-full border-2 border-cyan-400 flex items-center justify-center mb-6 bg-black shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <GraduationCap className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
          VOCAL <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">ACADEMY</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">
          Treinamento Profissional Gamificado
        </p>
      </div>

      {activeModule === 1 ? (
        /* ================= TELA DAS AULAS DO NÍVEL 1 ================= */
        <div className="z-10 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black italic uppercase text-cyan-400">Nível 1</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Respiração e Postura</p>
            </div>
            <Button onClick={() => setActiveModule(null)} variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-full font-black uppercase text-[10px] tracking-widest">
              <ArrowLeft size={14} className="mr-2" /> Voltar
            </Button>
          </div>
          
          <div className="space-y-4">
            {aulasNivel1.map((aula) => (
              <div 
                key={aula.id} 
                onClick={() => handleLessonClick(aula.locked)} 
                className={`p-4 md:p-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all group ${
                  aula.locked 
                    ? 'bg-black/60 border-white/10 hover:border-cyan-400/30 opacity-70 hover:opacity-100' 
                    : 'bg-zinc-950 border-cyan-400/30 hover:bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${aula.locked ? 'bg-white/5 text-gray-500' : 'bg-cyan-400/20 text-cyan-400'}`}>
                    {aula.locked ? <Lock size={16} /> : <Video size={16} />}
                  </div>
                  <div>
                    <h4 className={`text-lg font-black italic uppercase ${aula.locked ? 'text-gray-400 group-hover:text-white' : 'text-white'}`}>{aula.titulo}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">{aula.desc}</p>
                  </div>
                </div>
                <div>
                  {aula.locked ? (
                    <span className="bg-cyan-400 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={10} /> Premium
                    </span>
                  ) : (
                    <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      {user ? 'Assistir' : 'Login p/ Assistir'} <PlayCircle size={14} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ================= TELA DOS MÓDULOS PRINCIPAIS ================= */
        <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {modulos.map((mod) => (
            <Card 
              key={mod.id}
              onClick={() => mod.locked ? navigate('/premium') : setActiveModule(mod.id)}
              className={`relative p-8 rounded-3xl border flex flex-col h-64 transition-all cursor-pointer group ${
                mod.locked 
                  ? 'bg-black/60 border-white/10 opacity-70 hover:opacity-100 hover:border-cyan-400/50' 
                  : 'bg-zinc-950 border-cyan-400/50 hover:bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="absolute top-6 right-6">
                {mod.locked ? (
                  <Lock className="text-gray-500 h-6 w-6 group-hover:text-cyan-400 transition-colors" />
                ) : (
                  <PlayCircle className="text-cyan-400 h-8 w-8 animate-pulse" />
                )}
              </div>

              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black italic mb-auto ${
                mod.locked ? 'bg-white/5 text-gray-500' : 'bg-cyan-400/20 text-cyan-400'
              }`}>
                {mod.id}
              </div>

              <div className="mt-6">
                <h3 className={`text-xl font-black uppercase italic tracking-tighter mb-2 ${
                  mod.locked ? 'text-gray-400 group-hover:text-white' : 'text-white'
                }`}>
                  {mod.titulo}
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {mod.desc}
                </p>
              </div>

              {mod.locked && (
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-cyan-400 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} /> Premium
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Botão Global de Voltar */}
      {!activeModule && (
        <div className="z-10 mt-16 text-center">
          <Button onClick={() => navigate('/')} variant="ghost" className="text-gray-500 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.2em] mx-auto">
            <ArrowLeft size={16} /> Voltar para o Início
          </Button>
        </div>
      )}
    </div>
  );
}