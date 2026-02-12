import React, { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Star, Lock, Music, Trophy, CheckCircle, PlayCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";
import RankingTables from "@/components/RankingTables";
import { Link, useNavigate } from "react-router-dom";
import { useVocalSandbox } from "@/hooks/use-vocal-sandbox";
import { useRateLimiter } from "@/hooks/use-rate-limiter";
import { toast } from "sonner";
import { useUserProfile } from '@/hooks/use-user-profile';
import PillarLockedOverlay from '@/components/PillarLockedOverlay';
import { useAuth } from '@/integrations/supabase/auth';
import { usePrimeSubscription } from '@/hooks/use-prime-subscription';
import AchievementsSection from '@/components/AchievementsSection';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { academyLessons } from '@/data/lessons';
import { Button } from '@/components/ui/button';
import AdvancedSearch from '@/components/AdvancedSearch';

const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full bg-cover bg-center flex flex-col justify-end" 
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600')" }}
  >
    <div className="absolute inset-0 hero-vignette" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
    </div>
    <div className="h-[10vh] md:h-[15vh] relative z-10"></div>
  </section>
);

interface ElitePillarProps {
  title: string;
  description: string;
  icon: React.ElementType;
  to?: string;
  onClick?: () => void;
  isRateLimited?: boolean;
  isLocked?: boolean;
  isUnlocked?: boolean;
  onLockClick?: () => void;
}

const ElitePillarCard: React.FC<ElitePillarProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  onClick, 
  isRateLimited = false, 
  isLocked = false, 
  isUnlocked = false,
  onLockClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockClick?.();
      return;
    }
    if (isRateLimited) {
      e.preventDefault();
      toast.warning("Aguarde um momento antes de tentar novamente.", { duration: 1500 });
      return;
    }
    onClick?.();
  };

  const content = (
    <div className={cn(
      "p-4 rounded-2xl transition-all duration-500 flex-shrink-0 w-[200px] lg:w-[200px] relative",
      "bg-card/10 backdrop-blur-md",
      "border-2 shadow-xl",
      isUnlocked ? "border-green-500/70 shadow-green-500/30" : "border-primary/70 shadow-primary/30",
      "cursor-pointer hover:scale-[1.03] hover:shadow-primary/70",
      "neon-blue-border-glow",
      isRateLimited && "opacity-50",
      isLocked && "opacity-70 border-gray-500/50"
    )}
    onClick={handleClick}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
      )}
      {isUnlocked && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle className="h-5 w-5 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
        </div>
      )}
      <div className={cn(
        "h-10 w-10 mb-3 flex items-center justify-center rounded-full border-2",
        isLocked ? "border-gray-500/50 bg-gray-500/10" : 
        isUnlocked ? "border-green-500/50 bg-green-500/10" : "border-primary/50 bg-primary/10"
      )}>
        <Icon className={cn(
          "h-5 w-5", 
          isLocked ? "text-gray-400" : 
          isUnlocked ? "text-green-400 icon-neon-glow" : "text-primary icon-neon-glow"
        )} />
      </div>
      
      <h3 className="text-lg font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );

  if (to && !isLocked) {
    return <Link to={to} className="block">{content}</Link>;
  }
  
  return <div className="block">{content}</div>;
};

const Index = () => {
  const navigate = useNavigate();
  const { openOverlay, startAnalysis } = useVocalSandbox();
  const { trigger, isRateLimited } = useRateLimiter(1500);
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  const { openModal: openPrimeModal } = usePrimeSubscription();
  
  const currentLevel = profile?.academy_level ?? 0;
  const isPrime = profile?.is_prime ?? false;
  const [lockedPillar, setLockedPillar] = useState<{ title: string, requiredLevel: number } | null>(null);

  const recommendedLesson = useMemo(() => {
    if (currentLevel < 10) {
      return academyLessons.find(lesson => lesson.level === currentLevel + 1);
    }
    return academyLessons[9]; // Max level
  }, [currentLevel]);

  const handleBasicPillarClick = () => {
    trigger(() => {
      const defaultSong = publicDomainLibrary[0];
      startAnalysis(defaultSong, false);
      openOverlay();
    });
  };

  const handlePillarClick = (title: string, requiredLevel: number, to: string) => {
    if (!user) {
      toast.warning("Faça login para acessar recursos premium.", { duration: 3000 });
      return;
    }
    if (currentLevel < requiredLevel) {
      setLockedPillar({ title, requiredLevel });
    } else {
      navigate(to);
    }
  };
  
  const handleSuccessPillarClick = () => {
    if (!user) {
      toast.warning("Faça login para acessar recursos Prime.", { duration: 3000 });
      return;
    }
    if (!isPrime) {
      openPrimeModal();
    } else {
      toast.info("Bem-vindo de volta, Membro Prime!", { duration: 3000 });
    }
  };

  return (
    <div className="w-full relative">
      {lockedPillar && (
        <PillarLockedOverlay 
          title={lockedPillar.title}
          requiredLevel={lockedPillar.requiredLevel}
          currentLevel={currentLevel}
          onClose={() => setLockedPillar(null)}
        />
      )}

      <div className="relative">
        <HeroSection />
        <div className="absolute bottom-[-60px] left-0 right-0 z-50 w-full max-w-7xl mx-auto"> 
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center">
            <ElitePillarCard 
              title="Basic" 
              description="Karaoke tradicional com MVs originais e sistema de batalha." 
              icon={Music} 
              onClick={handleBasicPillarClick}
              isRateLimited={isRateLimited}
              isUnlocked={currentLevel > 0}
            />
            <ElitePillarCard 
              title="Academy" 
              description="Currículo de 10 níveis com Diagnóstico Vocal AI." 
              icon={GraduationCap} 
              to="/academy"
              isUnlocked={currentLevel > 0}
            />
            <ElitePillarCard 
              title="Next Talent" 
              description="Audições gamificadas de 10 níveis, do local ao global." 
              icon={Star} 
              isLocked={currentLevel < 5}
              isUnlocked={currentLevel >= 5}
              onLockClick={() => handlePillarClick("Next Talent", 5, "/talent")}
            />
            <ElitePillarCard 
              title="Backstage" 
              description="UI Premium bloqueada por teste Pro-Vocal." 
              icon={Lock} 
              isLocked={currentLevel < 8}
              isUnlocked={currentLevel >= 8}
              onLockClick={() => handlePillarClick("Backstage", 8, "/backstage")}
            />
            <ElitePillarCard 
              title="Amazon Success" 
              description="Ranking global baseado em performance." 
              icon={isPrime ? Trophy : Lock} 
              onClick={handleSuccessPillarClick}
              isLocked={!isPrime}
              isUnlocked={isPrime}
              onLockClick={handleSuccessPillarClick}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-6 relative z-30 pt-[140px] md:pt-[140px]"> 
        {/* Advanced Search Section */}
        <div className="mt-8 px-4 md:px-0">
          <AdvancedSearch />
        </div>

        {/* AI Recommended Training Section */}
        {user && (
          <div className="mt-8 px-4 md:px-0 flex justify-center">
            <div className="glass-pillar p-6 rounded-2xl border-2 border-accent/50 shadow-xl max-w-2xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10 border border-accent/50">
                  <Sparkles className="h-6 w-6 text-accent amazon-gold-glow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Treinamento Recomendado</h3>
                  <p className="text-sm text-muted-foreground">
                    Foco: <span className="text-accent font-semibold">{recommendedLesson?.focus}</span>
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/academy')}
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-6 py-2 shadow-lg shadow-accent/30 font-bold"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
            </div>
          </div>
        )}

        <div className="py-16 px-4 md:px-0">
          <AchievementsSection />
        </div>
        <div className="py-16 px-4 md:px-0">
          <GlobalHotspotsCarousel />
        </div>
        <RecentlyAdded />
        <TrendTopicsFeed />
        <div className="mt-12 pb-16 px-4 md:px-0">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow">Antemas de Karaoke em Todo o Mundo</h2>
          <RankingTables />
        </div>
      </div>
    </div>
  );
};

export default Index;