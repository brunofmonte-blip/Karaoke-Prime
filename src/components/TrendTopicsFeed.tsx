import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const trendItems = [
  { id: 1, user: "VocalPro_88", caption: "Hitting that high note! 🎤 #KaraokeChallenge", likes: 1.2, comments: 345, video: "https://images.unsplash.com/photo-1514525253161-7a46d1919806?q=80&w=500&auto=format&fit=crop" },
  { id: 2, user: "PrimeTalent_UK", caption: "Audition round 3 success! Wish me luck! ✨", likes: 980, comments: 120, video: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500&auto=format&fit=crop" },
  { id: 3, user: "AcademyGrad", caption: "My AI diagnostic score improved by 15%! Thanks, Prime!", likes: 2.5, comments: 500, video: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=500&auto=format&fit=crop" },
];

const TrendTopicsFeed: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-left mb-6 text-accent neon-gold-glow px-4 md:px-0">
        Trend Topics (Video Feed)
      </h2>
      <div className="space-y-6 px-4 md:px-0">
        {trendItems.map((item) => (
          <Card key={item.id} className={cn(
            "rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-md shadow-xl",
            "hover:border-accent/70 transition-all duration-300"
          )}>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              {/* Video Thumbnail */}
              <div 
                className="w-full md:w-1/3 h-48 bg-cover bg-center rounded-lg relative"
                style={{ backgroundImage: `url(${item.video})` }}
              >
                <div className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                  {item.user}
                </div>
              </div>
              
              {/* Content and Actions */}
              <div className="flex flex-col justify-between w-full md:w-2/3">
                <div>
                  <p className="text-sm text-foreground mb-2">{item.caption}</p>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-500 fill-red-500/50" />
                      <span>{item.likes}k</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendTopicsFeed;