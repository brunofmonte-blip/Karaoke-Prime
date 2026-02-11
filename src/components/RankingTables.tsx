import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useGlobalRankings, RankingItem } from '@/hooks/use-global-rankings';
import { useAuth } from '@/integrations/supabase/auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';

// Mock data for National and Local rankings
const nationalRankingsMock: RankingItem[] = [
  { userId: 'mock-n1', userName: "LocalHero_NY", song: "Empire State of Mind", score: 95.2, avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-n2', userName: "TexasTenor", song: "Country Roads", score: 94.8, avatar_url: "https://images.unsplash.com/photo-1507003211169-0a812d6ce89d?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-n3', userName: "CaliSinger", song: "Hotel California", score: 94.1, avatar_url: "https://images.unsplash.com/photo-1508214751196-c93f455b1200?q=80&w=500&auto=format&fit=crop" },
];

const localRankingsMock: RankingItem[] = [
  { userId: 'mock-l1', userName: "DowntownDiva", song: "Shallow", score: 93.5, avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-l2', userName: "BaritoneBob", song: "Fly Me to the Moon", score: 92.9, avatar_url: "https://images.unsplash.com/photo-1542909168-82c72e8906da?q=80&w=500&auto=format&fit=crop" },
];

const globalRankingsFallback: RankingItem[] = [
  { userId: 'mock-g1', userName: "VocalPro_88", song: "The High Note", score: 98.5, avatar_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500" },
  { userId: 'mock-g2', userName: "SingStar_JP", song: "Tokyo Drift Anthem", score: 97.1, avatar_url: "https://images.unsplash.com/photo-1519732773401-d92c7293764c?q=80&w=500" },
  { userId: 'mock-g3', userName: "OperaQueen", song: "Nessun Dorma", score: 96.9, avatar_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500" },
];

interface RankingListProps {
  title: string;
  data: RankingItem[];
  colorClass: string;
  isGlobal: boolean;
}

const RankingList: React.FC<RankingListProps> = ({ title, data, colorClass, isGlobal }) => {
  const { user } = useAuth();
  const prevDataRef = useRef(data);

  useEffect(() => {
    if (!user || !isGlobal) return;

    const currentUserId = user.id;
    const prevRank = prevDataRef.current.findIndex(item => item.userId === currentUserId);
    const currentRank = data.findIndex(item => item.userId === currentUserId);

    if (prevRank !== -1 && currentRank !== -1 && currentRank < prevRank) {
      toast.success(`Salto no Ranking! Você subiu para a posição #${currentRank + 1}!`, {
        duration: 4000,
        description: "Sua nova melhor nota impulsionou sua classificação global.",
      });
    }

    prevDataRef.current = data;
  }, [data, user, isGlobal]);

  return (
    <Card className={cn(
      "rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-md shadow-lg h-full",
      "transition-all duration-300 hover:border-primary/70"
    )}>
      <CardHeader className="p-4 border-b border-border/50">
        <CardTitle className={cn("text-xl font-bold text-center", colorClass)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {data.map((item, index) => {
              const isCurrentUser = user && item.userId === user.id;
              
              return (
                <TableRow 
                  key={item.userId} 
                  className={cn(
                    "border-b border-border/30 transition-all duration-500",
                    isCurrentUser 
                      ? "bg-primary/20 border-2 border-primary shadow-[0_0_15px_rgba(0,168,225,0.4)] scale-[1.02] z-10 relative" 
                      : "hover:bg-secondary/20"
                  )}
                >
                  <TableCell className="w-10 text-center font-bold text-muted-foreground p-2">
                    {index + 1}
                  </TableCell>
                  <TableCell className="flex items-center space-x-3 p-2">
                    <Avatar className={cn(
                      "h-8 w-8 border",
                      isCurrentUser ? "border-primary shadow-sm shadow-primary/50" : "border-border/50"
                    )}>
                      <AvatarImage src={item.avatar_url || undefined} alt={item.userName} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">{item.userName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-medium truncate max-w-[100px]",
                        isCurrentUser ? "text-primary font-bold neon-blue-glow" : "text-foreground"
                      )}>
                        {item.userName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">{item.song}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-extrabold text-lg p-2",
                    isCurrentUser ? "text-primary neon-blue-glow" : "text-accent"
                  )}>
                    {item.score.toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const RankingTables: React.FC = () => {
  const { data: globalRankings, isLoading: isGlobalLoading } = useGlobalRankings();
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  
  // Merge real data with fallback and ensure current user is included
  const effectiveGlobalRankings = React.useMemo(() => {
    let list = [...(globalRankings || [])];
    
    // If list is empty, use fallback
    if (list.length === 0) {
      list = [...globalRankingsFallback];
    }

    // Ensure current user is in the list if they have a score
    if (user && profile && profile.best_note > 0) {
      const userInList = list.find(item => item.userId === user.id);
      if (!userInList) {
        list.push({
          userId: user.id,
          userName: profile.username || user.email?.split('@')[0] || "Você",
          avatar_url: profile.avatar_url || user.user_metadata.avatar_url,
          score: profile.best_note,
          song: "Última Performance",
        });
      }
    }

    // Sort by score descending
    return list.sort((a, b) => b.score - a.score);
  }, [globalRankings, profile, user]);

  // Inject user into National Mock for visual proof
  const effectiveNationalRankings = React.useMemo(() => {
    let list = [...nationalRankingsMock];
    if (user && profile && profile.best_note > 0) {
      list.push({
        userId: user.id,
        userName: profile.username || "Você",
        avatar_url: profile.avatar_url || user.user_metadata.avatar_url,
        score: profile.best_note,
        song: "Última Performance",
      });
    }
    return list.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [profile, user]);

  if (isGlobalLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 text-center p-10 text-primary neon-blue-glow">
          Carregando Rankings Globais...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RankingList 
        title="Global Top 5" 
        data={effectiveGlobalRankings.slice(0, 5)} 
        colorClass="text-primary neon-blue-glow" 
        isGlobal={true}
      />
      <RankingList 
        title="Nacional Top 3" 
        data={effectiveNationalRankings} 
        colorClass="text-accent neon-gold-glow" 
        isGlobal={false}
      />
      <RankingList 
        title="Local Top 2" 
        data={localRankingsMock} 
        colorClass="text-foreground" 
        isGlobal={false}
      />
    </div>
  );
};

export default RankingTables;