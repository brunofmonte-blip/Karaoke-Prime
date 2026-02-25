"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, ShieldCheck, Lock, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstructorAvatar from '@/components/InstructorAvatar';
import { cn } from '@/lib/utils';

export default function Lesson() {
  const navigate = useNavigate();

  const modules = [
    { id: 'A', title: 'Fundamentos da Respiração', duration: '05:20', active: true, locked: false },
    { id: 'B', title: 'Controle de Fluxo de Ar', duration: '08:15', active: false, locked: true },
    { id: 'C', title: 'Apoio Diafragmático', duration: '06:30', active: false, locked: true },
    { id: 'D', title: 'Exercício Prático Orientado', duration: '12:00', active: false, locked: true },
  ];

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
          {/* Video Player Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-video rounded-3xl bg-black border-2 border-primary/30 relative overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <InstructorAvatar />
              <Button className="absolute z-10 h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/50">
                <Play className="h-10 w-10 fill-current" />
              </Button>
            </div>
            
            <div className="p-6 rounded-3xl glass-pillar border-2 border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-2">Módulo A: Fundamentos da Respiração</h2>
              <p className="text-gray-400 leading-relaxed">
                Nesta aula, você aprenderá a base de todo grande cantor: a respiração diafragmática. 
                Entenda como expandir sua capacidade pulmonar e criar o suporte necessário para notas longas e potentes.
              </p>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Conteúdo do Nível</h3>
            {modules.map((mod) => (
              <Card key={mod.id} className={cn(
                "border-2 transition-all duration-300",
                mod.active ? "border-primary bg-primary/5" : "border-white/5 bg-white/5",
                mod.locked && "opacity-50"
              )}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-bold",
                      mod.active ? "bg-primary text-black" : "bg-white/10 text-gray-400"
                    )}>
                      {mod.id}
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-sm", mod.active ? "text-white" : "text-gray-400")}>{mod.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                        <Clock className="h-3 w-3" /> {mod.duration}
                      </div>
                    </div>
                  </div>
                  {mod.locked ? <Lock className="h-4 w-4 text-gray-600" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                </CardContent>
              </Card>
            ))}
            
            <Button className="w-full py-8 mt-4 bg-accent hover:bg-accent/90 text-black font-black rounded-2xl shadow-lg shadow-accent/20">
              INICIAR PRÁTICA GUIADA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}