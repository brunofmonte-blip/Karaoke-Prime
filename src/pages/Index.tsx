import React, { useState } from 'react';
import { GraduationCap, Star, Lock, Music, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";
import HeroCtaButton from "@/components/HeroCtaButton";
import RankingTables from "@/components/RankingTables";
import { Link } from "react-router-dom";
import { useVocalSandbox } from "@/hooks/use-vocal-sandbox";
import { useRateLimiter } from "@/hooks/use-rate-limiter";
import { toast } from "sonner";
import { useUserProfile } from '@/hooks/use-user-profile';
import PillarLockedOverlay from '@/components/PillarLockedOverlay';
import { useAuth } from '@/integrations/supabase/auth';

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full bg-cover bg-center flex flex-col justify-end" 
    style={{ backgroundImage: "url('/stage-background-new.png')" }}
  >
    {/* Vignette Overlay */}
    <div className="absolute inset-0 hero-vignette" />
    
    {/* Content: Centered vertically in the middle section */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
      
      {/* CTA Buttons removed as requested */}
      
    </div>
    
    {/* Spacer to push content up, ensuring the pillars are positioned correctly */}
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
  onLockClick?: () => void;
}

const ElitePillarCard: React.FC<ElitePillarProps> = ({ title, description, icon: Icon, to, onClick, isRateLimited = false, isLocked = false, onLockClick }) => {
  
  const handleClick = () => {
    if (isLocked) {
      onLockClick?.();
      return;
    }
    if (isRateLimited) {
      toast.warning("Please wait a moment before trying again (Anti-Bot Check).", { duration: 1500 });
      return;
    }
    onClick?.();
  };

  const content = (
    <div className={cn(
      "p-4 rounded-2xl transition-all duration-500 flex-shrink-0 w-[200px] lg:w-[200px] relative",
      "bg-card/10 backdrop-blur-md",
      "border-2 border-primary/70 shadow-xl",
      "cursor-pointer hover:scale-[1.03] hover:shadow-primary/70",
      "neon-blue-border-glow",
      isRateLimited && "opacity-50 cursor-not-allowed",
      isLocked && "opacity-70 cursor-pointer hover:scale-100 hover:shadow-none border-gray-500/50"
    )}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
      )}
      {/* Icon Container */}
      <div className={cn(
        "h-10 w-10 mb-3 flex items-center justify-center rounded-full border-2",
        isLocked ? "border-gray-500/50 bg-gray-500/10" : "border-primary/50 bg-primary/10"
      )}>
        <Icon className={cn("h-5 w-5", isLocked ? "text-gray-400" : "text-primary icon-neon-glow")} />
      </div>
      
      <h3 className="text-lg font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );

  if (to && !isLocked) {
    return <Link to={to} className="block">{content}</Link>;
  }
  
  return <div onClick={handleClick} className="block">{content}</div>;
};

const Index = () => {
  const { openOverlay } = useVocalSandbox();
  const { trigger, isRateLimited } = useRateLimiter(1500);
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  
  const currentLevel = profile?.academy_level ?? 0;
  const [lockedPillar, setLockedPillar] = useState<{ title: string, requiredLevel: number } | null>(null);

  const handleBasicPillarClick = () => {
    trigger(openOverlay);
  };

  const handlePillarClick = (title: string, requiredLevel: number, to: string) => {
    if (!user) {
      toast.warning("Please sign in to access premium features.", { duration: 3000 });
      return;
    }
    if (currentLevel < requiredLevel) {
      setLockedPillar({ title, requiredLevel });
    } else {
      // If unlocked, navigate (handled by the Link component or direct navigation if needed)
    }
  };

  return (
    <div className="w-full relative">
      
      {/* Locked Overlay */}
      {lockedPillar && (
        <PillarLockedOverlay 
          title={lockedPillar.title}
          requiredLevel={lockedPillar.requiredLevel}
          currentLevel={currentLevel}
          onClose={() => setLockedPillar(null)}
        />
      )}

      {/* Hero Section Container (Relative for absolute positioning of pillars) */}
      <div className="relative">
        <HeroSection />

        {/* The 5 Elite Pillars Section - FLOATING OVERLAP (The Bridge) */}
        <div className="absolute bottom-[-60px] left-0 right-0 z-50 w-full max-w-7xl mx-auto"> 
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center md:overflow-x-hidden">
            <ElitePillarCard 
              title="Basic" 
              description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
              icon={Music} 
              onClick={handleBasicPillarClick}
              isRateLimited={isRateLimited}
            />
            <ElitePillarCard 
              title="Academy" 
              description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
              icon={GraduationCap} 
              to="/academy"
            />
            <ElitePillarCard 
              title="Next Talent" 
              description="10-level gamified auditions, progressing from local to global online stages." 
              icon={Star} 
              to="/talent"
              isLocked={currentLevel < 5}
              onLockClick={() => handlePillarClick("Next Talent", 5, "/talent")}
            />
            <ElitePillarCard 
              title="Backstage" 
              description="Premium UI locked behind social verification and a Pro-Vocal test." 
              icon={Lock} 
              to="/backstage"
              isLocked={currentLevel < 8}
              onLockClick={() => handlePillarClick("Backstage", 8, "/backstage")}
            />
            <ElitePillarCard 
              title="Amazon Success" 
              description="Global ranking system based on performance, engagement, and academy level." 
              icon={Trophy} 
              to="/success"
            />
          </div>
        </div>
      </div>

      {/* Content below the Hero, starting after the overlap area. */}
      <div className="container mx-auto px-0 md:px-6 relative z-30 pt-[140px] md:pt-[140px]"> 
        
        {/* Global Karaoke Hotspots */}
        <div className="py-16 px-4 md:px-0">
          <GlobalHotspotsCarousel />
        </div>

        {/* Recently Added Section */}
        <RecentlyAdded />

        {/* Trend Topics (Video Feed) Section */}
        <TrendTopicsFeed />

        {/* Global Ranking & Discovery Section */}
        <div className="mt-12 pb-16 px-4 md:px-0">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow">Karaoke Anthems Worldwide</h2>
          <RankingTables />
        </div>
      </div>
    </div>
  );
};

export default Index;