import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const premiumChannels = [
  { 
    id: 1, 
    name: "Sing King", 
    thumbnail: "https://i.ytimg.com/vi/P7qu_p_i-pY/hqdefault.jpg",
    description: "O maior canal de karaokê do mundo com hits atuais.", 
    subscribers: "10M+",
    color: "text-primary",
    glow: "shadow-primary/40"
  },
  { 
    id: 2, 
    name: "Party Tyme", 
    thumbnail: "https://i.ytimg.com/vi/vL9YofV_L_Q/hqdefault.jpg",
    description: "Clássicos remasterizados e trilhas de alta fidelidade.", 
    subscribers: "2M+",
    color: "text-accent",
    glow: "shadow-accent/40"
  },
  { 
    id: 3, 
    name: "KaraFun", 
    thumbnail: "https://i.ytimg.com/vi/XqZsoesa55w/hqdefault.jpg", 
    description: "Especialistas em animações e letras sincronizadas.", 
    subscribers: "1.5M+",
    color: "text-green-400",
    glow: "shadow-green-400/40"
  },
  { 
    id: 4, 
    name: "Ponto do Karaokê", 
    thumbnail: "https://i.ytimg.com/vi/W_8R6EID7F0/hqdefault.jpg", 
    description: "A maior biblioteca de sucessos brasileiros e MPB.", 
    subscribers: "800k+",
    color: "text-red-500",
    glow: "shadow-red-500/40"
  },
];

const TrendTopicsFeed: React.FC = () => {
  return (
    <div className="py-12">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white neon-blue-glow flex items-center gap-3">
          Canais de Karaokê Premium <Youtube className="h-8 w-8 text-red-600" />
        </h2>
        <p className="text-gray-400 mt-2 font-medium">As melhores fontes de áudio para sua performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {premiumChannels.map((channel) => (
          <Card key={channel.id} className={cn(
            "rounded-[2rem] border-2 border-white/10 bg-card/30 backdrop-blur-xl transition-all duration-500",
            "hover:border-primary/50 hover:scale-[1.03] shadow-2xl group overflow-hidden"
          )}>
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={channel.thumbnail} 
                  alt={channel.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/20 backdrop-blur-md p-3 rounded-full border border-primary/50">
                    <Play className="h-6 w-6 text-primary fill-primary" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
                  HD AUDIO
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-3">
                  {channel.subscribers} Inscritos
                </p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                  {channel.description}
                </p>

                <Button 
                  variant="outline"
                  className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Canal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendTopicsFeed;