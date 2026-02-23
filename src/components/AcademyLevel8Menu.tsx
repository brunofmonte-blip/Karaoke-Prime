"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic2, Music, Zap, PlayCircle, ChevronRight, Activity, Wind, Target, Disc } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { publicDomainLibrary } from '@/data/public-domain-library';

export const level8Modules = [
  {
    id: 'L8-MA',
    title: 'Módulo A: Apoio Extremo',
    description: 'Gerenciando a pressão subglótica para notas potentes.',
    icon: Wind,
    prescription: 'Foco em Suporte Diafragmático',
    exercises: [
      { 
        id: 'l8-1', 
        title: '1. Pressão Diafragmática', 
        icon: Wind, 
        prepText: "Vamos ativar o motor da voz! Faça sons fortes e curtos de 'TS - TS - TS', empurrando a barriga para fora, para acordar o diafragma.", 
        actionText: "PULSE O APOIO ('TS')" 
      },
      { 
        id: 'l8-2', 
        title: '2. Chamada (Call)', 
        icon: Zap, 
        prepText: "Use a voz de quem está chamando um táxi do outro lado da rua. Grite um 'HEY!' afinado, com bastante volume, mas sem arranhar a garganta.", 
        actionText: "CHAMADA ('HEY')" 
      }
    ]
  },
  {
    id: 'L8-MB',
    title: 'Módulo B: Belting Seguro',
    description: 'Atingindo agudos com brilho e potência sem esforço.',
    icon: Mic2,
    prescription: 'Foco em Ressonância de Máscara',
    exercises: [
      { 
        id: 'l8-3', 
        title: '3. Belt de Vogal Aberta', 
        icon: Music, 
        prepText: "Hora da potência! Cante um 'YÉ' com som bem aberto e sorriso no rosto. Isso ajuda o som a sair alto e brilhante.", 
        actionText: "BELTING ('YÉ')" 
      },
      { 
        id: 'l8-4', 
        title: '4. Sustentação de Potência', 
        icon: Activity, 
        prepText: "Teste de força! Sustente o 'YÉ' agudo pelo máximo de tempo que conseguir, mantendo o volume lá em cima e a afinação cravada.", 
        actionText: "SUSTENTE O BELT ('YÉ')" 
      }
    ]
  },
  {
    id: 'L8-MC',
    title: 'Módulo C: Ressonância Metálica',
    description: 'O segredo do brilho vocal.',
    icon: Target,
    prescription: 'Foco em Twang e Brilho',
    exercises: [
      { 
        id: 'l8-5', 
        title: '5. Twang Básico', 
        icon: Target, 
        prepText: "O segredo do brilho vocal (Twang). Faça um som estridente imitando o choro de um bebê com 'NÊ-NÊ', bem anasalado e espremido.", 
        actionText: "VOZ DE BEBÊ ('NÊ')" 
      },
      { 
        id: 'l8-6', 
        title: '6. Projeção Frontal', 
        icon: Mic2, 
        prepText: "Jogue o som para o nariz! Cante 'MIAU' deslizando as notas. Esse som estridente de gato protege a sua garganta nos agudos fortes.", 
        actionText: "PROJEÇÃO ('MIAU')" 
      }
    ]
  },
  {
    id: 'L8-MD',
    title: 'Módulo D: Controle de Pressão',
    description: 'Evitando a fadiga no belting.',
    icon: Wind,
    prescription: 'Foco em Resistência no Belting',
    exercises: [
      { 
        id: 'l8-7', 
        title: '7. Cinto de Apoio', 
        icon: Wind, 
        prepText: "Cante notas fortes e curtas com 'GÓ'. Pense que você está levantando um peso a cada nota, usando o corpo todo para apoiar a voz.", 
        actionText: "ATAQUE FORTE ('GÓ')" 
      },
      { 
        id: 'l8-8', 
        title: '8. Belting Dinâmico', 
        icon: Activity, 
        prepText: "Comece com o volume médio usando 'NÓ' e vá aumentando (crescendo) até virar um Belting potente e rasgado no final.", 
        actionText: "CRESCENDO ('NÓ')" 
      }
    ]
  },
  {
    id: 'L8-ME',
    title: 'Módulo E: Clímax Vocal',
    description: 'A grande nota final.',
    icon: Disc,
    prescription: 'Foco em Crescendo e Clímax',
    exercises: [
      { 
        id: 'l8-9', 
        title: '9. Crescendo para Belt', 
        icon: Disc, 
        prepText: "A clássica nota de clímax de música Pop! Deslize de uma nota baixa até a nota mais aguda explodindo em um 'YEAH' potente.", 
        actionText: "EXPLOSÃO ('YEAH')" 
      },
      { 
        id: 'l8-10', 
        title: '10. A Nota de Ouro', 
        icon: Zap, 
        prepText: "O Boss Final do Belting! Dê o seu grito mais afinado, alto e longo com a sílaba 'BÁ'. Mostre todo o seu poder de fogo!", 
        actionText: "A NOTA DE OURO ('BÁ')" 
      }
    ]
  }
];

const AcademyLevel8Menu: React.FC = () => {
  const { startAnalysis, openOverlay } = useVocalSandbox();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleStartExercise = (exercise: any) => {
    const exerciseSong = publicDomainLibrary.find(s => s.id === 'pd-22') || publicDomainLibrary[0];
    startAnalysis(exerciseSong, false, 'pitch-calibration', 'none', exercise.title, exercise.id);
    openOverlay();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {level8Modules.map((module) => (
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

export default AcademyLevel8Menu;