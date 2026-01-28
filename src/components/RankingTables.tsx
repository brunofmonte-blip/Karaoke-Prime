import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface RankingItem {
  id: number;
  userName: string;
  song: string;
  score: number;
  avatarUrl: string;
}

const globalRankings: RankingItem[] = [
  { id: 1, userName: "VocalPro_88", song: "Bohemian Rhapsody", score: 98.5, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop" },
  { id: 2, userName: "SingStar_JP", song: "A Cruel Angel's Thesis", score: 97.9, avatarUrl: "https://images.unsplash.com/photo-1506794778202-dfa5599898e8?q=80&w=500&auto=format&fit=crop" },
  { id: 3, userName: "EuroBeat", song: "Take On Me", score: 97.1, avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop" },
  { id: 4, userName: "AnyaSharma", song: "Pop Anthem 2024", score: 96.8, avatarUrl: "https://images.unsplash.com/photo-1529626465619-b7fa4299a557?q=80&w=500&auto=format&fit=crop" },
  { id: 5, userName: "TheVoice_BR", song: "Garota de Ipanema", score: 96.5, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" },
];

const nationalRankings: RankingItem[] = [
  { id: 1, userName: "LocalHero_NY", song: "Empire State of Mind", score: 95.2, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop" },
  { id: 2, userName: "TexasTenor", song: "Country Roads", score: 94.8, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a812d6ce89d?q=80&w=500&auto=format&fit=crop" },
  { id: 3, userName: "CaliSinger", song: "Hotel California", score: 94.1, avatarUrl: "https://images.unsplash.com/photo-1508214751196-c93f455b1200?q=80&w=500&auto=format&fit=crop" },
];

const localRankings: RankingItem[] = [
  { id: 1, userName: "DowntownDiva", song: "Shallow", score: 93.5, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop" },
  { id: 2, userName: "BaritoneBob", song: "Fly Me to the Moon", score: 92.9, avatarUrl: "https://images.unsplash.com/photo-1542909168-82c72e8906da?q=80&w=500&auto=format&fit=crop" },
];

interface RankingListProps {
  title: string;
  data: RankingItem[];
  colorClass: string;
}

const RankingList: React.FC<RankingListProps> = ({ title, data, colorClass }) => (
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
          {data.map((item, index) => (
            <TableRow key={item.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
              <TableCell className="w-10 text-center font-bold text-muted-foreground p-2">
                {index + 1}
              </TableCell>
              <TableCell className="flex items-center space-x-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.avatarUrl} alt={item.userName} />
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
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const RankingTables: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RankingList 
        title="Global Top 5" 
        data={globalRankings} 
        colorClass="text-primary neon-blue-glow" 
      />
      <RankingList 
        title="National Top 3" 
        data={nationalRankings} 
        colorClass="text-accent neon-gold-glow" 
      />
      <RankingList 
        title="Local Top 2" 
        data={localRankings} 
        colorClass="text-foreground" 
      />
    </div>
  );
};

export default RankingTables;