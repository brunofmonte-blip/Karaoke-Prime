import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateContentSafety } from '@/utils/content-safety';
import { useAuth } from '@/integrations/supabase/auth';

const trendItems = [
  { id: 1, user: "VocalPro_88", caption: "Hitting that high note! 🎤 #KaraokeChallenge (Rock)", likes: 1.2, comments: 345, video: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000", genre: "Rock" },
  { id: 2, user: "PrimeTalent_UK", caption: "Audition round 3 success! Wish me luck! ✨ (Flagged)", likes: 980, comments: 120, video: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500&auto=format&fit=crop", genre: "Pop" },
  { id: 3, user: "AcademyGrad", caption: "My AI diagnostic score improved by 15%! Thanks, Prime! (Pop)", likes: 2.5, comments: 500, video: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=500&auto=format&fit=crop", genre: "Pop" },
  { id: 4, user: "JazzMaster", caption: "Smooth notes tonight. 🎷 (Jazz)", likes: 0.8, comments: 50, video: "https://images.unsplash.com/photo-1501084817091-ec513ea013b6?q=80&w=500&auto=format&fit=crop", genre: "Jazz" },
];

const TrendTopicsFeed: React.FC = () => {
  const { user } = useAuth();
  
  // Mock filtering logic: If logged in, prioritize 'Rock' content (simulating user preference)
  const filteredItems = user 
    ? trendItems.filter(item => item.genre === "Rock" || item.id !== 1) // Keep Rock and all non-flagged items
    : trendItems; // Show all if logged out

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-left mb-6 text-accent neon-gold-glow px-4 md:px-0">
        {user ? "Personalized Trend Topics" : "Trend Topics (Video Feed)"}
      </h2>
      <div className="space-y-6 px-4 md:px-0">
        {filteredItems.map((item) => {
          const safetyCheck = validateContentSafety(item.id);
          const isSafe = safetyCheck.isSafe;

          return (
            <Card key={item.id} className={cn(
              "rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-md shadow-xl",
              "hover:border-accent/70 transition-all duration-300"
            )}>
              <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                {/* Video Thumbnail / Moderation Check */}
                <div 
                  className={cn(
                    "w-full md:w-1/3 h-48 rounded-lg relative flex items-center justify-center",
                    isSafe ? "bg-cover bg-center" : "bg-destructive/20 border border-destructive/50"
                  )}
                  style={isSafe ? { backgroundImage: `url(${item.video})` } : {}}
                >
                  {!isSafe ? (
                    <div className="text-center p-4">
                      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <p className="text-sm font-semibold text-destructive">Content Under Review</p>
                      <p className="text-xs text-muted-foreground">Flagged by AI Moderation.</p>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                      {item.user}
                    </div>
                  )}
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
          );
        })}
      </div>
    </div>
  );
};

export default TrendTopicsFeed;