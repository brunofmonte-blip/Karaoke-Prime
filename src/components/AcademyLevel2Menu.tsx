"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Target, Music, EyeOff, PlayCircle, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { useVocalSandbox, CalibrationSubModule } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  subModule: CalibrationSubModule;
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
    id: 'L2-A',
    title: 'Módulo A: Ataque Laser',
    description: 'Audiation e precisão instantânea. Elimine o "scooping" vocal.',
    icon: Target,
    prescription: '10 ataques perfeitos',
    exercises: [
      { id: 'laser-1', title: 'Ataque Laser & Audiation', subModule: 'laser-attack', icon: Zap }
    ]
  },
  {
    id: 'L2-B',
    title: 'Módulo B: Sustentação em Drone',
    description: 'Estabilidade contra referência fixa. Sinta a ressonância pura.',
    icon: Music,
    prescription: '5 minutos de sustentação',
    exercises: [
      { id: 'drone-1', title: 'Sustentação em Drone (C4)', subModule: 'drone-sustain', icon: Music }
    ]
  },
  {
    id: 'L2-C',
    title: 'Módulo C: Blind Tuning',
    description: 'O teste final de memória muscular. Cante sem o afinador.',
    icon: EyeOff,
    prescription: '3 ciclos de 10s ocultos',
    exercises: [
      { id: 'blind-1', title: 'Teste de Blind Tuning', subModule: 'blind-tuning', icon: EyeOff }
    ]
  }
];

const AcademyLevel2Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-21') || publicDomainLibrary[0];
    
    startAnalysis(exerciseSong, false, 'pitch-calibration', exercise.subModule);
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
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Meta de Precisão</p>
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
                      <span className="font-medium">{ex.title}</span>
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

export default AcademyLevel2Menu;