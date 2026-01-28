import { Button } from "@/components/ui/button";
import { GraduationCap, Star, Lock, Music, Trophy, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full bg-cover bg-center" 
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop')" }}
  >
    {/* Vignette Overlay */}
    <div className="absolute inset-0 hero-vignette" />
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
      
      {/* Logo: Karaoke Prime (Amazon Music Style) */}
      <div className="drop-shadow-[0_0_15px_rgba(0,168,225,0.7)]">
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-foreground">
          Karaoke 
          <span className="text-white ml-4 relative inline-block font-black">
            Prime
          </span>
        </h1>
      </div>
      
      {/* Amazon Smile Arrow */}
      <div className="amazon-gold-glow mt-[-10px]">
        <AmazonSmileLogo className="h-4 w-[150px] text-accent fill-current" />
      </div>
      
      {/* Tagline: Your Stage. Your Spotlight. */}
      <p className="mt-4 text-xl text-white/90">Your Stage. Your Spotlight.</p>

      {/* Removed CTA Buttons to match strict structure */}
    </div>
  </section>
);

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl transition-all duration-500 flex-shrink-0 w-[280px] relative", 
    "glass-pillar", // Using the new class
    "shadow-xl border-neon-glow", 
    "cursor-pointer hover:scale-[1.03]"
  )}
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
        {/* Adjusted negative margin to achieve the visual overlap required */}
        <div className="w-full max-w-7xl mx-auto -mt-40 relative z-50"> 
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