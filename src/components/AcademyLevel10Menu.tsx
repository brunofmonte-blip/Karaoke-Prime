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
      { 
        id: 'l10-1', 
        title: '1. Sustentação Extrema', 
        icon: Timer, 
        prepText: "Teste de ferro! Sustente a nota com a vogal 'A' o máximo de tempo que seus pulmões aguentarem, mantendo o afinador cravado no verde.", 
        actionText: "SUSTENTAÇÃO MÁXIMA ('A')" 
      },
      { 
        id: 'l10-2', 
        title: '2. Pulo de Oitava Duplo', 
        icon: Zap, 
        prepText: "Saltos gigantes! Pule da sua nota mais grave direto para a mais aguda e volte, usando 'I'. Exige controle total de ar.", 
        actionText: "SALTO EXTREMO ('I')" 
      }
    ]
  },
  {
    id: 'L10-MB',
    title: 'Módulo B: Domínio Total',
    description: 'O desafio final para a certificação Pro-Vocal.',
    icon: Target,
    prescription: 'Foco em Maestria Vocal',
    exercises: [
      { 
        id: 'l10-3', 
        title: '3. Afinação Cega Dinâmica', 
        icon: Target, 
        prepText: "O afinador vai sumir e o volume vai mudar! Cante 'O', alterne entre som forte e fraco confiando apenas no seu ouvido interno.", 
        actionText: "AFINAÇÃO CEGA ('O')" 
      },
      { 
        id: 'l10-4', 
        title: '4. Pulo Cego', 
        icon: Zap, 
        prepText: "Sem ajuda visual! Pule para notas distantes usando 'U' guiado apenas pela memória muscular da sua garganta.", 
        actionText: "SALTO CEGO ('U')" 
      }
    ]
  },
  {
    id: 'L10-MC',
    title: 'Módulo C: Dinâmica Extrema',
    description: 'Controle absoluto de volume.',
    icon: Disc,
    prescription: 'Foco em Controle de Volume',
    exercises: [
      { 
        id: 'l10-5', 
        title: '5. Sussurro ao Grito', 
        icon: Disc, 
        prepText: "Comece cantando quase sussurrando e vá aumentando o volume sem parar até chegar a um grito potente e afinado usando 'YEAH'.", 
        actionText: "SUSSURRO PARA GRITO" 
      },
      { 
        id: 'l10-6', 
        title: '6. Crescendo Triplo', 
        icon: Activity, 
        prepText: "Cante três notas seguidas, subindo o volume (crescendo) em cada uma delas usando 'HA', sem perder o fôlego.", 
        actionText: "CRESCENDO TRIPLO ('HA')" 
      }
    ]
  },
  {
    id: 'L10-MD',
    title: 'Módulo D: Precisão Sob Pressão',
    description: 'Afinação com fadiga.',
    icon: Layers,
    prescription: 'Foco em Precisão com Fadiga',
    exercises: [
      { 
        id: 'l10-7', 
        title: '7. Salto de 2 Oitavas', 
        icon: Layers, 
        prepText: "O salto mais longo! Pule duas oitavas inteiras com 'WU'. É como ir do porão ao sótão em uma fração de segundo.", 
        actionText: "PULO DE 2 OITAVAS ('WU')" 
      },
      { 
        id: 'l10-8', 
        title: '8. Acerto na Mosca', 
        icon: Target, 
        prepText: "Ataque notas rápidas sem 'escorregar' a voz para chegar nelas. Exige precisão de atirador de elite usando a sílaba 'DA'.", 
        actionText: "ACERTO NA MOSCA ('DA')" 
      }
    ]
  },
  {
    id: 'L10-ME',
    title: 'Módulo E: A Certificação',
    description: 'A prova final do Vocal Coach.',
    icon: Mic2,
    prescription: 'Foco em Performance Mestre',
    exercises: [
      { 
        id: 'l10-9', 
        title: '9. Medley de Técnicas', 
        icon: Music, 
        prepText: "O aquecimento final. Misture vibrato, pulos rápidos e dinâmica em uma única respiração usando a vogal 'E'.", 
        actionText: "MEDLEY VOCAL ('E')" 
      },
      { 
        id: 'l10-10', 
        title: '10. O Desafio Final (Boss)', 
        icon: Mic2, 
        prepText: "A Prova do Vocal Coach! Aplique tudo o que aprendeu em uma nota longa que exige potência e termina com vibrato. Cante 'A' e mostre ao que veio!", 
        actionText: "O DESAFIO FINAL ('A')" 
      }
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