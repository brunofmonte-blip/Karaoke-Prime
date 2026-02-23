"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, Timer, Target } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

export const level10Modules = [
  {
    id: 'L10-MA',
    title: 'Módulo A: Maratona Vocal',
    description: 'Testando os limites da sustentação e precisão sob fadiga.',
    icon: Timer,
    prescription: 'Foco em Resistência Extrema',
    exercises: [
      { id: 'l10-1', title: '1. Sustentação Extrema', icon: Timer, prepText: "Mantenha a nota cravada pelo máximo de tempo possível.", actionText: "SUSTENTE AO MÁXIMO" },
      { id: 'l10-2', title: '2. Pulo de Oitava Duplo', icon: Zap, prepText: "Execute saltos de duas oitavas com precisão absoluta.", actionText: "SALTO DUPLO" }
    ]
  },
  {
    id: 'L10-MB',
    title: 'Módulo B: Domínio Total',
    description: 'O desafio final para a certificação Pro-Vocal.',
    icon: Target,
    prescription: 'Foco em Maestria Vocal',
    exercises: [
      { id: 'l10-3', title: '3. Afinação Cega Dinâmica', icon: Target, prepText: "Mantenha a afinação sem feedback visual sob variação de volume.", actionText: "DOMÍNIO CEGO" },
      { id: 'l10-4', title: '4. O Desafio Final', icon: Mic2, prepText: "Uma performance completa avaliada pelo motor neural de elite.", actionText: "PERFORMANCE FINAL" }
    ]
  }
];

const AcademyLevel10Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: any) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-22') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level10Modules.map((module) => (
        <Card key={module.id} className={cn(
          "glass-pillar border-2 transition-all duration-300 h-fit",
          expandedModule === module.id ? "border-accent shadow-lg shadow-accent/20" : "border-primary/30 hover:border-primary/70"
        )}>
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                  <module.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{module.title}</CardTitle>
              </div>
              <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", expandedModule === module.id && "rotate-90")} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{module.description}</p>
            {expandedModule === module.id && (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Meta de Treino</p>
                  <p className="text-sm text-foreground font-medium">{module.prescription}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {module.exercises.map((ex) => (
                    <Button key={ex.id} onClick={() => handleStartExercise(ex)} variant="outline" className="justify-between bg-background/50 border-accent/20 hover:border-accent hover:bg-accent/10 rounded-xl h-12">
                      <div className="flex items-center gap-2">
                        <ex.icon className="h-4 w-4 text-accent" />
                        <span className="font-medium">{ex.title}</span>
                      </div>
                      <PlayCircle className="h-5 w-5 text-accent" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AcademyLevel10Menu;