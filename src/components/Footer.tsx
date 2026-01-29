import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileCard from './UserProfileCard';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import VocalEvolutionChart from './VocalEvolutionChart';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox'; // Import new hook
import { ChevronRight } from 'lucide-react'; // Import icon for the smile arrow

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
  const { isAnalyzing, pitchHistory } = useVocalSandbox(); // Get sandbox state

  // Determine which data to show in the chart
  const chartData = isAnalyzing && pitchHistory.length > 0 ? pitchHistory : staticChartData;
  const chartTitle = isAnalyzing ? "Live Pitch Tracking" : "Vocal Note Evolution (Pitch Accuracy 0-100)";

  // Default placeholder data if not logged in or loading
  const defaultUserData = {
    userName: "Guest Singer",
    bestNote: 0,
    academyLevel: 0,
    rankingOnline: 9999,
    rankingOffline: 9999,
    avatarUrl: undefined,
  };

  const userData = user && profile ? {
    userName: profile.username || user.email?.split('@')[0] || "Vocalist",
    bestNote: profile.best_note,
    academyLevel: profile.academy_level,
    rankingOnline: profile.ranking_position, // Using ranking_position for online ranking placeholder
    rankingOffline: 9999, // Placeholder for offline ranking
    avatarUrl: profile.avatar_url || user.user_metadata.avatar_url,
  } : defaultUserData;

  return (
    <footer className="w-full bg-background border-t border-border/40 p-6">
      <div className="container mx-auto">
        
        {/* Main Content Grid: Chart (2/3) and Profile (1/3) - items-stretch for symmetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-8 h-[300px]"> {/* Added fixed height for chart container */}
          
          {/* Vocal Note Evolution Chart */}
          <div className="lg:col-span-2 w-full h-full">
            <VocalEvolutionChart 
              title={chartTitle} 
              data={chartData} 
            />
          </div>

          {/* User Profile Card */}
          <div className="lg:col-span-1">
            {isProfileLoading && user ? (
              <div className="h-full flex items-center justify-center glass-pillar rounded-2xl p-6">
                <p className="text-muted-foreground">Loading profile data...</p>
              </div>
            ) : (
              <UserProfileCard 
                userName={userData.userName}
                bestNote={userData.bestNote}
                academyLevel={userData.academyLevel}
                rankingOnline={userData.rankingOnline}
                rankingOffline={userData.rankingOffline}
                avatarUrl={userData.avatarUrl}
              />
            )}
          </div>
        </div>
        
        {/* Motivational Tagline */}
        <div className="text-center py-10">
          <h2 className={cn(
            "text-4xl md:text-6xl font-extrabold uppercase tracking-widest",
            "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          )}>
            SING. EVOLVE. CONQUER THE 
            <span className="relative inline-block ml-4 text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              WORLD.
              {/* Amazon Smile Arrow Placeholder */}
              <ChevronRight className="inline h-8 w-8 ml-2 text-accent amazon-gold-glow absolute -bottom-2 right-[-40px] rotate-45" />
            </span>
          </h2>
        </div>

        {/* Footer Links and Branding (Moved to bottom center/right) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground order-2 md:order-1 mt-4 md:mt-0">
            © {new Date().getFullYear()} Karaoke Prime. All rights reserved.
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