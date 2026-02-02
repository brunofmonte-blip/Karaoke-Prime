import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const recentItems = [
  { title: "Pop Anthem 2024", artist: "Anya Sharma", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500" }, // Microphone/Music production
  { title: "Midnight Jazz", artist: "Marcus King", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500" }, // Stage lights
  { title: "Rock Ballad", artist: "Chloe Lee", image: "https://images.unsplash.com/photo-1519732773401-d92c7293764c?q=80&w=500" }, // Singer silhouette (This image was already present, ensuring it's valid)
  { title: "Electro Beat", artist: "DJ Zedd", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500" }, // DJ/Concert
];

const RecentlyAdded: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-left mb-6 text-foreground neon-blue-glow px-4 md:px-0">
        Recently Added
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0">
        {recentItems.map((item, index) => (
          <Card key={index} className={cn(
            "flex-shrink-0 w-[200px] rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300",
            "bg-card/50 backdrop-blur-md hover:border-primary hover:shadow-primary/50 shadow-lg"
          )}>
            <CardContent className="p-0 relative">
              <div 
                className="h-48 bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="h-10 w-10 text-primary icon-neon-glow" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.artist}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;