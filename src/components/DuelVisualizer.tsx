import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, LineChart, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DuelVisualizer: React.FC = () => {
  return (
    <Card className={cn(
      "w-full p-4 rounded-2xl shadow-xl h-[300px] flex flex-col items-center justify-center",
      "glass-pillar border-2 border-accent/50"
    )}>
      <CardHeader className="p-0 pb-4 text-center">
        <CardTitle className="text-2xl font-bold text-accent neon-gold-glow flex items-center justify-center">
          <Users className="h-6 w-6 mr-2" />
          Local Duel Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <LineChart className="h-12 w-12 mx-auto mb-2 text-primary/50" />
        <p className="text-sm mb-4">
          Challenge a friend or the AI opponent in a turn-based vocal battle. Results sync automatically.
        </p>
        <Link to="/library">
          <Button 
            variant="outline"
            className="bg-accent/10 text-accent hover:bg-accent/20 rounded-xl border-accent/50"
          >
            Start a Duel Now
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default DuelVisualizer;