import React from 'react';
import { Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PillarLockedOverlayProps {
  title: string;
  requiredLevel: number;
  currentLevel: number;
  onClose: () => void;
}

const PillarLockedOverlay: React.FC<PillarLockedOverlayProps> = ({
  title,
  requiredLevel,
  currentLevel,
  onClose,
}) => {
  const progressValue = Math.min(100, (currentLevel / requiredLevel) * 100);
  const isLocked = currentLevel < requiredLevel;

  return (
    <div className="fixed inset-0 z-[110] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className={cn(
        "w-full max-w-lg p-8 rounded-3xl shadow-2xl text-center",
        "glass-pillar border-2 border-accent/70"
      )}>
        
        <Lock className="h-12 w-12 text-accent mx-auto mb-4 amazon-gold-glow" />
        
        <h1 className="text-3xl font-bold text-accent neon-gold-glow mb-2">
          {title} Access Locked
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          You need to reach Academy Level {requiredLevel} to unlock this feature.
        </p>

        {isLocked && (
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm font-medium text-foreground">
              <span>Current Level: {currentLevel}</span>
              <span>Target Level: {requiredLevel}</span>
            </div>
            <Progress value={progressValue} className="h-3 bg-primary/20" indicatorClassName="bg-primary shadow-lg shadow-primary/50" />
            <p className="text-xs text-muted-foreground">
              {progressValue.toFixed(0)}% progress towards unlocking {title}.
            </p>
          </div>
        )}

        <Button 
          onClick={onClose}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 shadow-lg shadow-primary/30"
        >
          Continue Academy Training
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PillarLockedOverlay;