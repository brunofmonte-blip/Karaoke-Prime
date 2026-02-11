import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { allBadges, Badge } from '@/data/badges';
import { Crown } from 'lucide-react';

// Mock sound effect function
const playSuccessSound = () => {
  console.log("Playing high-fidelity success sound effect!");
};

const BadgeUnlockedModal: React.FC = () => {
  const { unlockedBadges, clearUnlockedBadges } = useVocalSandbox();
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const [queue, setQueue] = useState<Badge[]>([]);
  const isOpen = !!currentBadge;

  // Effect to manage the badge queue and display sequence
  useEffect(() => {
    if (unlockedBadges.length > 0) {
      const newBadges = unlockedBadges.map(id => allBadges.find(b => b.id === id)).filter((b): b is Badge => !!b);
      setQueue(prev => [...prev, ...newBadges]);
      clearUnlockedBadges(); // Clear the source state immediately
    }
  }, [unlockedBadges, clearUnlockedBadges]);

  // Effect to process the queue
  useEffect(() => {
    if (queue.length > 0 && !currentBadge) {
      const [nextBadge, ...rest] = queue;
      setCurrentBadge(nextBadge);
      setQueue(rest);
      playSuccessSound();
      
      // Automatically close the modal after 4 seconds
      const timer = setTimeout(() => {
        setCurrentBadge(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [queue, currentBadge]);

  if (!isOpen || !currentBadge) {
    return null;
  }
  
  const Icon = currentBadge.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => setCurrentBadge(null)}>
      <DialogContent className={cn(
        "sm:max-w-md w-full rounded-3xl border-2 border-accent/70 shadow-2xl p-8 text-center",
        "glass-pillar bg-card/80 backdrop-blur-xl animate-in fade-in duration-500 zoom-in-95"
      )}>
        <div className="relative">
          {/* Confetti/Glow Effect */}
          <div className="absolute inset-0 -m-4 rounded-full bg-accent/50 filter blur-2xl opacity-70 animate-pulse"></div>
          
          <Crown className="h-16 w-16 text-accent mx-auto mb-4 relative z-10 amazon-gold-glow animate-bounce" />
          
          <h1 className="text-3xl font-extrabold text-accent neon-gold-glow mb-2 relative z-10">
            BADGE DESBLOQUEADO!
          </h1>
          
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className={cn(
              "p-4 rounded-full border-4 border-accent/80 bg-card/90 shadow-inner shadow-accent/50",
              "transition-transform duration-500 scale-100 hover:scale-105"
            )}>
              <Icon className={cn("h-10 w-10", currentBadge.color, "amazon-gold-glow")} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-3">{currentBadge.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{currentBadge.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeUnlockedModal;