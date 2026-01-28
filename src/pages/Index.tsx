import { GraduationCap, Star, Lock, Music, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";
import HeroCtaButton from "@/components/HeroCtaButton";
import FlagIcon from "@/components/FlagIcon";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full bg-cover bg-center" 
    style={{ backgroundImage: "url('/stage-background-new.png')" }}
  >
    {/* Vignette Overlay */}
    <div className="absolute inset-0 hero-vignette" />
    
    {/* Content: Centered vertically and horizontally */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
      
      {/* Logo Composition: "karaoke Prime" */}
      <div className="drop-shadow-[0_0_15px_rgba(0,168,225,0.7)]">
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white">
          karaoke 
          <span className="text-primary ml-4 relative inline-block font-black">
            Prime
          </span>
        </h1>
      </div>
      
      {/* Amazon Smile Arrow (Gold) - positioned 4px under 'Prime' */}
      <div className="amazon-gold-glow mt-[-10px]">
        <AmazonSmileLogo className="h-4 w-[150px] text-accent fill-current" />
      </div>
      
      {/* Tagline: Your Stage. Your Spotlight. (mb-10 provides 40px spacing before buttons) */}
      <p className="mt-4 text-xl text-white/90 mb-10">Your Stage. Your Spotlight.</p>

      {/* CTA Buttons - Transparent background, cyan glowing border */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <HeroCtaButton>
          See live show
        </HeroCtaButton>
        <HeroCtaButton>
          Explore Prime
        </HeroCtaButton>
      </div>
    </div>
  </section>
);

interface ElitePillarProps {
  title: string;
  description: string;
  icon: React.ElementType;
  flagCode: 'IT' | 'PL' | 'FR' | 'US' | 'RU';
}

const ElitePillarCard: React.FC<ElitePillarProps> = ({ title, description, icon: Icon, flagCode }) => (
  <div className={cn(
    "p-6 rounded-2xl transition-all duration-500 flex-shrink-0 w-[280px] lg:w-1/5 relative", 
    "bg-card/10 backdrop-blur-md", // Dark glass background
    "border-2 border-primary/70 shadow-xl", // Thick cyan border
    "cursor-pointer hover:scale-[1.03] hover:shadow-primary/70",
    "neon-blue-border-glow" // Using the new class for border glow
  )}
  >
    {/* Flag Icon */}
    <div className="absolute top-3 right-3">
      <FlagIcon countryCode={flagCode} />
    </div>
    
    {/* Icon Container */}
    <div className="h-12 w-12 mb-4 flex items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
      <Icon className="h-6 w-6 text-primary icon-neon-glow" />
    </div>
    
    <h3 className="text-xl font-bold mb-1 text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const Index = () => {
  return (
    <div className="w-full relative">
      
      {/* Hero Section Container (Relative for absolute positioning of pillars) */}
      <div className="relative">
        <HeroSection />

        {/* The 5 Elite Pillars Section - FLOATING OVERLAP (The Bridge) */}
        {/* bottom: -60px as requested */}
        <div className="absolute bottom-[-60px] left-0 right-0 z-50 w-full max-w-7xl mx-auto"> 
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 md:justify-center md:overflow-x-hidden">
            <ElitePillarCard 
              title="Basic" 
              description="Traditional Karaoke with original MVs and the Online/Offline Battle system." 
              icon={Music} 
              flagCode="IT"
            />
            <ElitePillarCard 
              title="Academy" 
              description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
              icon={GraduationCap} 
              flagCode="PL"
            />
            <ElitePillarCard 
              title="Next Talent" 
              description="10-level gamified auditions, progressing from local to global online stages." 
              icon={Star} 
              flagCode="FR"
            />
            <ElitePillarCard 
              title="Backstage" 
              description="Premium UI locked behind social verification and a Pro-Vocal test." 
              icon={Lock} 
              flagCode="US"
            />
            <ElitePillarCard 
              title="Amazon Success" 
              description="Global ranking system based on performance, engagement, and academy level." 
              icon={Trophy} 
              flagCode="RU"
            />
          </div>
        </div>
      </div>

      {/* Content below the Hero, starting after the overlap area. 
          Padding top adjusted to pt-[140px] (60px overlap + 80px spacing) */}
      <div className="container mx-auto px-0 md:px-6 relative z-30 pt-[140px] md:pt-[140px]"> 
        
        {/* Global Karaoke Hotspots */}
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
  );
};

export default Index;