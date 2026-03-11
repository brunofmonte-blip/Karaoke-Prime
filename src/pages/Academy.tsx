import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, Star, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Academy() {
  const navigate = useNavigate();

  // Array de Módulos (Simulando o banco de dados)
  // O Módulo 1 está liberado. Do 2 ao 6 estão bloqueados.
  const modulos = [
    { id: 1, titulo: 'Respiração e Postura', desc: 'Fundamentos essenciais para não cansar a voz.', locked: false },
    { id: 2, titulo: 'Afinação Base', desc: 'Exercícios práticos para cravar as notas.', locked: true },
    { id: 3, titulo: 'Extensão Vocal', desc: 'Aprenda a alcançar agudos e graves sem esforço.', locked: true },
    { id: 4, titulo: 'Ressonância', desc: 'Projete a sua voz com potência de palco.', locked: true },
    { id: 5, titulo: 'Vibrato & Melismas', desc: 'Os segredos das grandes divas do R&B.', locked: true },
    { id: 6, titulo: 'Masterclass: Belting', desc: 'Técnica avançada de agudos de peito.', locked: true },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-black to-black z-0 pointer-events-none" />
      
      {/* Cabeçalho da Academy */}
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

      {/* Grid de Módulos */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {modulos.map((mod) => (
          <Card 
            key={mod.id}
            // A MÁGICA ACONTECE AQUI:
            // Se estiver bloqueado (locked), vai para '/premium'. Se não, não faz nada (ou iria para a aula)
            onClick={() => mod.locked ? navigate('/premium') : null}
            className={`relative p-8 rounded-3xl border flex flex-col h-64 transition-all cursor-pointer group ${
              mod.locked 
                ? 'bg-black/60 border-white/10 opacity-70 hover:opacity-100 hover:border-cyan-400/50' 
                : 'bg-zinc-950 border-cyan-400/50 hover:bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
            }`}
          >
            {/* Ícone de Status no Canto Direito */}
            <div className="absolute top-6 right-6">
              {mod.locked ? (
                <Lock className="text-gray-500 h-6 w-6 group-hover:text-cyan-400 transition-colors" />
              ) : (
                <PlayCircle className="text-cyan-400 h-8 w-8 animate-pulse" />
              )}
            </div>

            {/* Ícone Numérico do Módulo */}
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black italic mb-auto ${
              mod.locked ? 'bg-white/5 text-gray-500' : 'bg-cyan-400/20 text-cyan-400'
            }`}>
              {mod.id}
            </div>

            {/* Textos do Card */}
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

            {/* Tag de "Requer Premium" (Aparece ao passar o mouse se for bloqueado) */}
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

      {/* Botão de Voltar */}
      <div className="z-10 mt-16 text-center">
        <Button onClick={() => navigate('/')} variant="ghost" className="text-gray-500 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.2em] mx-auto">
          <ArrowLeft size={16} /> Voltar para o Início
        </Button>
      </div>
    </div>
  );
}