import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const DuelVisualizer: React.FC = () => {
  return (
    <Card className={cn(
      "w-full p-4 rounded-2xl shadow-xl h-[300px] flex flex-col items-center justify-center",
      "glass-pillar border-2 border-accent/50"
    )}>
      <CardHeader className="p-0 pb-4 text-center">
        <CardTitle className="text-2xl font-bold text-accent neon-gold-glow flex items-center justify-center">
          <Users className="h-6 w-6 mr-2" />
          Duelo Mode (Coming Soon)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <LineChart className="h-12 w-12 mx-auto mb-2 text-primary/50" />
        <p className="text-sm">
          Prepare for split-screen pitch comparison against friends or AI opponents.
        </p>
        <p className="text-xs mt-1 text-primary">
          Requires Academy Level 3 to unlock.
        </p>
      </CardContent>
    </Card>
  );
};

export default DuelVisualizer;