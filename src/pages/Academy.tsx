import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Lock, PlayCircle, CheckCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dados das aulas do Nível 1
const aulasNivel1 = [
  { id: 0, title: "Introdução ao Canto", duration: "05:00", locked: false },
  { id: 1, title: "Aula 1: Postura Corporal", duration: "12:00", locked: false },
  { id: 2, title: "Aula 2: Respiração Diafragmática", duration: "15:00", locked: false },
  { id: 3, title: "Aula 3: Apoio e Sustentação", duration: "10:00", locked: true },
  { id: 4, title: "Aula 4: Aquecimento Vocal", duration: "08:00", locked: true },
];

export default function Academy() {
  const navigate = useNavigate();
  const [selectedNivel, setSelectedNivel] = useState(1);

  const handleLessonClick = (aula: any) => {
    // Se a aula não estiver trancada (Nível 1 - Introd, Aula 1 e 2)
    if (!aula.locked) {
      // Navega diretamente para a aula (ajuste a rota se necessário, ex: /lesson/id)
      navigate(`/lesson`); 
    } else {
      // Se estiver trancada, envia para os planos
      navigate('/premium');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* 1.1 - Background: Sala de Aula de Música */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" 
          alt="Music Classroom" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      </div>

      <div className="relative z-10 pt-20 pb-10 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              NEXT <span className="text-cyan-400">ACADEMY</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sua jornada do zero ao palco</p>
          </div>
        </div>

        {/* Grade de Níveis (1 a 10) */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-10">
          {[...Array(10)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setSelectedNivel(i + 1)}
              className={`h-12 rounded-lg font-black transition-all ${
                selectedNivel === i + 1 
                ? 'bg-cyan-400 text-black scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
              } ${i + 1 > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={i + 1 > 1}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Conteúdo do Nível Selecionado */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                <GraduationCap size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic">Nível {selectedNivel}: O Despertar</h2>
                <p className="text-cyan-400/70 text-sm font-bold uppercase">Módulo 1: Respiração e Postura</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-gray-500 uppercase">Progresso</span>
              <span className="text-xl font-black text-white">30%</span>
            </div>
          </div>

          {/* Lista de Aulas */}
          <div className="space-y-3">
            {aulasNivel1.map((aula) => (
              <div 
                key={aula.id}
                onClick={() => handleLessonClick(aula)}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  aula.locked 
                  ? 'bg-white/2 border-white/5 opacity-60 hover:border-white/20' 
                  : 'bg-white/5 border-white/10 hover:bg-cyan-400/10 hover:border-cyan-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    aula.locked ? 'bg-gray-800 text-gray-500' : 'bg-cyan-400 text-black'
                  }`}>
                    {aula.locked ? <Lock size={18} /> : <PlayCircle size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-tight">{aula.title}</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{aula.duration}</span>
                  </div>
                </div>
                
                {!aula.locked && (
                  <Button variant="ghost" className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                    ASSISTIR
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}