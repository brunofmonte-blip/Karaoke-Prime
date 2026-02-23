"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, Timer, Target, Disc, Layers } from 'lucide-react';
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
      { id: 'l10-4', title: '4. Pulo Cego', icon: Zap, prepText: "Execute um salto de nota sem auxílio visual do afinador.", actionText: "PULO CEGO" }
    ]
  },
  {
    id: 'L10-MC',
    title: 'Módulo C: Dinâmica Extrema',
    description: 'Controle absoluto de volume.',
    icon: Disc,
    prescription: 'Foco em Controle de Volume',
    exercises: [
      { id: 'l10-5', title: '5. Sussurro ao Grito', icon: Disc, prepText: "Varie do sussurro ao volume máximo mantendo a afinação.", actionText: "VARIAÇÃO EXTREMA" },
      { id: 'l10-6', title: '6. Crescendo Triplo', icon: Activity, prepText: "Execute três crescendos sucessivos com controle total.", actionText: "CRESCENDO TRIPLO" }
    ]
  },
  {
    id: 'L10-MD',
    title: 'Módulo D: Precisão Sob Pressão',
    description: 'Afinação com fadiga.',
    icon: Layers,
    prescription: 'Foco em Precisão com Fadiga',
    exercises: [
      { id: 'l10-7', title: '7. Salto de 2 Oitavas', icon: Layers, prepText: "Execute um salto de duas oitavas com precisão cirúrgica.", actionText: "SALTO DE 2 OITAVAS" },
      { id: 'l10-8', title: '8. Acerto na Mosca', icon: Target, prepText: "Acerte notas aleatórias de primeira com precisão de cents.", actionText: "ACERTO NA MOSCA" }
    ]
  },
  {
    id: 'L10-ME',
    title: 'Módulo E: A Certificação',
    description: 'A prova final do Vocal Coach.',
    icon: Mic2,
    prescription: 'Foco em Performance Mestre',
    exercises: [
      { id: 'l10-9', title: '9. Medley de Técnicas', icon: Music, prepText: "Execute um medley combinando vibrato, belting e agilidade.", actionText: "MEDLEY TÉCNICO" },
      { id: 'l10-10', title: '10. O Desafio Final (Boss)', icon: Mic2, prepText: "A prova final: performance completa avaliada pela AI de elite.", actionText: "DESAFIO FINAL" }
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