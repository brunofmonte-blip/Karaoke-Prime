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
  { city: "New York", country: "USA", image: "/public/placeholder.svg" },
  { city: "Rio de Janeiro", country: "Brazil", image: "/public/placeholder.svg" },
  { city: "Tokyo", country: "Japan", image: "/public/placeholder.svg" },
  { city: "London", country: "UK", image: "/public/placeholder.svg" },
  { city: "Seoul", country: "South Korea", image: "/public/placeholder.svg" },
];

const GlobalHotspotsCarousel = () => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
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
                  "rounded-2xl overflow-hidden border-border/50 transition-all duration-300",
                  "bg-card/50 backdrop-blur-lg hover:border-primary hover:shadow-primary/50 shadow-xl"
                )}>
                  <CardContent className="flex flex-col aspect-square items-center justify-end p-0 relative">
                    {/* Image Placeholder */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      style={{ backgroundImage: `url(${hotspot.image})` }}
                    >
                      <img src={hotspot.image} alt={`${hotspot.city} stage`} className="w-full h-full object-cover opacity-20" />
                    </div>
                    
                    {/* Text Overlay */}
                    <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-lg font-bold text-white leading-none">{hotspot.city}</p>
                      <p className="text-sm text-accent font-medium">{hotspot.country}</p>
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