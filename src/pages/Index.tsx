import React, { useState } from 'react';
import { GraduationCap, Star, Lock, Music, Trophy, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";
import RegionalTopHits from "@/components/RegionalTopHits";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";
import TrendSingersFeed from "@/components/TrendSingersFeed";
import RankingTables from "@/components/RankingTables";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserProfile } from '@/hooks/use-user-profile';
import PillarLockedOverlay from '@/components/PillarLockedOverlay';
import { useAuth } from '@/integrations/supabase/auth';
import AchievementsSection from '@/components/AchievementsSection';
import AdvancedSearch from '@/components/AdvancedSearch';

const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full flex flex-col items-center justify-center text-center" 
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    {/* Dark Overlay for Readability */}
    <div className="absolute inset-0 bg-black/60" />
    
    <div className="relative z-10 p-4">
      <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
        KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
        A plataforma definitiva para evolução vocal e performance global.
      </p>
    </div>
  </section>
);

interface ElitePillarProps {
  title: string;
  description: string;
  icon: React.ElementType;
  to?: string;
  onClick?: () => void;
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
    onClick?.();
  };

  const content = (
    <div className={cn(
      "p-6 rounded-2xl transition-all duration-500 relative h-full flex flex-col",
      "bg-card/20 backdrop-blur-xl border-2 shadow-2xl",
      isUnlocked ? "border-green-500/70 shadow-green-500/30" : "border-primary/70 shadow-primary/30",
      "cursor-pointer hover:scale-[1.05] hover:bg-card/30",
      isLocked && "opacity-60 grayscale-[0.5]"
    )}
    onClick={handleClick}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-10">
          <Lock className="h-10 w-10 text-white/50" />
        </div>
      )}
      
      <div className={cn(
        "h-12 w-12 mb-4 flex items-center justify-center rounded-xl border-2 flex-shrink-0",
        isLocked ? "border-white/20 bg-white/5" : "border-primary/50 bg-primary/10"
      )}>
        <Icon className={cn("h-6 w-6", isLocked ? "text-white/40" : "text-primary icon-neon-glow")} />
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400 leading-snug flex-grow">{description}</p>
    </div>
  );

  if (to && !isLocked) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }
  
  return <div className="block h-full">{content}</div>;
};

const Index = () => {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  
  const currentLevel = profile?.academy_level ?? 0;
  const [lockedPillar, setLockedPillar] = useState<{ title: string, requiredLevel: number } | null>(null);

  const handlePillarClick = (title: string, requiredLevel: number, to: string) => {
    if (!user) {
      toast.warning("Faça login para acessar recursos premium.");
      return;
    }
    if (currentLevel < requiredLevel) {
      setLockedPillar({ title, requiredLevel });
    } else {
      navigate(to);
    }
  };

  return (
    <div className="w-full bg-background">
      {lockedPillar && (
        <PillarLockedOverlay 
          title={lockedPillar.title}
          requiredLevel={lockedPillar.requiredLevel}
          currentLevel={currentLevel}
          onClose={() => setLockedPillar(null)}
        />
      )}

      <HeroSection />

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        {/* Uniform 5-Column Grid for Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-8">
          <ElitePillarCard 
            title="Básico" 
            description="Karaoke tradicional com MVs originais e sistema de batalha." 
            icon={Music} 
            to="/basic"
          />
          <ElitePillarCard 
            title="Academy" 
            description="Currículo de 10 níveis com Diagnóstico Vocal AI." 
            icon={GraduationCap} 
            to="/academy"
          />
          <ElitePillarCard 
            title="Next Talent" 
            description="Audições gamificadas de 10 níveis, do local ao global." 
            icon={Star} 
            isLocked={currentLevel < 5}
            onLockClick={() => handlePillarClick("Next Talent", 5, "/talent")}
          />
          <ElitePillarCard 
            title="Backstage" 
            description="UI Premium bloqueada por teste Pro-Vocal." 
            icon={Lock} 
            isLocked={currentLevel < 8}
            onLockClick={() => handlePillarClick("Backstage", 8, "/backstage")}
          />
          <ElitePillarCard 
            title="Next Success" 
            description="Espaço do compositor. Transforme suas ideias em músicas de estúdio usando IA." 
            icon={Sparkles} 
            isLocked={currentLevel < 10}
            onLockClick={() => handlePillarClick("Next Success", 10, "/next-success")}
          />
        </div>

        <div className="mt-12">
          <AdvancedSearch />
        </div>

        <div className="py-16">
          <AchievementsSection />
          <RegionalTopHits />
          <TrendSingersFeed />
          <RecentlyAdded />
          <TrendTopicsFeed />
          <div className="mt-12 pb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary neon-blue-glow">Rankings Globais</h2>
            <RankingTables />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;