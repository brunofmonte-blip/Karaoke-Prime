import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allBadges, Badge } from '@/data/badges';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';
import { Lock, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BadgeItem: React.FC<{ badge: Badge, isEarned: boolean }> = ({ badge, isEarned }) => {
  const Icon = badge.icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center text-center h-full cursor-help",
            "bg-card/50 backdrop-blur-md shadow-lg",
            isEarned 
              ? "border-accent/70 hover:border-accent hover:shadow-accent/50"
              : "border-border/50 opacity-50 hover:opacity-70"
          )}>
            <div className="relative mb-3">
              <div className={cn(
                "p-3 rounded-full border-2",
                isEarned ? "border-accent/80 bg-accent/10" : "border-gray-500/50 bg-gray-500/10"
              )}>
                <Icon className={cn("h-8 w-8", badge.color, isEarned && "amazon-gold-glow")} />
              </div>
              {!isEarned && (
                <Lock className="absolute top-0 right-0 h-4 w-4 text-gray-400 bg-card rounded-full p-0.5 border border-gray-500/50" />
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{badge.name}</h3>
            <p className="text-xs text-muted-foreground flex-grow">{badge.description}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-card border-accent/50 text-foreground p-3 rounded-xl shadow-xl max-w-xs">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <p className="font-bold text-accent">{isEarned ? "Conquistado!" : "Como Desbloquear"}</p>
              <p className="text-xs mt-1">
                {isEarned 
                  ? `Você desbloqueou este badge ao atingir os critérios de ${badge.criteria.type.replace('_', ' ')}.` 
                  : `Complete ${badge.criteria.value} ${badge.criteria.type.replace('_', ' ')} para ganhar este badge.`}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AchievementsSection: React.FC = () => {
  const { data: profile } = useUserProfile();
  const earnedBadgeIds = profile?.badges || [];
  const isUserLoggedIn = !!profile;

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-accent neon-gold-glow">
        Conquistas (Badges)
      </h2>
      
      {!isUserLoggedIn && (
        <div className="text-center p-6 bg-primary/10 border border-primary/50 rounded-xl max-w-xl mx-auto mb-8">
          <p className="text-primary font-semibold">Sign in to track your achievements!</p>
          <p className="text-sm text-muted-foreground mt-1">Badges are saved to your profile.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {allBadges.map((badge) => (
          <BadgeItem 
            key={badge.id} 
            badge={badge} 
            isEarned={earnedBadgeIds.includes(badge.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;