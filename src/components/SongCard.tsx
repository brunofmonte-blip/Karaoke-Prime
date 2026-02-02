import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, PlayCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicDomainSong } from '@/data/public-domain-library';
import { useOfflineDownload } from '@/hooks/use-offline-download';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useDuel } from '@/hooks/use-duel-engine';

interface SongCardProps {
  song: PublicDomainSong;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { isDownloaded, isDownloading, toggleDownload } = useOfflineDownload(song);
  const { openOverlay, loadSong } = useVocalSandbox(); 
  const { startLocalDuel } = useDuel();

  const handlePlay = () => {
    loadSong(song.id); // Load the specific song
    openOverlay(); 
  };
  
  const handleDuel = () => {
    startLocalDuel(song);
    openOverlay();
  };

  return (
    <Card className={cn(
      "rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300",
      "bg-card/50 backdrop-blur-md hover:border-primary hover:shadow-primary/50 shadow-lg"
    )}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-primary truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{song.artist}</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handlePlay}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-md shadow-accent/30"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Sing Now
          </Button>
          
          <Button 
            onClick={handleDuel}
            variant="outline"
            className="w-full rounded-lg border-primary/50 text-primary hover:bg-primary/10"
          >
            <Users className="h-4 w-4 mr-2" />
            Start Duel
          </Button>
          
          <Button 
            onClick={toggleDownload}
            disabled={isDownloading}
            variant="outline"
            className={cn(
              "w-full rounded-lg transition-colors",
              isDownloaded ? "border-green-500 text-green-500 hover:bg-green-500/10" : "border-border/50 text-muted-foreground hover:bg-secondary/10"
            )}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isDownloaded ? 'Removing...' : 'Downloading...'}
              </>
            ) : isDownloaded ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Offline Ready
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download for Offline
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;