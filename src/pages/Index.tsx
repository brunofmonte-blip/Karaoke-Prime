import { Button } from "@/components/ui/button";
import { Mic, Zap, GraduationCap, Shield, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black">
    {/* Immersive Concert Stage Background - High Contrast */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30 scale-110 transition-transform duration-1000"
      style={{ 
        backgroundPosition: 'center 30%',
        // Combining the required gradients and image path
        backgroundImage: `
          radial-gradient(circle at center, transparent 20%, rgba(5,5,5,0.9) 80%),
          linear-gradient(to bottom, rgba(5,5,5,0.2), #050505), 
          url('/stage-background.jpg')
        `
      }}
    ></div>
    
    {/* Golden Volumetric Lighting Effect (Converging Spotlights) */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Central Neon Blue Glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/40 rounded-full filter blur-[180px] opacity-50 animate-pulse z-0"></div>
    </div>

    <div className="relative z-20 text-center p-4">
      <div className="flex flex-col items-center justify-center mb-4">
        {/* Logo & Branding: Prime Gold Arrow and Neon Text */}
        <div className="drop-shadow-[0_0_15px_#00A8E1]">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white neon-blue-glow">
            Karaoke 
            <span className="text-accent neon-gold-glow ml-4 relative inline-block">
              Prime
              {/* Amazon Smile Arrow positioned under Prime */}
              <AmazonSmileLogo className="absolute -bottom-4 left-0 h-4 w-full" />
            </span>
          </h1>
        </div>
      </div>
      
      <p className="text-xl md:text-3xl text-muted-foreground mb-8 font-light italic mt-4">
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
          Explore Academy <Mic className="ml-2 h-5 w-5" />
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

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-500",
    "bg-background/30 hover:bg-background/50", // Semi-transparent Obsidian background
    "shadow-xl border-neon-glow", // Neon Blue border glow
    "cursor-pointer hover:scale-[1.03]"
  )}
  style={{
    // Applying explicit glassmorphism styles as requested
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(0, 168, 225, 0.5)' // Using the primary color (Neon Blue) in RGBA
  }}
  >
    <Icon className="h-8 w-8 mb-4 text-primary icon-neon-glow" />
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
        <h2 className="text-4xl font-bold text-center mb-12 text-primary neon-blue-glow">The Elite Pillars of Prime</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ElitePillarCard 
            title="Basic: Hybrid Mode" 
            description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
            icon={Mic} 
          />
          <ElitePillarCard 
            title="Academy (Conservatory)" 
            description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
            icon={GraduationCap} 
          />
          <ElitePillarCard 
            title="Amazon Next Talent" 
            description="10-level gamified auditions, progressing from local to global online stages." 
            icon={Rocket} 
          />
          <ElitePillarCard 
            title="Amazon Backstage" 
            description="Premium UI locked behind social verification and a Pro-Vocal test." 
            icon={Shield} 
          />
          <ElitePillarCard 
            title="Next Success" 
            description="Generative AI portal for creating original lyrics and melodies (Suno-style)." 
            icon={Zap} 
          />
        </div>
        
        {/* Global Hotspots Carousel (Ensuring it's immediately below the pillars) */}
        <div className="mt-16">
          <GlobalHotspotsCarousel />
        </div>

        {/* Global Ranking & Discovery Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow">Global Prime Rankings</h2>
          <div className="bg-card/70 p-8 rounded-2xl border border-border/50 backdrop-blur-md">
            <p className="text-center text-muted-foreground">
              [Placeholder for Geo-Targeted Ranking Tables]
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Index;