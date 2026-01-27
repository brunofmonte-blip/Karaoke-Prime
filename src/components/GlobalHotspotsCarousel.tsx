import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Flag, PlayCircle } from "lucide-react";

interface Hotspot {
  city: string;
  country: string;
  image: string; // Unsplash URL
}

const hotspots: Hotspot[] = [
  { city: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=500" },
  { city: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=500" },
  { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=500" },
  { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=500" }, // Updated URL
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
                  backdropFilter: 'blur(20px)', // Updated to 20px
                  border: '1px solid rgba(0, 168, 225, 0.5)'
                }}>
                  <CardContent className="flex flex-col aspect-square items-center justify-end p-0 relative">
                    {/* Image Placeholder */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      style={{ backgroundImage: `url(${hotspot.image})` }}
                    >
                      {/* Flag Icon */}
                      <div className="absolute top-3 right-3 p-1 bg-black/50 rounded-full backdrop-blur-sm">
                        <Flag className="h-4 w-4 text-accent neon-gold-glow" />
                      </div>
                    </div>
                    
                    {/* Text Overlay and Button */}
                    <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-lg font-bold text-white leading-none neon-blue-glow">{hotspot.city}</p>
                      <p className="text-sm text-accent font-medium neon-gold-glow mb-2">{hotspot.country}</p>
                      <Button 
                        variant="default" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Participar
                      </Button>
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