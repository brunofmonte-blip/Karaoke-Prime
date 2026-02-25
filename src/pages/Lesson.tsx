"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Wind, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InstructorAvatar from '@/components/InstructorAvatar';
import { cn } from '@/lib/utils';

export default function Lesson() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 md:p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/academy')} 
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Academy
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Sessão Monitorada por IA
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <InstructorAvatar />
          
          <div className="mt-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              NÍVEL 1: <span className="text-primary neon-blue-glow">BREATHING GYM</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              O segredo da potência vocal não está na garganta, mas no controle do fluxo de ar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            <Card className="glass-pillar border-primary/30">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Wind className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-white">Apoio</h3>
                <p className="text-xs text-gray-400">Ativação do diafragma e expansão costal.</p>
              </CardContent>
            </Card>
            <Card className="glass-pillar border-primary/30">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-white">Fluxo</h3>
                <p className="text-xs text-gray-400">Controle de saída para notas longas.</p>
              </CardContent>
            </Card>
            <Card className="glass-pillar border-primary/30">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-white">Saúde</h3>
                <p className="text-xs text-gray-400">Proteção das pregas vocais via pressão.</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            className="mt-12 px-12 py-8 text-2xl font-black bg-primary hover:bg-primary/90 text-black rounded-full shadow-[0_0_40px_rgba(0,168,225,0.5)] transition-transform hover:scale-105"
          >
            <Play className="mr-3 h-8 w-8 fill-black" /> INICIAR TREINO
          </Button>
        </div>
      </div>
    </div>
  );
}