"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Timer, Music, Zap, PlayCircle, ChevronRight, Activity, BarChart3, Layers, Disc } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

interface Exercise {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prescription: string;
  exercises: Exercise[];
}

const modules: Module[] = [
  {
    id: 'L3-A',
    title: 'Módulo A: Pulso & Divisão',
    description: 'Domine o metrônomo interno e a precisão matemática do tempo.',
    icon: Timer,
    prescription: 'Foco em Precisão de Click',
    exercises: [
      { id: 'human-metronome', title: '1. Metrônomo Humano', icon: Activity },
      { id: 'binary-division', title: '2. Divisão Binária', icon: Layers },
      { id: 'basic-syncopation', title: '3. Síncope Básica', icon: Zap }
    ]
  },
  {
    id: 'L3-B',
    title: 'Módulo B: Phrasing & Ataque',
    description: 'A arte de cantar "atrás" ou "à frente" do tempo com intenção.',
    icon: Music,
    prescription: 'Foco em Intencionalidade',
    exercises: [
      { id: 'intentional-delay', title: '4. Atraso Intencional', icon: Disc },
      { id: 'anticipation', title: '5. Antecipação', icon: Zap },
      { id: 'rhythmic-legato', title: '6. Legato Rítmico', icon: Activity }
    ]
  },
  {
    id: 'L3-C',
    title: 'Módulo C: Groove & Swing',
    description: 'Sinta o balanço e a estabilidade orgânica do BPM.',
    icon: Disc,
    prescription: 'Foco em Micro-timing',
    exercises: [
      { id: 'swing-feel', title: '7. Swing Feel', icon: Music },
      { id: 'micro-timing', title: '8. Micro-timing', icon: BarChart3 },
      { id: 'bpm-stability', title: '9. Estabilidade de BPM', icon: Timer }
    ]
  },
  {
    id: 'L3-D',
    title: 'Módulo D: Performance Rítmica',
    description: 'Sincronia avançada com banda e polirritmia vocal.',
    icon: Layers,
    prescription: 'Foco em Sincronia de Banda',
    exercises: [
      { id: 'band-sync', title: '10. Sync com Banda', icon: Disc },
      { id: 'vocal-poly', title: '11. Polirritmia Vocal', icon: Layers },
      { id: 'click-test', title: '12. Teste de Click Final', icon: Timer }
    ]
  }
];

const AcademyLevel3Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-23') || publicDomainLibrary[0];
    // For Level 3, we use a generic rhythm exercise module
    startAnalysis(exerciseSong, false, 'none', 'none', exercise.title);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {modules.map((module) => (
        <Card key={module.id} className={cn(
          "glass-pillar border-2 transition-all duration-300",
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

export default AcademyLevel3Menu;