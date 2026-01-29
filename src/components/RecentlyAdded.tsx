import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const recentItems = [
  { title: "Pop Anthem 2024", artist: "Anya Sharma", image: "https://picsum.photos/id/1040/500/500" }, // Stable placeholder 1
  { title: "Midnight Jazz", artist: "Marcus King", image: "https://picsum.photos/id/1041/500/500" }, // Stable placeholder 2
  { title: "Rock Ballad", artist: "Chloe Lee", image: "https://picsum.photos/id/1042/500/500" }, // Stable placeholder 3
  { title: "Electro Beat", artist: "DJ Zedd", image: "https://picsum.photos/id/1043/500/500" }, // Stable placeholder 4
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