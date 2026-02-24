"use client";

import React from 'react';
import { Heart, MessageSquare, Share2, Play, Music } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const trendingSingers = [
  {
    id: 1,
    user: "@VocalQueen",
    song: "Rolling in the Deep",
    likes: "12.5k",
    comments: "842",
    shares: "1.2k",
    coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    user: "@RockStar_Leo",
    song: "Bohemian Rhapsody",
    likes: "8.9k",
    comments: "520",
    shares: "940",
    coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=500",
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: 3,
    user: "@Anya_Sings",
    song: "Shallow",
    likes: "15.2k",
    comments: "1.1k",
    shares: "2.5k",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500",
    avatar: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: 4,
    user: "@JazzMaster_J",
    song: "Fly Me to the Moon",
    likes: "6.4k",
    comments: "310",
    shares: "420",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500",
    avatar: "https://i.pravatar.cc/150?u=4"
  }
];

const TrendSingersFeed: React.FC = () => {
  return (
    <div className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white neon-blue-glow flex items-center gap-3">
          Trend Topics (Singers) 🔥
        </h2>
        <p className="text-gray-400 mt-2 font-medium">Os talentos mais curtidos da semana</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {trendingSingers.map((singer) => (
          <div 
            key={singer.id}
            className={cn(
              "relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer",
              "border-2 border-primary/20 hover:border-primary transition-all duration-500 shadow-2xl"
            )}
          >
            {/* Background Image */}
            <img 
              src={singer.coverUrl} 
              alt={singer.user} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-primary/20 backdrop-blur-md p-4 rounded-full border border-primary/50">
                <Play className="h-8 w-8 text-primary fill-primary" />
              </div>
            </div>

            {/* Engagement Metrics (Right Side) */}
            <div className="absolute right-3 bottom-24 flex flex-col gap-4 items-center z-20">
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-red-500/20 transition-colors">
                  <Heart className="h-6 w-6 text-white hover:text-red-500 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1">{singer.likes}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1">{singer.comments}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1">{singer.shares}</span>
              </div>
            </div>

            {/* User Info (Bottom Left) */}
            <div className="absolute bottom-4 left-4 right-12 z-20">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarImage src={singer.avatar} />
                  <AvatarFallback>{singer.user.slice(1, 3)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-white truncate">{singer.user}</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Music className="h-3 w-3" />
                <span className="text-xs font-medium truncate">{singer.song}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendSingersFeed;