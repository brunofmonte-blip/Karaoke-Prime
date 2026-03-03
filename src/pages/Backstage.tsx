"use client";

import React from 'react';
import { User, Trophy, Zap, Star, Award, Settings, History, Mic2, TrendingUp, ShieldCheck } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AchievementsSection from '@/components/AchievementsSection';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';
import { cn } from '@/lib/utils';

const Backstage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Zap className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Melhor Nota', value: `${profile?.best_note?.toFixed(1) || 0}%`, icon: Zap, color: 'text-primary' },
    { label: 'Nível Academy', value: profile?.academy_level || 0, icon: Trophy, color: 'text-accent' },
    { label: 'XP Total', value: profile?.xp || 0, icon: Star, color: 'text-yellow-400' },
    { label: 'Badges', value: profile?.badges?.length || 0, icon: Award, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="relative h-[40vh] w-full overflow-hidden flex items-end pb-12">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        
        <div className="container mx-auto max-w-6xl px-4 relative z-20 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-primary p-1 bg-background shadow-[0_0_30px_rgba(0,168,225,0.4)]">
              <img 
                src={profile?.avatar_url || (user as any)?.photoURL || "https://i.pravatar.cc/150?u=karaoke"} 
                alt="Profile" 
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-black shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
              {profile?.username || user?.email?.split('@')[0] || "Artista"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                Prime Member
              </span>
              <span className="px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest">
                Nível {profile?.academy_level || 0} Academy
              </span>
            </div>
          </div>

          <div className="md:ml-auto flex gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" /> Editar Perfil
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-pillar border-2 border-white/5 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <stat.icon className={cn("h-8 w-8 mb-3", stat.color)} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Progress */}
          <Card className="lg:col-span-1 glass-pillar border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso de Carreira
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Academy Mastery</span>
                  <span className="text-primary">{(profile?.academy_level || 0) * 10}%</span>
                </div>
                <Progress value={(profile?.academy_level || 0) * 10} className="h-2 bg-white/5" indicatorClassName="bg-primary" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Vocal Stability</span>
                  <span className="text-accent">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-white/5" indicatorClassName="bg-accent" />
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Atividade Recente</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mic2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Sessão de Treino #{i}</p>
                        <p className="text-[10px] text-gray-500">Há {i * 2} dias • 92.4% Precisão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evolution Chart */}
          <div className="lg:col-span-2 h-full">
            <VocalEvolutionChart 
              title="Histórico de Performance Neural" 
              data={[]} // Will use historical data from localStorage inside component
            />
          </div>
        </div>

        {/* Badges Section */}
        <AchievementsSection />
      </div>
    </div>
  );
};

export default Backstage;