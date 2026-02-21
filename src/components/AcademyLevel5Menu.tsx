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
    description: 'Ajuste fino. Zerando o desvio de cents.',
    icon: Target,
    prescription: 'Precisão < 2 Cents',
    exercises: [
      { 
        id: 'l5-a1', 
        title: '1. Ajuste Fino de Sustentação', 
        icon: Activity,
        prepText: "Sustente a nota e olhe para o afinador. Seu objetivo é manter a barra cravada no centro (0 cents) sem oscilar.", 
        actionText: "ACERTE O CENTRO (0 CENTS)", 
        command: 'ESTABILIZE AGORA' 
      },
      { 
        id: 'l5-a2', 
        title: '2. Bending (Deslize de Afinação)', 
        icon: Zap,
        prepText: "Comece a nota ligeiramente abaixo do tom (flat) e deslize suavemente para cima até cravar no centro exato.", 
        actionText: "ACERTE O CENTRO DA NOTA", 
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
        prepText: "Precisão cirúrgica. Cante a nota base e salte para a terça e para a quinta, cravando o tom imediatamente sem 'escorregar' até a nota.", 
        actionText: "CRAVE O SALTO", 
        command: 'ATAQUE O INTERVALO' 
      },
      { 
        id: 'l5-b2', 
        title: '4. Oitavas Precisas', 
        icon: Disc,
        prepText: "O grande salto. Vá da nota grave para a mesma nota uma oitava acima. Mantenha o apoio e acerte o alvo em cheio.", 
        actionText: "CRAVE A OITAVA", 
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
        prepText: "Agilidade vocal. Cante uma sequência rápida de 3 a 5 notas descendentes. Mantenha cada nota clara e definida, sem embolar.", 
        actionText: "MELISMA CURTO (RUNS)", 
        command: 'AGILIDADE AGORA' 
      },
      { 
        id: 'l5-c2', 
        title: '6. Agilidade Pentatônica', 
        icon: BarChart3,
        prepText: "Suba e desça a escala pentatônica rapidamente. O afinador vai testar se o centro tonal da sua voz se mantém estável na agilidade.", 
        actionText: "ESCALA RÁPIDA", 
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
        prepText: "O afinador visual vai sumir! Sustente a nota confiando apenas no seu ouvido interno. Ao final, veja o seu desvio de cents.", 
        actionText: "SUSTENTE ÀS CEGAS", 
        command: 'CONFIE NO OUVIDO' 
      },
      { 
        id: 'l5-d2', 
        title: '8. Afinação sob Dinâmica', 
        icon: Disc,
        prepText: "O volume muda a pressão de ar. Cante a nota baixinho, aumente o volume e diminuia novamente, mantendo a afinação cravada no centro.", 
        actionText: "CRAVE O TOM (DINÂMICA)", 
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