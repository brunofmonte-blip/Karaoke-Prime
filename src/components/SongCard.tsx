import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, PlayCircle, Users, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicDomainSong } from '@/data/public-domain-library';
import { useOfflineDownload } from '@/hooks/use-offline-download';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useDuel } from '@/hooks/use-duel-engine';

interface SongCardProps {
  song: PublicDomainSong;
}

const difficultyColors: Record<PublicDomainSong['difficulty'], string> = {
  Easy: 'bg-green-600/20 text-green-400 border-green-600/50',
  Medium: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
  Hard: 'bg-red-600/20 text-red-400 border-red-600/50',
};

const academyRecommendations: Record<PublicDomainSong['difficulty'], string> = {
  Easy: 'Level 1-3: Foundation',
  Medium: 'Level 4-7: Intermediate',
  Hard: 'Level 8-10: Pro-Vocal',
};

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { isDownloaded, isDownloading, toggleDownload } = useOfflineDownload(song);
  const { openOverlay, startAnalysis } = useVocalSandbox(); 
  const { startLocalDuel } = useDuel();

  const handlePlay = () => {
    startAnalysis(song, false);
    openOverlay(); 
  };
  
  const handleDuel = () => {
    startLocalDuel(song);
  };

  return (
    <Card className={cn(
      "rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300 flex flex-col h-full",
      "bg-card/50 backdrop-blur-md hover:border-primary hover:shadow-primary/50 shadow-lg"
    )}>
      <div 
        className="h-32 bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${song.imageUrl})` }}
      >
        {/* Difficulty Badge */}
        <div className={cn(
          "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tighter",
          difficultyColors[song.difficulty]
        )}>
          {song.difficulty}
        </div>
        
        {/* Academy Recommendation Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1 flex items-center justify-center gap-1">
          <GraduationCap className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-medium text-accent uppercase tracking-tighter">
            {academyRecommendations[song.difficulty]}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-primary truncate leading-tight">{song.title}</h3>
          <p className="text-xs text-muted-foreground mb-3 truncate">{song.artist}</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handlePlay}
            size="sm"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-md shadow-accent/30 h-9"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Sing Now
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleDuel}
              variant="outline"
              size="sm"
              className="rounded-lg border-primary/50 text-primary hover:bg-primary/10 h-9 px-1"
            >
              <Users className="h-3 w-3 mr-1" />
              Duel
            </Button>
            
            <Button 
              onClick={toggleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-lg transition-colors h-9 px-1",
                isDownloaded ? "border-green-500 text-green-500 hover:bg-green-500/10" : "border-border/50 text-muted-foreground hover:bg-secondary/10"
              )}
            >
              {isDownloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isDownloaded ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Download className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;