import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface HeroCtaButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

const HeroCtaButton: React.FC<HeroCtaButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button 
      variant="outline" 
      size="lg"
      className={cn(
        "bg-transparent text-white hover:bg-primary/10 rounded-xl px-8 py-6 text-lg font-semibold h-auto",
        "border-2 border-primary/70 transition-all duration-300",
        "shadow-lg shadow-primary/50 hover:shadow-primary/80",
        "neon-blue-border-glow", // Custom class for the border glow
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default HeroCtaButton;