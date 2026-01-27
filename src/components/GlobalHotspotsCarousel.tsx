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
  image: string; // Placeholder for image path
}

const hotspots: Hotspot[] = [
  { city: "New York", country: "USA", image: "/placeholder.svg" },
  { city: "Rio de Janeiro", country: "Brazil", image: "/placeholder.svg" },
  { city: "Tokyo", country: "Japan", image: "/placeholder.svg" },
  { city: "London", country: "UK", image: "/placeholder.svg" },
  { city: "Seoul", country: "South Korea", image: "/placeholder.svg" },
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
                      // Correcting image path and ensuring it uses the stage background if placeholder fails
                      style={{ backgroundImage: `url(${hotspot.image === '/placeholder.svg' ? '/stage-background.jpg' : hotspot.image})` }}
                    >
                      <img src={hotspot.image} alt={`${hotspot.city} stage`} className="w-full h-full object-cover opacity-20" />
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