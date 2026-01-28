import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, GraduationCap, Award, Star, Mic2 } from 'lucide-react';

interface UserProfileCardProps {
  userName: string;
  avatarUrl?: string;
  bestNote: number;
  academyLevel: number;
  rankingOnline: number;
  rankingOffline: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userName,
  avatarUrl,
  bestNote,
  academyLevel,
  rankingOnline,
  rankingOffline,
}) => {
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

  const achievements = [
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
                <AvatarImage src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop"} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">{userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-foreground neon-blue-glow">{userName}</h4>
            <p className="text-sm text-accent font-medium">Prime Member</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          {statItem("Melhor Nota", `${bestNote}%`, Zap)}
          {statItem("Nível Academy", academyLevel, GraduationCap)}
          {statItem("Ranking Online", rankingOnline, Trophy)}
          {statItem("Ranking Offline", rankingOffline, Trophy)}
        </div>

        {/* Recent Achievements */}
        <div className="pt-2 border-t border-border/50">
          <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Recent Achievements</h5>
          <div className="flex space-x-3">
            {achievements.map((ach, index) => {
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