"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, BarChart3, Layers, Disc, Wind, Waves, Timer } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

export interface Exercise {
  id: string;
  title: string;
  icon: React.ElementType;
  prepText?: string;
  actionText?: string;
  command?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prescription: string;
  exercises: Exercise[];
}

export const level6Modules: Module[] = [
  {
    id: 'L6-A',
    title: 'Módulo A: O Despertar do Vibrato',
    description: 'Encontrando a oscilação natural sem forçar a garganta.',
    icon: Waves,
    prescription: 'Foco em Relaxamento Laríngeo',
    exercises: [
      { 
        id: 'l6-a1', 
        title: '1. Sirene de Oscilação', 
        icon: Activity,
        prepText: "Hora de soltar a voz! Cante a vogal 'U'. Brinque de sirene, subindo e descendo o tom levemente nessa vogal para encontrar a oscilação natural da garganta.", 
        actionText: "CANTE 'U' E OSCILE", 
        command: 'OSCILE LEVEMENTE' 
      },
      { 
        id: 'l6-a2', 
        title: '2. Pulsação Diafragmática', 
        icon: Wind,
        prepText: "Sinta a pulsação na barriga! Cante a sílaba 'HA' e faça leves empurrões com o diafragma (como uma risada 'ha-ha-ha' contínua) para gerar o vibrato.", 
        actionText: "PULSE A SÍLABA (HA-HA)", 
        command: 'PULSE A NOTA' 
      }
    ]
  },
  {
    id: 'L6-B',
    title: 'Módulo B: Controle de Velocidade',
    description: 'Dominando o ritmo do vibrato (ondas lentas e rápidas).',
    icon: Zap,
    prescription: 'Foco em Ritmo de Oscilação',
    exercises: [
      { 
        id: 'l6-b1', 
        title: '3. Ondas Lentas (Slow)', 
        icon: Music,
        prepText: "Vamos controlar as ondas! Faça um vibrato de forma bem lenta e exagerada. Controle o movimento de sobe e desce da nota no seu próprio ritmo.", 
        actionText: "VIBRATO LENTO", 
        command: 'VIBRATO LENTO' 
      },
      { 
        id: 'l6-b2', 
        title: '4. Aceleração Gradual', 
        icon: Zap,
        prepText: "Comece devagar e acelere! Inicie a oscilação da nota lentamente e vá aumentando a velocidade das ondas até chegar no seu vibrato natural.", 
        actionText: "ACELERE O VIBRATO", 
        command: 'ACELERE O VIBRATO' 
      }
    ]
  },
  {
    id: 'L6-C',
    title: 'Módulo C: Amplitude e Profundidade',
    description: 'Controlando a largura da afinação durante o vibrato.',
    icon: BarChart3,
    prescription: 'Foco em Extensão de Cents',
    exercises: [
      { 
        id: 'l6-c1', 
        title: '5. Vibrato Estreito (Pop)', 
        icon: Mic2,
        prepText: "Estilo Pop! Faça um vibrato contido e rápido. A oscilação deve ser bem sutil, mal saindo do centro da nota (ideal para músicas modernas).", 
        actionText: "VIBRATO CURTO (POP)", 
        command: 'VIBRATO CURTO (POP)' 
      },
      { 
        id: 'l6-c2', 
        title: '6. Vibrato Largo (Teatro)', 
        icon: Disc,
        prepText: "Estilo Teatro Musical! Solte a voz com um vibrato amplo e profundo. A onda da nota deve ser bem perceptível e majestosa.", 
        actionText: "VIBRATO LARGO (TEATRO)", 
        command: 'VIBRATO LARGO (TEATRO)' 
      }
    ]
  },
  {
    id: 'L6-D',
    title: 'Módulo D: Aplicação Artística',
    description: 'O vibrato terminal. Segure a nota reta e vibre apenas no final.',
    icon: Layers,
    prescription: 'Foco em Transição Estética',
    exercises: [
      { 
        id: 'l6-d1', 
        title: '7. Nota Reta para Vibrato', 
        icon: Activity,
        prepText: "O clássico do R&B e Sertanejo! Sustente a nota totalmente reta (sem tremer) e, só no finalzinho do fôlego, solte o vibrato.", 
        actionText: "RETO PARA VIBRATO", 
        command: 'RETO PARA VIBRATO' 
      },
      { 
        id: 'l6-d2', 
        title: '8. Sustentação Longa com Vibrato', 
        icon: Timer,
        prepText: "O teste de resistência! Sustente uma nota longa aplicando o vibrato do início ao fim, mantendo o controle, a afinação base e o relaxamento.", 
        actionText: "SUSTENTE COM VIBRATO", 
        command: 'SUSTENTE COM VIBRATO' 
      }
    ]
  }
];

const AcademyLevel6Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-22') || publicDomainLibrary[0];
    // Using pitch-calibration as the base engine for vibrato exercises
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level6Modules.map((module) => (
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

export default AcademyLevel6Menu;