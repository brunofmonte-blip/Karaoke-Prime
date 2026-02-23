"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, Layers, Wind, Disc } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

export const level7Modules = [
  {
    id: 'L7-MA',
    title: 'Módulo A: Identificando a Quebra',
    description: 'Mapeando a zona de transição entre os registros.',
    icon: Activity,
    prescription: 'Foco em Consciência de Registro',
    exercises: [
      { 
        id: 'l7-1', 
        title: '1. Sirene de Quebra', 
        icon: Activity, 
        prepText: "Faça uma sirene do grave ao agudo com a vogal 'U'. Note onde sua voz dá aquela 'falhada' natural (a quebra).", 
        actionText: "SIRENE DE QUEBRA ('U')" 
      },
      { 
        id: 'l7-2', 
        title: '2. Salto de Registro', 
        icon: Zap, 
        prepText: "Cante a nota grave e pule para a aguda usando 'I'. Deixe a voz mudar para a cabeça (falsete) propositalmente.", 
        actionText: "SALTO DE REGISTRO ('I')" 
      }
    ]
  },
  {
    id: 'L7-MB',
    title: 'Módulo B: Suavização',
    description: 'Conectando os registros para uma voz única e fluida.',
    icon: Layers,
    prescription: 'Foco em Mix Voice',
    exercises: [
      { 
        id: 'l7-3', 
        title: '3. Conexão em Vogais', 
        icon: Music, 
        prepText: "Vamos conectar! Deslize suavemente do grave ao agudo com a sílaba 'MUM', mantendo o volume baixo para a voz não quebrar.", 
        actionText: "CONEXÃO SUAVE ('MUM')" 
      },
      { 
        id: 'l7-4', 
        title: '4. Mix Voice Inicial', 
        icon: Mic2, 
        prepText: "O início da voz mista! Use a sílaba 'NAY' (com som de choro) para subir na escala mantendo a voz firme e sem falhar.", 
        actionText: "VOZ MISTA ('NAY')" 
      }
    ]
  },
  {
    id: 'L7-MC',
    title: 'Módulo C: Domínio da Voz de Cabeça',
    description: 'Fortalecendo os agudos isolados.',
    icon: Wind,
    prescription: 'Foco em Agudos Isolados',
    exercises: [
      { 
        id: 'l7-5', 
        title: '5. Falsete vs Cabeça', 
        icon: Wind, 
        prepText: "Voz de cabeça leve. Cante a sílaba 'WU' soltando bastante ar, como se fosse o vento, cravando a nota aguda.", 
        actionText: "VOZ LEVE ('WU')" 
      },
      { 
        id: 'l7-6', 
        title: '6. Sustentação Aguda', 
        icon: Activity, 
        prepText: "Agora sem o ar! Cante a nota aguda com 'GUG' para dar firmeza à voz de cabeça sem forçar a garganta.", 
        actionText: "CABEÇA FIRME ('GUG')" 
      }
    ]
  },
  {
    id: 'L7-MD',
    title: 'Módulo D: Descida Suave',
    description: 'Trazendo os agudos de volta ao peito.',
    icon: Disc,
    prescription: 'Foco em Escalas Descendentes',
    exercises: [
      { 
        id: 'l7-7', 
        title: '7. Escala Descendente', 
        icon: Disc, 
        prepText: "Hora de descer. Comece no agudo (voz de cabeça) e vá descendo as notas até a voz de peito forte usando 'NO'.", 
        actionText: "DESCIDA ('NO')" 
      },
      { 
        id: 'l7-8', 
        title: '8. Arpejo de Retorno', 
        icon: Music, 
        prepText: "Desça pulando degraus! Salte das notas agudas para as graves com a sílaba 'BÁ', deixando a voz de peito assumir naturalmente.", 
        actionText: "ARPEJO DE DESCIDA ('BÁ')" 
      }
    ]
  },
  {
    id: 'L7-ME',
    title: 'Módulo E: Agilidade no Passaggio',
    description: 'Navegação rápida sem solavancos.',
    icon: Zap,
    prescription: 'Foco em Navegação Rápida',
    exercises: [
      { 
        id: 'l7-9', 
        title: '9. Salto Rápido', 
        icon: Zap, 
        prepText: "Pule da voz de peito para a de cabeça e volte rapidamente usando 'HA'. Mantenha a leveza!", 
        actionText: "SALTO DUPLO ('HA')" 
      },
      { 
        id: 'l7-10', 
        title: '10. Sirene Completa', 
        icon: Activity, 
        prepText: "O teste final da transição. Faça uma sirene completa de baixo até em cima e volte, sem deixar a voz quebrar em nenhum momento!", 
        actionText: "SIRENE COMPLETA" 
      }
    ]
  }
];

const AcademyLevel7Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: any) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-22') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level7Modules.map((module) => (
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

export default AcademyLevel7Menu;