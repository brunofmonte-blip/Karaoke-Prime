import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap, GraduationCap } from 'lucide-react';

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
  const statItem = (label: string, value: string | number, Icon: React.ElementType) => (
    <div className="flex items-center justify-between p-2 bg-card/50 rounded-lg border border-border/50">
      <div className="flex items-center">
        <Icon className="h-4 w-4 mr-2 text-accent neon-gold-glow" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );

  return (
    <Card className={cn(
      "rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-300 w-full",
      "bg-card/10 shadow-xl border-neon-glow"
    )}
    style={{
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 168, 225, 0.3)' 
    }}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-accent shadow-lg shadow-accent/50">
            <AvatarImage src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop"} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xl font-bold text-foreground neon-blue-glow">{userName}</h4>
            <p className="text-sm text-accent font-medium">Prime Member</p>
          </div>
        </div>

        <div className="space-y-2">
          {statItem("Melhor Nota", `${bestNote}%`, Zap)}
          {statItem("Nível Academy", academyLevel, GraduationCap)}
          {statItem("Ranking Online", rankingOnline, Trophy)}
          {statItem("Ranking Offline", rankingOffline, Trophy)}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;