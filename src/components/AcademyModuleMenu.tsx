import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wind, Music, Anchor, UserCheck, PlayCircle, AlertCircle, ChevronRight, Lock } from 'lucide-react';
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
      { id: 'vacuo', title: 'Inalação de Vácuo', type: 'farinelli' }
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
      { id: 'lip-trills', title: 'Lip Trills de Resistência', type: 'sovt' }
    ]
  },
  {
    id: 'C',
    title: 'Módulo C: Appoggio Clássico',
    description: 'Pressão vs. Resistência. O suporte diafragmático italiano.',
    icon: Anchor,
    prescription: '5 repetições lentas',
    exercises: [
      { id: 'farinelli', title: 'Exercício de Farinelli', type: 'panting' }
    ]
  },
  {
    id: 'D',
    title: 'Módulo D: Técnica de Alexander',
    description: 'Postural Release. Alinhamento da coluna para ressonância máxima.',
    icon: UserCheck,
    prescription: 'Prática constante',
    exercises: [
      { id: 'expansao', title: 'Expansão Costal', type: 'alexander' }
    ]
  }
];

const AcademyModuleMenu: React.FC<{ level: number }> = ({ level }) => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: Exercise, isLocked: boolean) => {
    if (isLocked) {
      toast.error("Módulo Bloqueado", {
        description: "Complete os módulos anteriores para liberar este treino."
      });
      return;
    }

    toast.warning("Dica de Segurança", {
      description: "Se sentir tontura, pare imediatamente. O excesso de oxigênio é comum no início.",
      duration: 6000,
      icon: <AlertCircle className="h-5 w-5 text-accent" />
    });

    const exerciseSong = publicDomainLibrary.find(s => s.genre === 'Vocal Exercises') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, exercise.type, 'none', exercise.title);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {modules.map((module, index) => {
        // LÓGICA ESTRITA: Apenas os 2 primeiros módulos (A e B) estão liberados
        const isModuleLocked = index > 1;

        return (
          <Card key={module.id} className={cn(
            "glass-pillar border-2 transition-all duration-300 h-fit rounded-2xl overflow-hidden",
            isModuleLocked ? "opacity-50 grayscale border-white/5" : 
            expandedModule === module.id ? "border-primary shadow-lg shadow-primary/20" : "border-primary/20 hover:border-primary/50"
          )}>
            <CardHeader 
              className={cn("pb-4 cursor-pointer", isModuleLocked ? "cursor-not-allowed" : "")} 
              onClick={() => !isModuleLocked && setExpandedModule(expandedModule === module.id ? null : module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl border-2",
                    isModuleLocked ? "border-white/10 bg-white/5" : "bg-primary/10 border-primary/30"
                  )}>
                    <module.icon className={cn("h-6 w-6", isModuleLocked ? "text-gray-600" : "text-primary")} />
                  </div>
                  <CardTitle className={cn("text-xl font-black italic uppercase tracking-tighter", isModuleLocked ? "text-gray-600" : "text-white")}>
                    {module.title}
                  </CardTitle>
                </div>
                {isModuleLocked ? (
                  <Lock className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronRight className={cn("h-5 w-5 text-primary transition-transform", expandedModule === module.id && "rotate-90")} />
                )}
              </div>
            </CardHeader>
            
            {!isModuleLocked && expandedModule === module.id && (
              <CardContent className="space-y-6 pb-8 animate-in fade-in zoom-in-95 duration-300">
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{module.description}</p>
                
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30">
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em] mb-1">Prescrição Diária</p>
                  <p className="text-sm text-white font-bold italic">{module.prescription}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {module.exercises.map((ex) => (
                    <Button 
                      key={ex.id}
                      onClick={() => handleStartExercise(ex, false)}
                      variant="outline"
                      className="justify-between bg-black/40 border-primary/20 hover:border-primary hover:bg-primary/10 rounded-xl h-14 px-6 group"
                    >
                      <span className="font-bold text-sm uppercase tracking-widest">{ex.title}</span>
                      <PlayCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AcademyModuleMenu;