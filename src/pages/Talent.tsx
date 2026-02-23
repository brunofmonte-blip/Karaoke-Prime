"use client";

import React, { useState } from 'react';
import { Trophy, Star, Globe, MapPin, Music, ChevronRight, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';

const auditionStages = [
  { level: 1, title: "Audição Local: Bar do Bairro", scope: "Local", requiredLevel: 0, icon: MapPin },
  { level: 2, title: "Show de Talentos Municipal", scope: "Local", requiredLevel: 1, icon: MapPin },
  { level: 3, title: "Festival Regional de Inverno", scope: "Regional", requiredLevel: 2, icon: MapPin },
  { level: 4, title: "Eliminatórias Estaduais", scope: "Regional", requiredLevel: 3, icon: MapPin },
  { level: 5, title: "The Voice: Audições às Cegas", scope: "Nacional", requiredLevel: 4, icon: Star },
  { level: 6, title: "Batalhas Nacionais", scope: "Nacional", requiredLevel: 5, icon: Star },
  { level: 7, title: "Grande Final Nacional", scope: "Nacional", requiredLevel: 6, icon: Star },
  { level: 8, title: "Tour Latino-Americana", scope: "Continental", requiredLevel: 7, icon: Globe },
  { level: 9, title: "World Music Awards: New Artist", scope: "Global", requiredLevel: 8, icon: Globe },
  { level: 10, title: "Estrela Global: Madison Square Garden", scope: "Global", requiredLevel: 9, icon: Trophy },
];

const Talent = () => {
  const { data: profile } = useUserProfile();
  const currentLevel = profile?.academy_level ?? 0;
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const handleStartAudition = (stage: typeof auditionStages[0]) => {
    if (currentLevel < stage.requiredLevel) {
      toast.error(`Bloqueado! Você precisa atingir o Nível ${stage.requiredLevel} na Academy para esta audição.`);
      return;
    }
    setSelectedStage(stage.level);
    toast.success(`Iniciando ${stage.title}! Prepare sua melhor performance.`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            NEXT <span className="text-primary neon-blue-glow">TALENT</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sua jornada do anonimato ao estrelato global. 10 estágios de pura pressão e glória.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Sidebar */}
          <Card className="lg:col-span-1 glass-pillar border-2 border-primary/30 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Seu Status de Carreira
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/10 rounded-2xl border border-primary/30">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estágio Atual</p>
                <p className="text-3xl font-black text-white">
                  {currentLevel >= 10 ? "Superstar Global" : auditionStages[currentLevel]?.scope || "Iniciante"}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">Progresso da Carreira</span>
                  <span className="text-primary">{(currentLevel / 10 * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(currentLevel / 10) * 100} className="h-2 bg-white/10" indicatorClassName="bg-primary" />
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 italic">
                  "O talento vence jogos, mas o trabalho em equipe e a inteligência vencem campeonatos."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audition Stages Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditionStages.map((stage) => {
              const isLocked = currentLevel < stage.requiredLevel;
              const isCompleted = currentLevel > stage.requiredLevel;
              const isCurrent = currentLevel === stage.requiredLevel;

              return (
                <Card 
                  key={stage.level}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 border-2",
                    isCompleted ? "border-green-500/50 bg-green-500/5" :
                    isCurrent ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" :
                    "border-white/10 bg-white/5 opacity-60"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn(
                        "p-3 rounded-xl border",
                        isCurrent ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
                      )}>
                        <stage.icon className={cn("h-6 w-6", isCurrent ? "text-primary" : "text-gray-400")} />
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">Nível {stage.level}: {stage.title}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{stage.scope}</p>

                    <Button 
                      onClick={() => handleStartAudition(stage)}
                      disabled={isLocked || isCompleted}
                      className={cn(
                        "w-full rounded-xl font-bold",
                        isCurrent ? "bg-primary hover:bg-primary/90 text-black" : "bg-white/5 text-gray-400"
                      )}
                    >
                      {isCompleted ? "Concluído" : isLocked ? `Requer Nível ${stage.requiredLevel}` : "Entrar no Palco"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Talent;