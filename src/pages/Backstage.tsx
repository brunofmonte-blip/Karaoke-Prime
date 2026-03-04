"use client";

import React from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import UserProfileCard from '@/components/UserProfileCard';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';
import AchievementsSection from '@/components/AchievementsSection';
import RankingTables from '@/components/RankingTables';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, History, Music, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const Backstage = () => {
  const { data: profile, isLoading } = useUserProfile();
  const { user } = useAuth();
  const { pitchHistory } = useVocalSandbox();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse font-black tracking-widest uppercase">Carregando Backstage...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
              YOUR <span className="text-primary neon-blue-glow">BACKSTAGE</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-xs mt-2">Análise profunda da sua jornada vocal</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <p className="text-[10px] font-black text-primary uppercase">Total XP</p>
              <p className="text-xl font-black text-white">{(profile?.xp || 0).toLocaleString()}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-center">
              <p className="text-[10px] font-black text-accent uppercase">Badges</p>
              <p className="text-xl font-black text-white">{profile?.badges?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <UserProfileCard 
              userName={profile?.username || user?.email?.split('@')[0] || "Cantor Prime"}
              avatarUrl={profile?.avatar_url}
              bestNote={profile?.best_note || 0}
              academyLevel={profile?.academy_level || 0}
              rankingOnline={profile?.ranking_position || 999}
              rankingOffline={12}
              earnedBadgeIds={profile?.badges as any[]}
            />

            <Card className="glass-pillar border-primary/30">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Vocal Health Index
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Estabilidade</span>
                    <span className="text-primary">88%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[88%] shadow-[0_0_10px_rgba(0,168,225,0.5)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Resistência</span>
                    <span className="text-accent">72%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[72%] shadow-[0_0_10px_rgba(255,153,0,0.5)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Charts & Rankings */}
          <div className="lg:col-span-8 space-y-8">
            <div className="h-[400px]">
              <VocalEvolutionChart 
                title="Evolução de Pitch (Última Sessão)" 
                data={pitchHistory} 
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Trophy className="h-6 w-6 text-accent" />
                Classificações em Tempo Real
              </h2>
              <RankingTables />
            </div>
          </div>

        </div>

        {/* Achievements Section */}
        <div className="pt-12 border-t border-white/5">
          <AchievementsSection />
        </div>

        {/* Recent History Placeholder */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            Histórico de Performances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-black/40 flex items-center justify-center">
                    <Music className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Performance #{i + 124}</p>
                    <p className="text-xs text-gray-500">Há 2 dias • 84.2% Precisão</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">+450 XP</p>
                  <Star className="h-3 w-3 text-accent ml-auto mt-1 fill-accent" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Backstage;