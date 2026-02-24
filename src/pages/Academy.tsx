"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, PlayCircle, ChevronRight, Trophy, Star, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import InstructorAvatar from '@/components/InstructorAvatar';
import { toast } from 'sonner';

export default function Academy() {
  const location = useLocation();
  const navigate = useNavigate();
  const recommendedPlan = location.state?.recommendedPlan;

  // CURRICULUM DATA
  const curriculum = [
    { level: 1, title: "Fundamentos e Respiração", desc: "A base de todo grande cantor. Domine o apoio diafragmático.", unlocked: true },
    { level: 2, title: "Calibração de Pitch (Afinação)", desc: "Ataque laser nas notas. Elimine o scooping e os deslizes.", unlocked: false },
    { level: 3, title: "Sincronia e Ritmo", desc: "Cante no tempo perfeito. Entenda o groove da música.", unlocked: false },
    { level: 4, title: "Transições e Registros", desc: "Voz de peito, voz de cabeça e a ponte perfeita entre elas.", unlocked: false },
    { level: 5, title: "Vibrato Mastery", desc: "O segredo da emoção. Controle a oscilação com naturalidade.", unlocked: false },
    { level: 6, title: "Ressonância e Projeção", desc: "Cante mais alto sem forçar a garganta usando as máscaras faciais.", unlocked: false },
    { level: 7, title: "Dinâmica e Expressão", desc: "Sussurros e explosões. Como contar uma história cantando.", unlocked: false },
    { level: 8, title: "Agilidade Vocal (Melismas)", desc: "Flexibilidade extrema para cantar R&B e Pop com perfeição.", unlocked: false },
    { level: 9, title: "Identidade Vocal", desc: "Pare de imitar e descubra o timbre único da sua própria voz.", unlocked: false },
    { level: 10, title: "Performance Masterclass", desc: "Presença de palco, microfonação e domínio de público.", unlocked: false },
  ];

  const handleStartLevel = (level: number, unlocked: boolean) => {
    if (!unlocked) {
      navigate('/premium');
      return;
    }
    // Logic to start Level 1 (Breathing Gym)
    toast.success("Iniciando Nível 1: Fundamentos");
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600')" }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />

      <div className="container mx-auto max-w-6xl p-4 md:p-8 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
          <InstructorAvatar />
          <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-4 tracking-tighter">
            KARAOKE <span className="text-primary neon-blue-glow">ACADEMY</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl font-medium leading-relaxed">
            O currículo definitivo para a maestria vocal. 10 níveis projetados por IA para transformar sua voz.
          </p>
        </div>

        {/* AI Vocal Coach Prescription Banner */}
        {recommendedPlan && (
          <div className="mb-12 p-8 rounded-3xl bg-accent/10 border-2 border-accent/50 animate-in slide-in-from-left duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="h-24 w-24 text-accent" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-accent/20 border border-accent/40">
                <BrainCircuit className="h-10 w-10 text-accent" />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h3 className="text-2xl font-black text-accent uppercase tracking-widest mb-1">Prescrição do Instrutor IA</h3>
                <p className="text-white text-lg font-medium">Baseado no seu último show, você deve focar em: <span className="text-accent font-black underline decoration-2 underline-offset-4">{recommendedPlan}</span></p>
              </div>
              <Button 
                onClick={() => navigate('/premium')}
                className="bg-accent hover:bg-accent/90 text-black font-black px-8 py-6 rounded-xl shadow-lg shadow-accent/20"
              >
                COMEÇAR AGORA
              </Button>
            </div>
          </div>
        )}

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map((item) => (
            <Card 
              key={item.level}
              className={cn(
                "relative overflow-hidden transition-all duration-500 border-2 group",
                item.unlocked 
                  ? "glass-pillar border-primary/50 hover:border-primary hover:scale-[1.02] cursor-pointer" 
                  : "bg-black/40 border-white/5 opacity-60 grayscale-[0.5]"
              )}
              onClick={() => handleStartLevel(item.level, item.unlocked)}
            >
              {!item.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-10 w-10 text-white/50" />
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Premium</span>
                  </div>
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "h-10 w-10 rounded-xl border flex items-center justify-center font-black text-lg",
                    item.unlocked ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-gray-500"
                  )}>
                    {item.level}
                  </div>
                  {item.unlocked ? (
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  ) : (
                    <Trophy className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <CardTitle className={cn(
                  "text-xl font-bold mt-4",
                  item.unlocked ? "text-white" : "text-gray-500"
                )}>
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-4 border-t border-white/5">
                  <Button 
                    variant={item.unlocked ? "default" : "secondary"}
                    className={cn(
                      "w-full rounded-xl font-black uppercase tracking-wider text-xs py-6",
                      item.unlocked 
                        ? "bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20" 
                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {item.unlocked ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar Treino
                      </>
                    ) : (
                      "Desbloquear com Prime"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Star className="h-3 w-3 fill-current" />
            Certificação Pro-Vocal
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Pronto para o Próximo Nível?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Complete todos os 10 níveis para receber seu selo de Artista Verificado e desbloquear o acesso ao Backstage.
          </p>
          <Button variant="ghost" className="text-gray-500 hover:text-white">
            Ver Detalhes da Certificação <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}