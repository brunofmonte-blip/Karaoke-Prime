"use client";

import React from 'react';
import { Hash, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const topics = [
  { tag: "RockClassics", count: "12.4k cantores", growth: "+15%" },
  { tag: "Sertanejo2024", count: "45.1k cantores", growth: "+22%" },
  { tag: "VocalAcademyChallenge", count: "8.9k cantores", growth: "+40%" },
  { tag: "AnimeHits", count: "15.2k cantores", growth: "+5%" },
  { tag: "GlobalTalentAuditions", count: "30.5k cantores", growth: "+12%" },
];

const TrendTopicsFeed: React.FC = () => {
  return (
    <div className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white neon-blue-glow flex items-center gap-3">
          Trend Topics (Tags) #️⃣
        </h2>
        <p className="text-gray-400 mt-2 font-medium">Os gêneros e desafios mais comentados da comunidade</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <div 
            key={index}
            className={cn(
              "p-5 rounded-2xl border-2 border-primary/20 bg-card/30 backdrop-blur-md",
              "hover:border-primary hover:bg-card/50 transition-all duration-300 cursor-pointer group"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                    {topic.tag}
                  </h4>
                  <p className="text-xs text-muted-foreground">{topic.count}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {topic.growth}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary mt-2 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendTopicsFeed;