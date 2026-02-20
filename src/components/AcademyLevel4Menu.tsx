"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, BarChart3, Layers, Disc, Wind } from 'lucide-react';
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

export const level4Modules: Module[] = [
  {
    id: 'L4-A',
    title: 'Módulo A: Registro de Peito',
    description: 'Fortalecimento da voz falada e ressonância de peito.',
    icon: Activity,
    prescription: 'Foco em Conexão e Peso',
    exercises: [
      { 
        id: 'l4-a1', 
        title: '1. Ressonância Torácica', 
        icon: Activity,
        inhale: 4, hold: 2, exhale: 12, rest: 4, 
        prepText: 'Sinta a vibração no peito. Cante a nota SOL (G3) com a vogal "Ó" bem aberta, focando na profundidade do som.', 
        actionText: 'CANTAR ÓÓÓÓ (PEITO)', 
        command: 'FOCO NO PEITO', 
        isLegato: true 
      },
      { 
        id: 'l4-a2', 
        title: '2. Ataque Glótico Suave', 
        icon: Zap,
        inhale: 4, hold: 0, exhale: 10, rest: 4, 
        prepText: 'Treino de fechamento cordal. Emita sons curtos e firmes em "Á", garantindo que a voz não escape com ar.', 
        actionText: 'ATAQUE: Á - Á - Á', 
        command: 'ATAQUE FIRME', 
        isLegato: false 
      }
    ]
  },
  {
    id: 'L4-B',
    title: 'Módulo B: Registro de Cabeça',
    description: 'Exploração de notas agudas e ressonância craniana.',
    icon: Wind,
    prescription: 'Foco em Leveza e Brilho',
    exercises: [
      { 
        id: 'l4-b1', 
        title: '3. Sirene de Cabeça', 
        icon: Music,
        inhale: 4, hold: 0, exhale: 15, rest: 4, 
        prepText: 'Deslize das notas médias para as agudas em "U". Sinta o som subir para trás do nariz e topo da cabeça.', 
        actionText: 'DESLIZE: UUUUUUUU', 
        command: 'SUBA O TOM',
        isLegato: true 
      },
      { 
        id: 'l4-b2', 
        title: '4. Falsete Sustentado', 
        icon: Disc,
        inhale: 4, hold: 2, exhale: 12, rest: 4, 
        prepText: 'Mantenha uma nota aguda em falsete puro. O objetivo é a estabilidade sem tensão na garganta.', 
        actionText: 'CANTAR UUUU (FALSETE)', 
        command: 'MANTENHA LEVE',
        isLegato: true 
      }
    ]
  },
  {
    id: 'L4-C',
    title: 'Módulo C: Mix & Passaggio',
    description: 'A transição suave entre os registros (Voz Mista).',
    icon: Layers,
    prescription: 'Foco em Transição Invisível',
    exercises: [
      { 
        id: 'l4-c1', 
        title: '5. O "Nhey" de Conexão', 
        icon: Mic2,
        inhale: 4, hold: 0, exhale: 12, rest: 4, 
        prepText: 'Use a fonética "Nhey" para conectar o peito à cabeça. O som deve ser anasalado e "feio" para garantir a conexão.', 
        actionText: 'CANTAR: NHEY NHEY NHEY', 
        command: 'CONECTE OS REGISTROS',
        isLegato: false 
      },
      { 
        id: 'l4-c2', 
        title: '6. Escala de Passaggio', 
        icon: BarChart3,
        inhale: 4, hold: 0, exhale: 16, rest: 4, 
        prepText: 'Suba e desça uma escala de 5 notas atravessando sua quebra vocal. Tente não mudar a intensidade do som.', 
        actionText: 'ESCALA: DÓ-RÉ-MI-FÁ-SOL', 
        command: 'ATRAVESSE A QUEBRA',
        isLegato: true 
      }
    ]
  },
  {
    id: 'L4-D',
    title: 'Módulo D: Dinâmicas de Registro',
    description: 'Controle de volume e intensidade em diferentes alturas.',
    icon: Disc,
    prescription: 'Foco em Controle Dinâmico',
    exercises: [
      { 
        id: 'l4-d1', 
        title: '7. Messa di Voce', 
        icon: Activity,
        inhale: 4, hold: 2, exhale: 20, rest: 5, 
        prepText: 'Comece uma nota bem baixinho (piano), aumente até o máximo (forte) e diminua novamente sem perder a afinação.', 
        actionText: 'CRESCENDO & DIMINUENDO', 
        command: 'CONTROLE O VOLUME',
        isLegato: true 
      }
    ]
  }
];

const AcademyLevel4Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-22') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level4Modules.map((module) => (
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

export default AcademyLevel4Menu;