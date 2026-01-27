import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Mic, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black">
    {/* Immersive Concert Stage Background Placeholder */}
    <div className="absolute inset-0 bg-[url('/public/placeholder.svg')] bg-cover bg-center opacity-10 blur-sm scale-110"></div>
    
    {/* Golden Volumetric Lighting Effect (Simulated) */}
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/90 z-10"></div>
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/30 rounded-full filter blur-[150px] opacity-50 animate-pulse z-0"></div>

    <div className="relative z-20 text-center p-4">
      <div className="flex items-center justify-center mb-4">
        <Crown className="h-12 w-12 text-accent fill-accent mr-2" />
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-lg">
          Karaoke <span className="text-primary">Prime</span>
        </h1>
      </div>
      
      <p className="text-xl md:text-3xl text-muted-foreground mb-8 font-light italic">
        Your stage. Your legacy.
      </p>

      <div className="flex justify-center space-x-4">
        <Button 
          size="lg" 
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "shadow-lg shadow-primary/50 transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
          )}
        >
          Start Your Duel <Mic className="ml-2 h-5 w-5" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className={cn(
            "border-accent text-accent hover:bg-accent/10",
            "rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          )}
        >
          Explore Academy <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      {/* Last Duel Winner Display */}
      <div className="mt-12 text-sm text-muted-foreground/80">
        <p className="inline-flex items-center bg-secondary/50 p-2 rounded-full backdrop-blur-sm border border-border/50">
          <Zap className="h-4 w-4 text-accent mr-2" />
          Last Duel Winner: <span className="text-accent font-semibold ml-1">VocalLegend99</span> from Tokyo
        </p>
      </div>
    </div>
  </div>
);

const ElitePillarCard = ({ title, description, icon: Icon, color }: { title: string, description: string, icon: React.ElementType, color: string }) => (
  <div className={cn(
    "p-6 rounded-2xl border border-border/50 backdrop-blur-md transition-all duration-500 hover:shadow-2xl",
    "bg-card/70 hover:bg-card/90",
    `hover:border-[${color}]`
  )}>
    <Icon className={`h-8 w-8 mb-4 ${color}`} />
    <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const Index = () => {
  return (
    <div className="w-full">
      <HeroSection />

      <div className="container mx-auto py-16 px-4 md:px-6">
        
        {/* The 5 Elite Pillars Section */}
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">The Elite Pillars of Prime</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ElitePillarCard 
            title="Basic: Hybrid Mode" 
            description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
            icon={Mic} 
            color="text-primary"
          />
          <ElitePillarCard 
            title="Academy (Conservatory)" 
            description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
            icon={Crown} 
            color="text-accent"
          />
          <ElitePillarCard 
            title="Amazon Next Talent" 
            description="10-level gamified auditions, progressing from local to global online stages." 
            icon={Zap} 
            color="text-primary"
          />
          <ElitePillarCard 
            title="Amazon Backstage" 
            description="Premium UI locked behind social verification and a Pro-Vocal test." 
            icon={Crown} 
            color="text-accent"
          />
          <ElitePillarCard 
            title="Next Success" 
            description="Generative AI portal for creating original lyrics and melodies (Suno-style)." 
            icon={Mic} 
            color="text-primary"
          />
        </div>
        
        {/* Global Ranking & Discovery Placeholder */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary">Global Prime Rankings</h2>
          <div className="bg-card/70 p-8 rounded-2xl border border-border/50">
            <p className="text-center text-muted-foreground">
              [Placeholder for Geo-Targeted Ranking Tables and Discovery Rows]
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Index;