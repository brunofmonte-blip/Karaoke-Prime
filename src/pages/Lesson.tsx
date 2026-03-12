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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const modulos = [
    { id: 1, titulo: 'Respiração e Postura', desc: 'Fundamentos essenciais.', locked: false },
    { id: 2, titulo: 'Afinação Base', desc: 'Exercícios práticos.', locked: true },
    { id: 3, titulo: 'Extensão Vocal', desc: 'Agudos e graves.', locked: true },
    { id: 4, titulo: 'Ressonância', desc: 'Potência de palco.', locked: true },
    { id: 5, titulo: 'Vibrato & Melismas', desc: 'Segredos das divas.', locked: true },
    { id: 6, titulo: 'Masterclass: Belting', desc: 'Técnica avançada.', locked: true },
  ];

  const aulasNivel1 = [
    { id: 0, titulo: 'Introdução à Arena', desc: 'Método Prime', locked: false },
    { id: 1, titulo: 'Aula 1: Postura', desc: 'Base do cantor', locked: false },
    { id: 2, titulo: 'Aula 2: Respiração', desc: 'Diafragma', locked: false },
    { id: 3, titulo: 'Aula 3: Aquecimento', desc: 'Proteção vocal', locked: true },
  ];

  const handleLessonClick = (isLocked: boolean) => {
    if (isLocked) {
      navigate('/premium');
    } else {
      // Se for gratuito, ele VAI para a página de lição (Lesson)
      navigate('/lesson');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-hidden">
      
      {/* CORREÇÃO 1.1: IMAGEM DE FUNDO DA SALA DE MÚSICA */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" 
          alt="Music Room" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
      </div>

      <div className="z-10 text-center mb-16 max-w-3xl mx-auto">
        <div className="h-20 w-20 mx-auto rounded-full border-2 border-cyan-400 flex items-center justify-center mb-6 bg-black">
          <GraduationCap className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase">
          VOCAL <span className="text-cyan-400">ACADEMY</span>
        </h1>
      </div>

      {activeModule === 1 ? (
        <div className="z-10 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <h2 className="text-3xl font-black italic text-cyan-400 uppercase">Nível 1</h2>
            <Button onClick={() => setActiveModule(null)} variant="outline" className="border-cyan-400 text-cyan-400 rounded-full">
              <ArrowLeft size={14} className="mr-2" /> Voltar
            </Button>
          </div>
          
          <div className="space-y-4">
            {aulasNivel1.map((aula) => (
              <div 
                key={aula.id} 
                onClick={() => handleLessonClick(aula.locked)} 
                className={`p-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  aula.locked ? 'bg-black/60 border-white/5 opacity-50' : 'bg-zinc-950 border-cyan-400/30 hover:bg-cyan-400/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${aula.locked ? 'text-gray-500' : 'text-cyan-400 bg-cyan-400/10'}`}>
                    {aula.locked ? <Lock size={16} /> : <Video size={16} />}
                  </div>
                  <h4 className="text-lg font-black italic uppercase">{aula.titulo}</h4>
                </div>
                <Button variant="ghost" className="text-cyan-400">{aula.locked ? 'PREMIUM' : 'ASSISTIR'}</Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {modulos.map((mod) => (
            <Card 
              key={mod.id}
              onClick={() => mod.locked ? navigate('/premium') : setActiveModule(mod.id)}
              className="bg-zinc-950/80 border-white/10 p-8 rounded-[2rem] flex flex-col h-64 relative cursor-pointer hover:border-cyan-400 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-auto">
                {mod.id}
              </div>
              <h3 className="text-xl font-black italic uppercase mt-4">{mod.titulo}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">{mod.desc}</p>
              {mod.locked && <Lock size={20} className="absolute top-8 right-8 text-gray-700" />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}