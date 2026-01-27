import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Hotspot {
  city: string;
  country: string;
  image: string; // Unsplash URL
}

const hotspots: Hotspot[] = [
  { city: "New York", country: "USA", image: "https://images.unsplash.com/photo-1534430480872-3498388e7856?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { city: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1516306580123-e6e68b6ac59e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4de39d625?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1505761671935-60b3a7427be3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { city: "Seoul", country: "South Korea", image: "https://images.unsplash.com/photo-1580973309277-82919029607c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const GlobalHotspotsCarousel = () => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary neon-blue-glow">
        Global Karaoke Hotspots
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {hotspots.map((hotspot, index) => (
            <CarouselItem key={index} className="pl-4 basis-3/4 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card className={cn(
                  "rounded-2xl overflow-hidden border-2 border-primary/50 transition-all duration-300",
                  "bg-card/50 backdrop-blur-md hover:border-primary hover:shadow-primary/50 shadow-xl border-neon-glow"
                )}
                style={{
                  // Applying explicit glassmorphism styles
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0, 168, 225, 0.5)' // Using the primary color (Neon Blue) in RGBA
                }}>
                  <CardContent className="flex flex-col aspect-square items-center justify-end p-0 relative">
                    {/* Image Placeholder */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      // Using Unsplash URL directly
                      style={{ backgroundImage: `url(${hotspot.image})` }}
                    >
                      {/* Removed redundant img tag */}
                    </div>
                    
                    {/* Text Overlay */}
                    <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-lg font-bold text-white leading-none neon-blue-glow">{hotspot.city}</p>
                      <p className="text-sm text-accent font-medium neon-gold-glow">{hotspot.country}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default GlobalHotspotsCarousel;