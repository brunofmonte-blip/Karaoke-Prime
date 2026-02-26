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

// Simplified Inline SVGs for stability
const BrazilFlag = () => (
  <svg viewBox="0 0 720 504" className="w-24 h-auto rounded-lg shadow-lg">
    <rect width="720" height="504" fill="#009c3b"/>
    <path d="M360 72L648 252L360 432L72 252z" fill="#ffdf00"/>
    <circle cx="360" cy="252" r="105" fill="#002776"/>
  </svg>
);

const USAFlag = () => (
  <svg viewBox="0 0 741 390" className="w-24 h-auto rounded-lg shadow-lg">
    <rect width="741" height="390" fill="#fff"/>
    <path d="M0 0h741v30H0zM0 60h741v30H0zM0 120h741v30H0zM0 180h741v30H0zM0 240h741v30H0zM0 300h741v30H0zM0 360h741v30H0z" fill="#b22234"/>
    <rect width="296.4" height="210" fill="#3c3b6e"/>
  </svg>
);

const JapanFlag = () => (
  <svg viewBox="0 0 900 600" className="w-24 h-auto rounded-lg shadow-lg border border-border/20">
    <rect width="900" height="600" fill="#fff"/>
    <circle cx="450" cy="300" r="180" fill="#bc002d"/>
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 30" className="w-24 h-auto rounded-lg shadow-lg">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" clipPath="url(#s)"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#012169" strokeWidth="4" clipPath="url(#s)"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const regionalHits = [
  { 
    region: "Brasil", 
    icon: <BrazilFlag />, 
    description: "Sertanejo, MPB e Samba dominam o topo.", 
    query: "sertanejo" 
  },
  { 
    region: "EUA", 
    icon: <USAFlag />, 
    description: "Pop, Rock e Country em alta nas paradas.", 
    query: "pop rock usa" 
  },
  { 
    region: "Japão", 
    icon: <JapanFlag />, 
    description: "J-Pop e clássicos de Anime são os favoritos.", 
    query: "j-pop anime" 
  },
  { 
    region: "Reino Unido", 
    icon: <UKFlag />, 
    description: "Britpop e Indie Rock lideram as buscas.", 
    query: "britpop" 
  }
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
                    <div className="mb-4 h-20 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
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