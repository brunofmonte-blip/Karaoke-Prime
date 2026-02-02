import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Lock, Zap, Shield, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrimeSubscription } from '@/hooks/use-prime-subscription';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';

interface Tier {
  name: 'Silver' | 'Gold' | 'Platinum';
  price: string;
  features: string[];
  icon: React.ElementType;
  color: string;
}

const tiers: Tier[] = [
  {
    name: 'Silver',
    price: '$9.99/mo',
    features: ['Ad-free experience', 'HD Audio Quality', 'Basic Vocal Diagnostics'],
    icon: Shield,
    color: 'text-gray-400',
  },
  {
    name: 'Gold',
    price: '$19.99/mo',
    features: ['All Silver features', 'Advanced AI Pitch Correction', 'Priority Ranking Access', 'Exclusive Backstage Content'],
    icon: Zap,
    color: 'text-accent', // Prime Gold
  },
  {
    name: 'Platinum',
    price: '$29.99/mo',
    features: ['All Gold features', 'Private 1-on-1 AI Coaching', 'Global Talent Scouting Priority', 'Lifetime Achievement Badge'],
    icon: Crown,
    color: 'text-primary', // Neon Blue
  },
];

const PrimeSubscriptionModal: React.FC = () => {
  const { isModalOpen, closeModal, handleUpgrade, isProcessing } = usePrimeSubscription();
  const { data: profile } = useUserProfile();
  const isPrime = profile?.is_prime;

  const handleSelectTier = (tierName: Tier['name']) => {
    if (isPrime) {
      // In a real app, this would handle tier change/cancellation
      return;
    }
    handleUpgrade(tierName);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className={cn(
        "sm:max-w-3xl w-full rounded-3xl border-2 border-primary/70 shadow-2xl p-6 md:p-8",
        "glass-pillar bg-card/80 backdrop-blur-xl"
      )}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-primary neon-blue-glow">
            Unlock Karaoke Prime Success
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            Choose your path to vocal mastery and global recognition.
          </p>
        </DialogHeader>
        
        {isPrime && (
          <div className="text-center p-4 bg-accent/10 border border-accent/50 rounded-xl">
            <p className="text-accent font-semibold flex items-center justify-center">
              <Check className="h-5 w-5 mr-2" />
              You are currently a Prime Member!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={cn(
                "p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col",
                "bg-card/50 hover:bg-card/70",
                tier.name === 'Gold' ? 'border-accent shadow-lg shadow-accent/30' : 'border-border/50'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("text-2xl font-bold", tier.color, tier.name === 'Gold' && 'neon-gold-glow')}>
                  {tier.name}
                </h3>
                <tier.icon className={cn("h-6 w-6", tier.color)} />
              </div>
              
              <p className="text-3xl font-extrabold text-foreground mb-4">{tier.price}</p>
              
              <ul className="space-y-2 text-sm flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-muted-foreground">
                    <Check className="h-4 w-4 mr-2 flex-shrink-0 text-primary mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectTier(tier.name)}
                disabled={isProcessing || isPrime}
                className={cn(
                  "mt-6 w-full rounded-xl font-semibold",
                  tier.name === 'Gold' 
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/40'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isPrime ? 'Current Plan' : `Get ${tier.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-sm text-green-400 font-medium flex items-center justify-center">
            <Lock className="h-4 w-4 mr-2 text-green-400 amazon-gold-glow" />
            End-to-End Encryption Active: Secure Checkout
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your financial data is tokenized and never stored on our servers (PCI-DSS Compliant Mock).
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrimeSubscriptionModal;