"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, ShieldCheck, Lock, CheckCircle2, Clock, Mic, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstructorAvatar from '@/components/InstructorAvatar';
import { cn } from '@/lib/utils';

export default function Lesson() {
  const navigate = useNavigate();

  // Interactive Playlist State
  const curriculumData = [
    { 
      id: '1', 
      type: 'video', 
      title: 'A Base: Respiração Diafragmática', 
      duration: '05:20', 
      locked: false, 
      desc: 'Aprenda a ativar o diafragma para sustentar notas longas sem cansar as pregas vocais e evitar falhas na afinação.', 
      objectives: ['Inspirar expandindo o abdômen, sem levantar os ombros.', 'Controlar a saída de ar de forma constante.'] 
    },
    { 
      id: '2', 
      type: 'video', 
      title: 'Controle de Fluxo de Ar', 
      duration: '08:15', 
      locked: false, 
      desc: 'Entenda como a pressão do ar afeta diretamente o volume e a estabilidade da sua voz.', 
      objectives: ['Manter a pressão subglótica estável.', 'Evitar o vazamento excessivo de ar (voz soprosa).'] 
    },
    { 
      id: '3', 
      type: 'mic', 
      title: 'Prática: Sustentação de 5 Segundos', 
      duration: '03:00', 
      locked: true, 
      desc: 'Vamos ao palco. Aplique a técnica de respiração cantando uma nota contínua.', 
      objectives: ['Sustentar a nota no tom correto.', 'Não perder o fôlego antes do tempo.'] 
    },
    { 
      id: '4', 
      type: 'video', 
      title: 'Aquecimento Labial (Trill)', 
      duration: '04:10', 
      locked: true, 
      desc: 'O exercício número 1 dos cantores profissionais para aquecer a voz sem atrito.', 
      objectives: ['Relaxar a musculatura facial.', 'Conectar a respiração com as pregas vocais.'] 
    },
    { 
      id: '5', 
      type: 'mic', 
      title: 'Prática: Sirene Vocal', 
      duration: '05:00', 
      locked: true, 
      desc: 'Deslize dos graves aos agudos usando o Trill labial para encontrar sua extensão.', 
      objectives: ['Passar pelas pontes vocais sem quebrar a voz.', 'Manter o fluxo de ar constante.'] 
    },
  ];

  const [activeLesson, setActiveLesson] = useState(curriculumData[0]);

  const handleLessonSelect = (lesson: typeof curriculumData[0]) => {
    if (lesson.locked) {
      navigate('/premium');
    } else {
      setActiveLesson(lesson);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/academy')} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Academy
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Nível 1: Breathing Gym
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-video rounded-3xl bg-black border-2 border-primary/30 relative overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <InstructorAvatar />
              <Button className="absolute z-10 h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/50">
                {activeLesson.type === 'video' ? <Play className="h-10 w-10 fill-current" /> : <Mic className="h-10 w-10" />}
              </Button>
            </div>
            
            <div className="p-8 rounded-3xl glass-pillar border-2 border-primary/20 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{activeLesson.title}</h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {activeLesson.desc}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" /> Objetivos da Aula
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Conteúdo do Nível</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {curriculumData.map((mod) => (
                <Card 
                  key={mod.id} 
                  onClick={() => handleLessonSelect(mod)}
                  className={cn(
                    "border-2 transition-all duration-300 cursor-pointer",
                    activeLesson.id === mod.id ? "border-primary bg-primary/5" : "border-white/5 bg-white/5 hover:border-white/20",
                    mod.locked && "opacity-60"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center font-bold",
                        activeLesson.id === mod.id ? "bg-primary text-black" : "bg-white/10 text-gray-400"
                      )}>
                        {mod.type === 'video' ? <Play className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className={cn("font-bold text-sm", activeLesson.id === mod.id ? "text-white" : "text-gray-400")}>{mod.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                          <Clock className="h-3 w-3" /> {mod.duration}
                        </div>
                      </div>
                    </div>
                    {mod.locked ? <Lock className="h-4 w-4 text-gray-600" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button className="w-full py-8 mt-4 bg-accent hover:bg-accent/90 text-black font-black rounded-2xl shadow-lg shadow-accent/20">
              INICIAR PRÁTICA GUIADA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}