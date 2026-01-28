import { Button } from "@/components/ui/button";
import { GraduationCap, Star, Lock, Music, Trophy, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-black">
    {/* Immersive Concert Stage Background - Professional, Empty Stage */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 transition-transform duration-1000"
      style={{ 
        // New professional stage image
        backgroundImage: `url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop')`
      }}
    >
      {/* Gradient Overlay: linear-gradient(to top, #050505 10%, transparent 80%) */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to top, hsl(var(--background)) 10%, transparent 80%)`
      }}></div>
    </div>
    
    {/* Volumetric Lighting Effect */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Central Neon Blue Glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/40 rounded-full filter blur-[180px] opacity-50 animate-pulse z-0"></div>
    </div>

    {/* Logo and CTA positioned in the center/lower half */}
    <div className="relative z-20 text-center p-4 flex flex-col items-center"> 
      <div className="flex flex-col items-center justify-center">
        {/* Main Logo: Karaoke Prime (Amazon Music Style) */}
        <div className="drop-shadow-[0_0_15px_#00A8E1]">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-foreground neon-blue-glow">
            Karaoke 
            <span id="prime-text" className="text-primary neon-blue-glow ml-4 relative inline-block font-black">
              Prime
              {/* Amazon Smile Arrow positioned under Prime */}
              <AmazonSmileLogo className="absolute -bottom-4 left-0 h-4 w-full" />
            </span>
          </h1>
        </div>
      </div>
      
      {/* Tagline: Your Stage. Your Spotlight. */}
      <p id="hero-tagline" className="text-lg md:text-xl text-muted-foreground font-light tracking-wider mt-8 mb-16">
        Your Stage. Your Spotlight.
      </p>

      {/* Call-to-Action Buttons: Basic and Explore Prime (Neon Cyan Border, Glassmorphism) */}
      <div className="flex space-x-4">
        <Button 
          size="lg"
          className={cn(
            "bg-card/20 text-primary hover:bg-card/30 rounded-full px-8 py-6 text-lg font-semibold",
            "shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-[1.05] border-2 border-primary",
            "backdrop-blur-md"
          )}
          style={{
            backdropFilter: 'blur(20px)',
            border: '2px solid hsl(var(--primary))'
          }}
        >
          Basic
        </Button>
        <Button 
          size="lg"
          variant="outline"
          className={cn(
            "bg-card/20 border-primary text-primary hover:bg-card/30 rounded-full px-8 py-6 text-lg font-semibold",
            "shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-[1.05] border-2",
            "backdrop-blur-md"
          )}
          style={{
            backdropFilter: 'blur(20px)',
            border: '2px solid hsl(var(--primary))'
          }}
        >
          Explore Prime
        </Button>
      </div>
    </div>
  </div>
);

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-500 flex-shrink-0 w-[280px] relative", 
    "bg-card/10 hover:bg-card/20", 
    "shadow-xl border-neon-glow", 
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
        {/* Using -mt-32 to pull the pillars up significantly over the Hero section */}
        <div className="w-full max-w-7xl mx-auto -mt-32 relative z-50"> 
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center md:overflow-x-hidden">
            <ElitePillarCard 
              title="Basic (Battle/Social)" 
              description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
              icon={Music} 
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
              title="Ranking Online" 
              description="Global ranking system based on performance, engagement, and academy level." 
              icon={Trophy} 
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