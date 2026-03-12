import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ListVideo, Lock, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o "1" da URL /lesson/1

  const [activeLesson, setActiveLesson] = useState(0);

  // Dados das aulas conforme imagem (2)
  const lessons = [
    { id: 0, title: "INTRODUÇÃO", sub: "Fundamentos e Respiração", youtube: "m75jPge9QUM", locked: false },
    { id: 1, title: "AULA 1", sub: "Respiração Diafragmática", youtube: "Wl6xUHg9iAQ", locked: false },
    { id: 2, title: "AULA 2", sub: "Controle de Fluxo de Ar", youtube: "fQKI_SFrrOo", locked: false },
    { id: 3, title: "AULA 3", sub: "Sustentação Vocal", locked: true },
    { id: 4, title: "AULA 4", sub: "Aquecimento Labial", locked: true },
  ];

  const current = lessons[activeLesson];

  return (
    <div className="min-h-screen bg-black flex flex-col pt-24 pb-12 px-4 font-sans text-white">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Topo */}
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="mb-8">
           <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-2">
             <Star size={12} fill="currentColor" /> Masterclass • Nível {id}
           </div>
           <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
             {current.title}: <span className="text-orange-500">{current.sub}</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PLAYER AREA */}
          <div className="lg:col-span-2">
            <div className="aspect-video w-full bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
              {!current.locked ? (
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${current.youtube}?rel=0&modestbranding=1`}
                  title="Lesson Player"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <Lock size={48} className="text-gray-600 mb-4" />
                  <p className="font-black uppercase tracking-widest text-sm">Conteúdo Exclusivo Premium</p>
                  <Button onClick={() => navigate('/premium')} className="mt-4 bg-cyan-400 text-black font-black rounded-full px-8">ASSINAR AGORA</Button>
                </div>
              )}
            </div>
          </div>

          {/* PLAYLIST AREA (Igual à imagem 2) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs mb-4">
              <ListVideo size={18} className="text-cyan-400" /> Playlist
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {lessons.map((lesson, index) => (
                <Card 
                  key={index}
                  onClick={() => !lesson.locked && setActiveLesson(index)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    activeLesson === index ? 'bg-orange-500/10 border-orange-500' : 'bg-zinc-950 border-white/5 hover:border-white/20'
                  } ${lesson.locked ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="shrink-0">
                    {lesson.locked ? <Lock size={16} /> : <PlayCircle size={20} className={activeLesson === index ? 'text-orange-500' : 'text-gray-500'} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[8px] font-black uppercase tracking-widest ${activeLesson === index ? 'text-orange-500' : 'text-gray-500'}`}>{lesson.title}</p>
                    <h4 className="text-xs font-black uppercase italic">{lesson.sub}</h4>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}