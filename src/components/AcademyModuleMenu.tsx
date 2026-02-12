import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wind, Music, Anchor, UserCheck, PlayCircle, AlertCircle } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prescription: string;
  type: 'farinelli' | 'sovt' | 'panting' | 'alexander';
}

const modules: Module[] = [
  {
    id: 'A',
    title: 'Módulo A: Breathing Gym',
    description: 'Capacidade e Fluxo. Exercícios de expansão pulmonar e controle de saída.',
    icon: Wind,
    prescription: '3 séries de 10 repetições',
    type: 'farinelli'
  },
  {
    id: 'B',
    title: 'Módulo B: Método Arnold Jacobs',
    description: 'Song and Wind. A psicologia do som e a fisiologia do sopro.',
    icon: Music,
    prescription: '15 minutos diários',
    type: 'sovt'
  },
  {
    id: 'C',
    title: 'Módulo C: Appoggio Clássico',
    description: 'Pressão vs. Resistência. O suporte diafragmático italiano.',
    icon: Anchor,
    prescription: '5 repetições lentas',
    type: 'panting'
  },
  {
    id: 'D',
    title: 'Módulo D: Técnica de Alexander',
    description: 'Postural Release. Alinhamento da coluna para ressonância máxima.',
    icon: UserCheck,
    prescription: 'Prática constante',
    type: 'alexander'
  }
];

const AcademyModuleMenu: React.FC<{ level: number }> = ({ level }) => {
  const { startAnalysis, openOverlay } = useVocalSandbox();

  const handleStartModule = (module: Module) => {
    // Safety Warning
    toast.warning("Dica de Segurança", {
      description: "Se sentir tontura, pare imediatamente. O excesso de oxigênio é comum no início.",
      duration: 6000,
      icon: <AlertCircle className="h-5 w-5 text-accent" />
    });

    const exerciseSong = publicDomainLibrary.find(s => s.genre === 'Vocal Exercises') || publicDomainLibrary[0];
    
    // We'll pass the module type to the sandbox to render the specific UI
    startAnalysis(exerciseSong, false);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {modules.map((module) => (
        <Card key={module.id} className="glass-pillar border-2 border-primary/30 hover:border-primary/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <module.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">{module.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{module.description}</p>
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
              <p className="text-xs font-bold text-accent uppercase tracking-wider">Prescrição Diária</p>
              <p className="text-sm text-foreground font-medium">{module.prescription}</p>
            </div>
            <Button 
              onClick={() => handleStartModule(module)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Iniciar Treinamento
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AcademyModuleMenu;