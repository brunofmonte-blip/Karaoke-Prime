"use client";

import React from 'react';
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
import { Globe, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const regionalHits = [
  { region: "Brasil", flag: "🇧🇷", description: "Sertanejo, MPB e Samba dominam o topo.", query: "sertanejo" },
  { region: "EUA", flag: "🇺🇸", description: "Pop, Rock e Country em alta nas paradas.", query: "pop rock usa" },
  { region: "Japão", flag: "🇯🇵", description: "J-Pop e clássicos de Anime são os favoritos.", query: "j-pop anime" },
  { region: "Reino Unido", flag: "🇬🇧", description: "Britpop e Indie Rock lideram as buscas.", query: "britpop" },
  { region: "Coreia do Sul", flag: "🇰🇷", description: "K-Pop e baladas românticas no topo.", query: "k-pop" }
];

const RegionalTopHits = () => {
  const navigate = useNavigate();

  const handleExplore = (query: string) => {
    navigate(`/library?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Globe className="h-8 w-8 text-primary neon-blue-glow" />
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white neon-blue-glow">
          Músicas Mais Cantadas por País
        </h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {regionalHits.map((item, index) => (
            <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <Card className={cn(
                  "rounded-3xl overflow-hidden border-2 border-primary/30 transition-all duration-500",
                  "glass-pillar hover:border-primary hover:shadow-primary/40 shadow-2xl group"
                )}>
                  <CardContent className="p-8 flex flex-col items-center text-center h-[320px] justify-between">
                    {/* Large Flag Icon */}
                    <div className="text-7xl md:text-8xl mb-4 transform transition-transform duration-500 group-hover:scale-110 drop-shadow-xl">
                      {item.flag}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {item.region}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleExplore(item.query)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold py-6 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
                    >
                      Explorar
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-[-20px] bg-black/50 border-primary/50 text-primary hover:bg-primary hover:text-white" />
          <CarouselNext className="right-[-20px] bg-black/50 border-primary/50 text-primary hover:bg-primary hover:text-white" />
        </div>
      </Carousel>
    </div>
  );
};

export default RegionalTopHits;