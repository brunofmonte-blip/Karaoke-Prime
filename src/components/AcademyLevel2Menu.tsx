"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Target, Music, EyeOff, PlayCircle, ChevronRight, Zap, Activity, Mic2, Headphones, BarChart3 } from 'lucide-react';
import { useVocalSandbox, CalibrationSubModule } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

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
    title: 'Módulo A: Ataque & Audiation',
    description: 'Precisão instantânea e mentalização de frequência.',
    icon: Target,
    prescription: 'Foco em Intonação Pura',
    exercises: [
      { id: 'farinelli-int', title: '1. Farinelli (Intonation)', subModule: 'laser-attack', icon: Activity },
      { id: 'audiation', title: '6. Audiation (Mentalization)', subModule: 'audiation', icon: Zap },
      { id: 'bone-cond', title: '10. Condução Óssea', subModule: 'bone-conduction', icon: Headphones }
    ]
  },
  {
    id: 'L2-B',
    title: 'Módulo B: Biofeedback & Tuning',
    description: 'A ciência do Hertz e correção em tempo real.',
    icon: BarChart3,
    prescription: 'Precisão < 5 Cents',
    exercises: [
      { id: 'biofeedback', title: '2. Biofeedback (Hertz/Cents)', subModule: 'biofeedback', icon: BarChart3 },
      { id: 'sovt-pitch', title: '5. SOVT (Straw/Lip Trills)', subModule: 'sovt-pitch', icon: Activity },
      { id: 'autotune', title: '7. Auto-Tune Real-Time', subModule: 'autotune-realtime', icon: Mic2 }
    ]
  },
  {
    id: 'L2-C',
    title: 'Módulo C: Ressonância & Teoria',
    description: 'Modificação de vogais e solfejo clássico.',
    icon: Music,
    prescription: 'Pureza de Vogais',
    exercises: [
      { id: 'vowel-mod', title: '3. Vowel Modification', subModule: 'vowel-mod', icon: Mic2 },
      { id: 'solfege', title: '9. Solfège (Do-Re-Mi)', subModule: 'solfege', icon: Music }
    ]
  },
  {
    id: 'L2-D',
    title: 'Módulo D: Estúdio & Performance',
    description: 'Estabilidade contra drone e análise de estúdio.',
    icon: Activity,
    prescription: 'Estabilidade Absoluta',
    exercises: [
      { id: 'drone-pedal', title: '4. Drone (Nota Pedal)', subModule: 'drone-sustain', icon: Music },
      { id: 'melodyne', title: '8. Melodyne Analysis', subModule: 'melodyne-analysis', icon: BarChart3 }
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {modules.map((module) => (
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

export default AcademyLevel2Menu;