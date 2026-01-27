import { Button } from "@/components/ui/button";
import { Award, Zap, GraduationCap, Star, Lock, Music, Trophy, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative h-[85vh] flex flex-col items-center justify-end overflow-hidden bg-black">
    {/* Immersive Concert Stage Background - High Contrast */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 transition-transform duration-1000"
      style={{ 
        backgroundPosition: 'center 30%',
        backgroundImage: `
          radial-gradient(circle, transparent 20%, rgba(5,5,5,0.9) 80%),
          url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop')
        `
      }}
    ></div>
    
    {/* Golden Volumetric Lighting Effect (Converging Spotlights) */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Central Neon Blue Glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/40 rounded-full filter blur-[180px] opacity-50 animate-pulse z-0"></div>
    </div>

    {/* Logo positioned in the lower third */}
    <div className="relative z-20 text-center p-4 mb-[15vh] flex flex-col items-center"> 
      <div className="flex flex-col items-center justify-center">
        {/* Main Logo: Karaoke Prime (NO SMILE ARROW HERE) */}
        <div className="drop-shadow-[0_0_15px_#00A8E1]">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white neon-blue-glow">
            Karaoke 
            <span id="prime-text" className="text-accent neon-gold-glow ml-4 relative inline-block">
              Prime
            </span>
          </h1>
        </div>
      </div>
      
      <p className="text-lg md:text-xl text-muted-foreground font-light italic mt-8 tracking-wider mb-8">
        Your Stage. Your Spotlight.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          size="lg"
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-semibold",
            "shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-[1.05] border-2 border-primary"
          )}
        >
          See live show
        </Button>
        <Button 
          size="lg"
          variant="outline"
          className={cn(
            "border-accent text-accent hover:bg-accent/10 rounded-full px-8 py-6 text-lg font-semibold",
            "shadow-2xl shadow-accent/30 transition-all duration-300 hover:scale-[1.05] border-2"
          )}
        >
          Explore Prime
        </Button>
      </div>
    </div>
  </div>
);

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-500 flex-shrink-0 w-[280px] relative", // Added relative for flag positioning
    "bg-card/10 hover:bg-card/20", // Subtle glass effect
    "shadow-xl border-neon-glow", // Neon Blue border glow
    "cursor-pointer hover:scale-[1.03]"
  )}
  style={{
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 168, 225, 0.3)' 
  }}
  >
    {/* Small Flag Icon */}
    <div className="absolute top-3 right-3 p-1 bg-black/50 rounded-full backdrop-blur-sm">
      <Flag className="h-4 w-4 text-accent neon-gold-glow" />
    </div>
    
    <Icon className="h-8 w-8 mb-4 text-primary icon-neon-glow" />
    <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const Index = () => {
  return (
    <div className="w-full relative">
      <HeroSection />

      <div className="container mx-auto px-0 md:px-6 relative z-30">
        
        {/* The 5 Elite Pillars Section - FLOATING OVERLAP */}
        <div className="w-full max-w-7xl mx-auto -mt-20 md:-mt-24 relative z-50"> 
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center md:overflow-x-hidden">
            <ElitePillarCard 
              title="Basic (Battle/Social)" 
              description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
              icon={Music} // Changed icon to Music
            />
            <ElitePillarCard 
              title="Academy (Conservatory)" 
              description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
              icon={GraduationCap} 
            />
            <ElitePillarCard 
              title="Amazon Next Talent" 
              description="10-level gamified auditions, progressing from local to global online stages." 
              icon={Star} 
            />
            <ElitePillarCard 
              title="Amazon Backstage" 
              description="Premium UI locked behind social verification and a Pro-Vocal test." 
              icon={Lock} 
            />
            <ElitePillarCard 
              title="Ranking Online" // Updated title
              description="Global ranking system based on performance, engagement, and academy level." 
              icon={Trophy} // Changed icon to Trophy
            />
          </div>
        </div>
        
        {/* Content below the Hero, starting immediately after the pillars */}
        <div className="pt-16 md:pt-24"> 
          
          {/* Global Hotspots Carousel */}
          <div className="py-16 px-4 md:px-0">
            <GlobalHotspotsCarousel />
          </div>

          {/* Recently Added Section */}
          <RecentlyAdded />

          {/* Trend Topics (Video Feed) Section */}
          <TrendTopicsFeed />

          {/* Global Ranking & Discovery Section */}
          <div className="mt-12 pb-16 px-4 md:px-0">
            <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow">Karaoke Anthems Worldwide</h2>
            <div className="bg-card/70 p-8 rounded-2xl border border-border/50 backdrop-blur-md">
              <p className="text-center text-muted-foreground">
                [Placeholder for Geo-Targeted Ranking Tables]
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Index;