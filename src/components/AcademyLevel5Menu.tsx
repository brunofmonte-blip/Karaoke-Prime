"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Target, Music, Zap, PlayCircle, ChevronRight, Activity, BarChart3, Layers, Disc, Timer } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

export interface Exercise {
  id: string;
  title: string;
  icon: React.ElementType;
  prepText?: string;
  actionText?: string;
  exhale?: number;
  inhale?: number;
  hold?: number;
  rest?: number;
  command?: string;
  isLegato?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prescription: string;
  exercises: Exercise[];
}

export const level5Modules: Module[] = [
  {
    id: 'L5-A',
    title: 'Módulo A: Micro-Afinação',
    description: 'Ajuste fino. Zerando o desvio de centavos (cents).',
    icon: Target,
    prescription: 'Precisão < 2 Cents',
    exercises: [
      { 
        id: 'l5-a1', 
        title: '1. Ajuste Fino de Sustentação', 
        icon: Activity,
        prepText: "Mantenha a nota alvo com o mínimo de oscilação possível. O objetivo é manter o ponteiro do afinador exatamente no centro por 10 segundos.", 
        actionText: "SUSTENTAÇÃO LASER", 
        command: 'ESTABILIZE AGORA' 
      },
      { 
        id: 'l5-a2', 
        title: '2. Bending (Deslize de Afinação)', 
        icon: Zap,
        prepText: "Inicie a nota meio tom abaixo e deslize suavemente para cima até atingir a nota alvo, focando na precisão do ponto de chegada.", 
        actionText: "DESLIZE PARA O ALVO", 
        command: 'DESLIZE E CRAVE' 
      }
    ]
  },
  {
    id: 'L5-B',
    title: 'Módulo B: Saltos Interválicos',
    description: 'Acertando notas distantes com precisão de atirador de elite.',
    icon: Layers,
    prescription: 'Foco em Ataque de Intervalo',
    exercises: [
      { 
        id: 'l5-b1', 
        title: '3. Saltos de Terça e Quinta', 
        icon: Music,
        prepText: "Alterne entre a tônica e a terça/quinta. O ataque da nota superior deve ser limpo, sem 'escorregar' para a nota.", 
        actionText: "SALTO INTERVÁLICO", 
        command: 'ATAQUE O INTERVALO' 
      },
      { 
        id: 'l5-b2', 
        title: '4. Oitavas Precisas', 
        icon: Disc,
        prepText: "Salte uma oitava completa. Mantenha a mesma pressão de ar para garantir que a nota aguda não soe gritada ou fraca.", 
        actionText: "SALTO DE OITAVA", 
        command: 'CRAVE A OITAVA' 
      }
    ]
  },
  {
    id: 'L5-C',
    title: 'Módulo C: Agilidade e Melisma',
    description: 'Movimentação rápida entre notas sem perder o centro tonal.',
    icon: Zap,
    prescription: 'Foco em Definição de Notas',
    exercises: [
      { 
        id: 'l5-c1', 
        title: '5. Corridas Curtas (Runs)', 
        icon: Activity,
        prepText: "Execute uma sequência rápida de 3 a 5 notas. Cada nota deve ser distinta e afinada, sem soar como um borrão sonoro.", 
        actionText: "CORRIDA RÁPIDA", 
        command: 'AGILIDADE AGORA' 
      },
      { 
        id: 'l5-c2', 
        title: '6. Agilidade Pentatônica', 
        icon: BarChart3,
        prepText: "Navegue pela escala pentatônica em velocidade moderada. Foque na clareza de cada degrau da escala.", 
        actionText: "FLUXO PENTATÔNICO", 
        command: 'MANTENHA A CLAREZA' 
      }
    ]
  },
  {
    id: 'L5-D',
    title: 'Módulo D: Estabilidade Extrema',
    description: 'Mantendo a afinação sob pressão e mudanças de volume.',
    icon: Timer,
    prescription: 'Foco em Resistência Tonal',
    exercises: [
      { 
        id: 'l5-d1', 
        title: '7. Teste de Afinação Cega', 
        icon: Target,
        prepText: "O afinador visual desaparecerá por alguns segundos. Confie no seu ouvido interno para manter a nota estável.", 
        actionText: "AFINAÇÃO CEGA", 
        command: 'CONFIE NO OUVIDO' 
      },
      { 
        id: 'l5-d2', 
        title: '8. Afinação sob Dinâmica', 
        icon: Disc,
        prepText: "Altere o volume de suave para forte enquanto mantém a mesma nota. Não deixe o aumento de pressão subir a afinação.", 
        actionText: "DINÂMICA ESTÁVEL", 
        command: 'VOLUME VS TOM' 
      }
    ]
  }
];

const AcademyLevel5Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-21') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level5Modules.map((module) => (
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
                    <Button 
                      key={ex.id}
                      onClick={() => handleStartExercise(ex)}
                      variant="outline"
                      className="justify-between bg-background/50 border-accent/20 hover:border-accent hover:bg-accent/10 rounded-xl h-12"
                    >
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

export default AcademyLevel5Menu;