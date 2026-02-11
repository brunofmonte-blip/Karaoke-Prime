import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileCard from './UserProfileCard';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import VocalEvolutionChart from './VocalEvolutionChart';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useMemo } from 'react';

const staticChartData = [
  { name: 'Note 1', pitch: 65, breath: 80 },
  { name: 'Note 2', pitch: 70, breath: 75 },
  { name: 'Note 3', pitch: 85, breath: 90 },
  { name: 'Note 4', pitch: 92, breath: 88 },
  { name: 'Note 5', pitch: 78, breath: 82 },
  { name: 'Note 6', pitch: 88, breath: 95 },
  { name: 'Note 7', pitch: 95, breath: 98 },
];

const Footer = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const vocalContext = useVocalSandbox();
  
  if (!vocalContext) return null;
  
  const { isAnalyzing, pitchHistory, isPitchDeviating, recentAchievements } = vocalContext;

  // Fetch last 5 performance logs for the dynamic graph
  const historicalData = useMemo(() => {
    if (typeof window === 'undefined') return staticChartData;
    try {
      const stored = localStorage.getItem('karaoke_offline_performance_logs');
      if (!stored) return staticChartData;
      const logs = JSON.parse(stored);
      // Take last 5 logs and format for chart
      return logs.slice(-5).map((log: any, index: number) => ({
        name: `Session ${index + 1}`,
        pitch: log.pitchAccuracy,
        breath: 50
      }));
    } catch (e) {
      return staticChartData;
    }
  }, [isAnalyzing]); // Refresh when analysis ends

  const chartData = isAnalyzing && pitchHistory.length > 0 ? pitchHistory : historicalData;
  const chartTitle = isAnalyzing ? "Live Pitch Tracking" : "Evolução Vocal (Últimas 5 Sessões)";

  const userData = user && profile ? {
    userName: profile.username || user.email?.split('@')[0] || "Cantor",
    bestNote: profile.best_note || 0,
    academyLevel: profile.academy_level || 0,
    rankingOnline: profile.ranking_position || 9999,
    rankingOffline: profile.ranking_position || 9999,
    avatarUrl: profile.avatar_url || user.user_metadata.avatar_url,
    earnedBadgeIds: profile.badges || [],
  } : {
    userName: "Cantor Convidado",
    bestNote: 0,
    academyLevel: 0,
    rankingOnline: 9999,
    rankingOffline: 9999,
    avatarUrl: undefined,
    earnedBadgeIds: [],
  };

  return (
    <footer className="w-full bg-background border-t border-border/40 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-8 h-auto lg:h-[300px]">
          <div className="lg:col-span-2 w-full h-[300px] lg:h-full">
            <VocalEvolutionChart title={chartTitle} data={chartData} />
          </div>
          <div className="lg:col-span-1">
            {isProfileLoading && user ? (
              <div className="h-full flex items-center justify-center glass-pillar rounded-2xl p-6">
                <p className="text-muted-foreground">Carregando perfil...</p>
              </div>
            ) : (
              <UserProfileCard 
                {...userData}
                isAnalyzing={isAnalyzing}
                isPitchDeviating={isPitchDeviating}
                recentAchievements={recentAchievements}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground order-2 md:order-1 mt-4 md:mt-0">
            © {new Date().getFullYear()} Karaoke Prime. Todos os direitos reservados.
          </p>
          <div className="order-1 md:order-2">
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;