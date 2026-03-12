import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Academy() {
  const navigate = useNavigate();

  // Módulos da Academy conforme sua imagem (1)
  const modulos = [
    { id: 1, titulo: 'RESPIRAÇÃO E APOIO', desc: 'Exercícios de diafragma, controle de fluxo de ar.', time: '10 min', locked: false },
    { id: 2, titulo: 'AFINAÇÃO PRECISA', desc: 'Treinamento de ouvido e intervalos.', time: '12 min', locked: true },
    { id: 3, titulo: 'RESSONÂNCIA', desc: 'Melhora da qualidade tonal e clareza.', time: '15 min', locked: true },
    { id: 4, titulo: 'INTERPRETAÇÃO VOCAL', desc: 'Expressão e emoção ao cantar.', time: '20 min', locked: true },
    { id: 5, titulo: 'FALSETES E MELISMAS', desc: 'Técnicas avançadas de R&B e POP.', time: '25 min', locked: true },
    { id: 6, titulo: 'VIBRATO MASTER', desc: 'Oscilação perfeita e controle.', time: '20 min', locked: true },
    { id: 7, titulo: 'DRIVES E RASPS', desc: 'Distorção vocal com segurança.', time: '25 min', locked: true },
    { id: 8, titulo: 'AGUDOS (BELTING)', desc: 'Potência sem machucar a garganta.', time: '30 min', locked: true },
    { id: 9, titulo: 'DINÂMICA E MICROFONE', desc: 'Uso correto do equipamento de palco.', time: '20 min', locked: true },
    { id: 10, titulo: 'SHOW COMPLETO', desc: 'A prova final. Rotina de 40 minutos.', time: '40 min', locked: true },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 pt-24 pb-20 font-sans text-white relative overflow-x-hidden">
      
      {/* BACKGROUND: Imagem clareada (opacity-40 ao invés de 20 para dar 20% a mais de luz) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80" 
          alt="Studio Background" 
          className="w-full h-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
      </div>

      <div className="z-10 max-w-7xl mx-auto w-full">
        {/* Topo: Botão Voltar */}
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors">
          <ArrowLeft size={16} /> Voltar para o Palco
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
             <GraduationCap size={14} /> Centro de Treinamento
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
            ACADEMY <span className="text-cyan-400">PRIME</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Aprenda as técnicas dos maiores vocalistas do mundo.</p>
        </div>

        {/* Grid de Níveis (Igual à imagem 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulos.map((mod) => (
            <Card 
              key={mod.id}
              className={`relative p-8 rounded-[2rem] border transition-all flex flex-col items-center text-center h-full ${
                mod.locked 
                ? 'bg-zinc-950/40 border-white/5 opacity-50' 
                : 'bg-zinc-950/80 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                {mod.locked ? <Lock size={20} className="text-gray-600" /> : <PlayCircle size={24} className="text-white" />}
              </div>

              <h3 className="font-black text-white text-sm uppercase italic tracking-widest mb-2">{mod.titulo}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mb-6 flex-1">
                {mod.desc}
              </p>

              <div className="flex gap-4 mb-8">
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 font-black uppercase">Dificuldade</p>
                  <p className="text-xs font-black text-white italic">Lvl {mod.id}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 font-black uppercase">Duração</p>
                  <p className="text-xs font-black text-white italic">{mod.time}</p>
                </div>
              </div>

              {!mod.locked ? (
                <Button 
                  onClick={() => navigate('/lesson/1')} 
                  className="w-full rounded-full bg-white text-black font-black uppercase tracking-tighter text-[10px] h-10 hover:bg-cyan-400 transition-all"
                >
                  Iniciar Exercício
                </Button>
              ) : (
                <Button disabled className="w-full rounded-full bg-white/5 text-gray-600 font-black uppercase tracking-tighter text-[10px] h-10 border border-white/5">
                  Assinar para Desbloquear
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}