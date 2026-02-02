import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useGlobalRankings, RankingItem } from '@/hooks/use-global-rankings';
import { useAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';

// Mock data for National and Local rankings (since we only fetch global profiles)
const nationalRankingsMock: RankingItem[] = [
  { userId: 'mock-n1', userName: "LocalHero_NY", song: "Empire State of Mind", score: 95.2, avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-n2', userName: "TexasTenor", song: "Country Roads", score: 94.8, avatar_url: "https://images.unsplash.com/photo-1507003211169-0a812d6ce89d?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-n3', userName: "CaliSinger", song: "Hotel California", score: 94.1, avatar_url: "https://images.unsplash.com/photo-1508214751196-c93f455b1200?q=80&w=500&auto=format&fit=crop" },
];

const localRankingsMock: RankingItem[] = [
  { userId: 'mock-l1', userName: "DowntownDiva", song: "Shallow", score: 93.5, avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop" },
  { userId: 'mock-l2', userName: "BaritoneBob", song: "Fly Me to the Moon", score: 92.9, avatar_url: "https://images.unsplash.com/photo-1542909168-82c72e8906da?q=80&w=500&auto=format&fit=crop" },
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

    // Check for rank jump (only if user was previously ranked and improved)
    if (prevRank !== -1 && currentRank !== -1 && currentRank < prevRank) {
      toast.success(`Rank Jump! You moved up to position #${currentRank + 1}!`, {
        duration: 4000,
        description: "Your new best note boosted your global standing.",
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
              const avatarUrl = item.avatar_url || user?.user_metadata.avatar_url;
              
              return (
                <TableRow 
                  key={item.userId} 
                  className={cn(
                    "border-b border-border/30 transition-colors",
                    isCurrentUser 
                      ? "bg-primary/10 hover:bg-primary/20 border-primary/50 shadow-inner shadow-primary/50" 
                      : "hover:bg-secondary/20"
                  )}
                >
                  <TableCell className="w-10 text-center font-bold text-muted-foreground p-2">
                    {index + 1}
                  </TableCell>
                  <TableCell className="flex items-center space-x-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || undefined} alt={item.userName} />
                      <AvatarFallback>{item.userName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground truncate max-w-[100px]">{item.userName}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">{item.song}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-lg p-2 text-accent">
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
  
  // Filter global rankings to top 5 for display
  const topGlobalRankings = globalRankings.slice(0, 5);

  if (isGlobalLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 text-center p-10 text-primary neon-blue-glow">
          Loading Global Rankings...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RankingList 
        title="Global Top 5" 
        data={topGlobalRankings} 
        colorClass="text-primary neon-blue-glow" 
        isGlobal={true}
      />
      <RankingList 
        title="National Top 3 (Mock)" 
        data={nationalRankingsMock} 
        colorClass="text-accent neon-gold-glow" 
        isGlobal={false}
      />
      <RankingList 
        title="Local Top 2 (Mock)" 
        data={localRankingsMock} 
        colorClass="text-foreground" 
        isGlobal={false}
      />
    </div>
  );
};

export default RankingTables;