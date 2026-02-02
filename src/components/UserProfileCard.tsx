import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, GraduationCap, Award, Star, Mic2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileCardProps {
  userName: string;
  avatarUrl?: string | null;
  bestNote: number;
  academyLevel: number;
  rankingOnline: number;
  rankingOffline: number;
  // New diagnostic props
  isAnalyzing?: boolean;
  isPitchDeviating?: boolean;
  recentAchievements?: string[];
}

const achievementIcons: Record<string, { icon: React.ElementType, color: string }> = {
  "Golden Mic": { icon: Mic2, color: "text-yellow-500" },
  "Perfect Pitch": { icon: Star, color: "text-primary" },
  "Vocal Master": { icon: Award, color: "text-red-500" },
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userName,
  avatarUrl,
  bestNote,
  academyLevel,
  rankingOnline,
  rankingOffline,
  isAnalyzing = false,
  isPitchDeviating = false,
  recentAchievements = [],
}) => {
  // Use ref to track previous bestNote to detect updates
  const prevBestNoteRef = useRef(bestNote);

  useEffect(() => {
    // Check if bestNote has increased and crossed the 90% threshold
    if (bestNote > 90 && bestNote > prevBestNoteRef.current) {
      toast.success(`Level Up! New Best Note: ${bestNote.toFixed(1)}%`, {
        description: "You've unlocked a new level of vocal mastery!",
        duration: 5000,
      });
    }
    // Update ref for the next render
    prevBestNoteRef.current = bestNote;
  }, [bestNote]);

  // Calculate progress (assuming max level is 10 for a simple visual)
  const maxLevel = 10;
  const progressValue = (academyLevel / maxLevel) * 100;

  const statItem = (label: string, value: string | number, Icon: React.ElementType) => (
    <div className="flex items-center justify-between p-2 bg-card/50 rounded-lg border border-border/50 transition-colors hover:bg-card/70">
      <div className="flex items-center">
        <Icon className="h-4 w-4 mr-2 text-accent neon-gold-glow" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );

  // Default achievements for display if none are active
  const displayedAchievements = recentAchievements.length > 0 
    ? recentAchievements.map(key => achievementIcons[key] || { icon: Award, color: "text-gray-500" })
    : [
        { icon: Award, color: "text-yellow-400" },
        { icon: Star, color: "text-primary" },
        { icon: Mic2, color: "text-red-500" },
      ];

  return (
    <Card className={cn(
      "rounded-2xl transition-all duration-300 w-full shadow-xl",
      "glass-pillar" // Ensures 1px neon blue border and backdrop blur
    )}>
      <CardContent className="p-6 space-y-4">
        
        {/* Avatar and Progress */}
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16">
            {/* Circular Progress Ring (Simulated) */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-border/50"
              style={{
                // This is a visual trick for a progress ring using conic gradient
                background: `conic-gradient(hsl(var(--primary)) ${progressValue}%, hsl(var(--border)/0.5) ${progressValue}%)`,
                padding: '4px', // Inner padding to make the ring visible
              }}
            >
              <Avatar className="h-full w-full">
                <AvatarImage src={avatarUrl || undefined} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">{userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-foreground neon-blue-glow">{userName}</h4>
            <p className="text-sm text-accent font-medium">Prime Member</p>
          </div>
        </div>

        {/* Real-time Diagnostic Tip */}
        {isAnalyzing && isPitchDeviating && (
          <div className="flex items-center p-3 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-sm font-medium animate-pulse">
            <AlertCircle className="h-4 w-4 mr-2" />
            Adjusting Pitch... (Deviation > 10%)
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2">
          {statItem("Melhor Nota", `${bestNote.toFixed(1)}%`, Zap)}
          {statItem("Nível Academy", academyLevel, GraduationCap)}
          {statItem("Ranking Online", rankingOnline, Trophy)}
          {statItem("Ranking Offline", rankingOffline, Trophy)}
        </div>

        {/* Recent Achievements */}
        <div className="pt-2 border-t border-border/50">
          <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Recent Achievements</h5>
          <div className="flex space-x-3">
            {displayedAchievements.map((ach, index) => {
              const Icon = ach.icon;
              return (
                <div key={index} className={cn(
                  "p-2 rounded-full bg-card/70 border border-border/50 shadow-md",
                  "transition-transform hover:scale-110"
                )}>
                  <Icon className={cn("h-5 w-5", ach.color, "amazon-gold-glow")} />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;