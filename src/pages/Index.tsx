import { Button } from "@/components/ui/button";
import { Award, Zap, GraduationCap, Star, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import AmazonSmileLogo from "@/components/AmazonSmileLogo";

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <div className="relative min-h-[70vh] flex items-end justify-center overflow-hidden bg-black pb-16">
    {/* Immersive Concert Stage Background - High Contrast */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30 scale-110 transition-transform duration-1000"
      style={{ 
        backgroundPosition: 'center 30%',
        // New Unsplash URL and 'melting' gradient applied
        backgroundImage: `
          linear-gradient(to top, #050505 10%, transparent 50%),
          radial-gradient(circle at center, transparent 20%, rgba(5,5,5,0.9) 80%),
          url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80')
        `
      }}
    ></div>
    
    {/* Golden Volumetric Lighting Effect (Converging Spotlights) */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Central Neon Blue Glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/40 rounded-full filter blur-[180px] opacity-50 animate-pulse z-0"></div>
    </div>

    {/* Logo positioned in the lower third */}
    <div className="relative z-20 text-center p-4 mb-12">
      <div className="flex flex-col items-center justify-center">
        {/* Logo & Branding: Prime Gold Arrow and Neon Text */}
        <div className="drop-shadow-[0_0_15px_#00A8E1]">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white neon-blue-glow">
            Karaoke 
            <span id="prime-text" className="text-accent neon-gold-glow ml-4 relative inline-block">
              Prime
              {/* Amazon Smile Arrow positioned under Prime, 80% width, 4px below */}
              <AmazonSmileLogo className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-4 w-[80%]" />
            </span>
          </h1>
        </div>
      </div>
      
      <p className="text-lg md:text-xl text-muted-foreground font-light italic mt-8">
        Your stage. Your Spotlight.
      </p>
    </div>
  </div>
);

const ElitePillarCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className={cn(
    "p-6 rounded-2xl border-2 border-primary/50 backdrop-blur-md transition-all duration-500 flex-shrink-0 w-full md:w-auto",
    "bg-card/10 hover:bg-card/20", // Subtle glass effect
    "shadow-xl border-neon-glow", // Neon Blue border glow
    "cursor-pointer hover:scale-[1.03]"
  )}
  style={{
    // Applying explicit glassmorphism styles
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

      <div className="container mx-auto px-4 md:px-6">
        
        {/* The 5 Elite Pillars Section - Overlapping the Hero */}
        <div className="relative -mt-24 z-30 mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary neon-blue-glow sr-only">The Elite Pillars of Prime</h2>
          
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4">
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
        
        {/* Global Hotspots Carousel */}
        <div className="py-16">
          <GlobalHotspotsCarousel />
        </div>

        {/* Global Ranking & Discovery Section */}
        <div className="mt-12 pb-16">
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