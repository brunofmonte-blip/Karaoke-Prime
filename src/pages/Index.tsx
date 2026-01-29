import { GraduationCap, Star, Lock, Music, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import GlobalHotspotsCarousel from "@/components/GlobalHotspotsCarousel";
import RecentlyAdded from "@/components/RecentlyAdded";
import TrendTopicsFeed from "@/components/TrendTopicsFeed";
import HeroCtaButton from "@/components/HeroCtaButton";
import FlagIcon from "@/components/FlagIcon"; // Keeping import for now, but removing usage
import RankingTables from "@/components/RankingTables";
import { Link } from "react-router-dom"; // Import Link
import { useVocalSandbox } from "@/hooks/use-vocal-sandbox"; // Import useVocalSandbox

// Placeholder for the cinematic stage background
const HeroSection = () => (
  <section 
    className="relative h-[85vh] w-full bg-cover bg-center flex flex-col justify-end" 
    style={{ backgroundImage: "url('/stage-background-new.png')" }}
  >
    {/* Vignette Overlay */}
    <div className="absolute inset-0 hero-vignette" />
    
    {/* Content: Centered vertically in the middle section */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
      
      {/* CTA Buttons removed as requested */}
      
    </div>
    
    {/* Spacer to push content up, ensuring the pillars are positioned correctly */}
    <div className="h-[10vh] md:h-[15vh] relative z-10"></div>
  </section>
);

interface ElitePillarProps {
  title: string;
  description: string;
  icon: React.ElementType;
  to?: string; // Made optional for the Basic pillar
  onClick?: () => void;
}

const ElitePillarCard: React.FC<ElitePillarProps> = ({ title, description, icon: Icon, to, onClick }) => {
  const content = (
    <div className={cn(
      "p-4 rounded-2xl transition-all duration-500 flex-shrink-0 w-[200px] lg:w-[200px] relative", // Adjusted width
      "bg-card/10 backdrop-blur-md", // Dark glass background
      "border-2 border-primary/70 shadow-xl", // Thick cyan border
      "cursor-pointer hover:scale-[1.03] hover:shadow-primary/70",
      "neon-blue-border-glow" // Using the new class for border glow
    )}
    >
      {/* Icon Container */}
      <div className="h-10 w-10 mb-3 flex items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
        <Icon className="h-5 w-5 text-primary icon-neon-glow" />
      </div>
      
      <h3 className="text-lg font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }
  
  return <div onClick={onClick} className="block">{content}</div>;
};

const Index = () => {
  const { openOverlay } = useVocalSandbox();

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
              onClick={openOverlay} // Use onClick to open the overlay
            />
            <ElitePillarCard 
              title="Academy" 
              description="10-level curriculum with AI Vocal Diagnostic for pitch and breath analysis." 
              icon={GraduationCap} 
              to="/academy"
            />
            <ElitePillarCard 
              title="Next Talent" 
              description="10-level gamified auditions, progressing from local to global online stages." 
              icon={Star} 
              to="/talent" // Placeholder route
            />
            <ElitePillarCard 
              title="Backstage" 
              description="Premium UI locked behind social verification and a Pro-Vocal test." 
              icon={Lock} 
              to="/backstage"
            />
            <ElitePillarCard 
              title="Amazon Success" 
              description="Global ranking system based on performance, engagement, and academy level." 
              icon={Trophy} 
              to="/success" // Placeholder route
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
          <RankingTables />
        </div>
      </div>
    </div>
  );
};

export default Index;