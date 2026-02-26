import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, ExternalLink, Music, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const premiumChannels = [
  { 
    id: 1, 
    name: "Sing King", 
    initials: "SK", 
    description: "O maior canal de karaokê do mundo com hits atuais.", 
    subscribers: "10M+",
    color: "text-primary",
    glow: "shadow-primary/40"
  },
  { 
    id: 2, 
    name: "Party Tyme", 
    initials: "PT", 
    description: "Clássicos remasterizados e trilhas de alta fidelidade.", 
    subscribers: "2M+",
    color: "text-accent",
    glow: "shadow-accent/40"
  },
  { 
    id: 3, 
    name: "KaraFun", 
    initials: "KF", 
    description: "Especialistas em animações e letras sincronizadas.", 
    subscribers: "1.5M+",
    color: "text-green-400",
    glow: "shadow-green-400/40"
  },
  { 
    id: 4, 
    name: "Ponto do Karaokê", 
    initials: "PK", 
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
            <CardContent className="p-8 flex flex-col items-center text-center h-full">
              {/* Neon Initials Avatar */}
              <div className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border-2 border-white/5 bg-black/40",
                "transition-all duration-500 group-hover:border-primary/50",
                channel.glow
              )}>
                <span className={cn(
                  "text-4xl font-black tracking-tighter",
                  channel.color,
                  "drop-shadow-[0_0_8px_currentColor]"
                )}>
                  {channel.initials}
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-3">
                  {channel.subscribers} Inscritos
                </p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {channel.description}
                </p>
              </div>

              <Button 
                variant="outline"
                className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Canal
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendTopicsFeed;