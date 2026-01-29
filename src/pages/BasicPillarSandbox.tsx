import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music } from 'lucide-react';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Define the structure for chart data points
interface ChartDataItem {
  name: string;
  pitch: number;
  breath: number;
}

const MAX_HISTORY = 50; // Max data points to show in the real-time chart

const BasicPillarSandbox: React.FC = () => {
  const { isAnalyzing, startAnalysis, stopAnalysis, pitchData } = useAudioAnalyzer();
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const [currentSong, setCurrentSong] = useState(publicDomainLibrary[0]);
  const historyCounter = useRef(0);

  // Effect to update pitch history in real-time
  useEffect(() => {
    if (isAnalyzing && pitchData !== undefined) {
      setPitchHistory(prevHistory => {
        historyCounter.current += 1;
        const newPoint: ChartDataItem = {
          name: `T${historyCounter.current}`,
          pitch: pitchData,
          breath: 50, // Placeholder for breath data
        };
        
        const newHistory = [...prevHistory, newPoint];
        
        // Keep history size limited
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        return newHistory;
      });
    }
  }, [pitchData, isAnalyzing]);

  const handleStart = () => {
    setPitchHistory([]); // Clear history on start
    historyCounter.current = 0;
    startAnalysis();
  };

  const handleStop = () => {
    stopAnalysis();
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-8 text-center">
        Basic Pillar: Live Vocal Sandbox
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Control Panel */}
        <Card className={cn("lg:col-span-1 glass-pillar h-fit")}>
          <CardHeader>
            <CardTitle className="text-accent neon-gold-glow">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleStart} 
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Singing
              </Button>
              <Button 
                onClick={handleStop} 
                disabled={!isAnalyzing}
                variant="destructive"
                className="rounded-xl shadow-lg shadow-destructive/30"
              >
                <StopCircle className="h-5 w-5 mr-2" />
                Stop Analysis
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">Current Track</h3>
              <p className="text-sm text-primary font-medium flex items-center">
                <Music className="h-4 w-4 mr-2" />
                {currentSong.title} by {currentSong.artist}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Note: This is a royalty-free track placeholder.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Chart Visualization */}
        <div className="lg:col-span-2 h-[400px]">
          <VocalEvolutionChart 
            title={`Real-time Pitch Accuracy: ${pitchData.toFixed(1)}%`} 
            data={pitchHistory} 
            height="100%"
          />
        </div>
      </div>
      
      {/* Lyrics Display (Placeholder) */}
      <Card className={cn("mt-8 glass-pillar")}>
        <CardHeader>
          <CardTitle className="text-primary">Live Lyrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-medium text-foreground/80 italic">
            {currentSong.lyrics[0].text} (Placeholder lyrics display)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicPillarSandbox;