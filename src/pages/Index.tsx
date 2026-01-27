import { Button } from "@/components/ui/button";
import { Award, Zap, GraduationCap, Star, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative h-[85vh] flex items-end justify-center overflow-hidden bg-black">
    {/* Immersive Concert Stage Background - High Contrast */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30 scale-110 transition-transform duration-1000"
      style={{ 
        backgroundPosition: 'center 30%',
        // Corrected background image URL
        backgroundImage: `
          radial-gradient(circle at center, transparent 10%, #050505 90%),
          url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop')
        `
      }}
    ></div>
    
    {/* Golden Volumetric Lighting Effect (Converging Spotlights) */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Central Neon Blue Glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/40 rounded-full filter blur-[180px] opacity-50 animate-pulse z-0"></div>
    </div>

    {/* Logo positioned in the lower third */}
    <div className="relative z-20 text-center p-4 mb-[15vh]"> {/* Adjusted margin to place logo in lower third */}
      <div className="flex flex-col items-center justify-center">
        {/* Logo & Branding: Prime Gold Arrow and Neon Text */}
        <div className="drop-shadow-[0_0_15px_#00A8E1]">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white neon-blue-glow">
            Karaoke 
            <span id="prime-text" className="text-accent neon-gold-glow ml-4 relative inline-block">
              Prime
              {/* Amazon Smile Arrow positioned 4px below 'Prime' and 120px wide */}
              <AmazonSmileLogo className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-4 w-[120px]" />
            </span>
          </h1>
        </div>
      </div>
      
      <p className="text-lg md:text-xl text-muted-foreground font-light italic mt-8 tracking-wider">
        Your Stage. Your Spotlight.
      </p>
    </div>
  </div>
);

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-500 flex-shrink-0 w-[280px]", // Fixed width for horizontal scroll
    "bg-card/10 hover:bg-card/20", // Subtle glass effect
    "shadow-xl border-neon-glow", // Neon Blue border glow
    "cursor-pointer hover:scale-[1.03]"
  )}
  style={{
    // Strict glassmorphism styles with blur(20px)
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 168, 225, 0.3)' 
  }}
  >
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
        {/* Using negative margin to pull the pillars up 80px below the tagline. Added z-50 for layering. */}
        <div className="w-full max-w-7xl mx-auto -mt-20 md:-mt-24 relative z-50"> 
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center md:overflow-x-hidden">
            <ElitePillarCard 
              title="Basic (Battle/Social)" 
              description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
              icon={Award} 
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
              title="Next Success" 
              description="Generative AI portal for creating original lyrics and melodies (Suno-style)." 
              icon={Zap} 
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