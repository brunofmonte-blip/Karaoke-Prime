import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wind, Music, Anchor, UserCheck, PlayCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useVocalSandbox, ConservatoryModule } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  type: ConservatoryModule;
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
    id: 'A',
    title: 'Módulo A: Breathing Gym',
    description: 'Capacidade e Fluxo. Exercícios de expansão pulmonar e controle de saída.',
    icon: Wind,
    prescription: '3 séries de 10 repetições',
    exercises: [
      { id: 's-explosivo', title: '"S" Explosivo vs. Linear', type: 'farinelli' },
      { id: 'vacuo', title: 'Inalação de Vácuo', type: 'farinelli' },
      { id: 'circular', title: 'Respiração Circular', type: 'farinelli' }
    ]
  },
  {
    id: 'B',
    title: 'Módulo B: SOVT & Resistência',
    description: 'Song and Wind. A psicologia do som e a fisiologia do sopro.',
    icon: Music,
    prescription: '15 minutos diários',
    exercises: [
      { id: 'canudo', title: 'Exercício do Canudo (SOVT)', type: 'sovt' },
      { id: 'lip-trills', title: 'Lip Trills de Resistência', type: 'sovt' },
      { id: 'vacuo-b', title: 'Inalação de Vácuo (Jacobs)', type: 'sovt' }
    ]
  },
  {
    id: 'C',
    title: 'Módulo C: Appoggio Clássico',
    description: 'Pressão vs. Resistência. O suporte diafragmático italiano.',
    icon: Anchor,
    prescription: '5 repetições lentas',
    exercises: [
      { id: 'farinelli', title: 'Exercício de Farinelli', type: 'panting' },
      { id: 'livro', title: 'Técnica do Livro', type: 'panting' },
      { id: 'quadrantes', title: 'Respiração em 4 Quadrantes', type: 'panting' }
    ]
  },
  {
    id: 'D',
    title: 'Módulo D: Técnica de Alexander',
    description: 'Postural Release. Alinhamento da coluna para ressonância máxima.',
    icon: UserCheck,
    prescription: 'Prática constante',
    exercises: [
      { id: 'expansao', title: 'Expansão Costal', type: 'alexander' },
      { id: 'panting', title: 'Panting (Cachorro)', type: 'alexander' },
      { id: 'alexander-pro', title: 'Técnica de Alexander Pro', type: 'alexander' }
    ]
  }
];

const AcademyModuleMenu: React.FC<{ level: number }> = ({ level }) => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    toast.warning("Dica de Segurança", {
      description: "Se sentir tontura, pare imediatamente. O excesso de oxigênio é comum no início.",
      duration: 6000,
      icon: <AlertCircle className="h-5 w-5 text-accent" />
    });

    const exerciseSong = publicDomainLibrary.find(s => s.genre === 'Vocal Exercises') || publicDomainLibrary[0];
    
    startAnalysis(exerciseSong, false, exercise.type);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {modules.map((module) => (
        <Card key={module.id} className={cn(
          "glass-pillar border-2 transition-all duration-300",
          expandedModule === module.id ? "border-primary shadow-lg shadow-primary/20" : "border-primary/30 hover:border-primary/70"
        )}>
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <module.icon className="h-6 w-6 text-primary" />
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
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 mb-4">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider">Prescrição Diária</p>
                  <p className="text-sm text-foreground font-medium">{module.prescription}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {module.exercises.map((ex) => (
                    <Button 
                      key={ex.id}
                      onClick={() => handleStartExercise(ex)}
                      variant="outline"
                      className="justify-between bg-background/50 border-primary/20 hover:border-primary hover:bg-primary/10 rounded-xl h-12"
                    >
                      <span className="font-medium">{ex.title}</span>
                      <PlayCircle className="h-5 w-5 text-primary" />
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

export default AcademyModuleMenu;