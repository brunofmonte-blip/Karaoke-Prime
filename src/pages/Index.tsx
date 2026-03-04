"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, GraduationCap, Star, Music, LayoutDashboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate(); 

  const pillars = [
    {
      title: "Básico",
      desc: "Karaokê tradicional",
      icon: Music,
      path: "/basic",
      color: "text-primary",
      bg: "bg-primary/20",
      border: "border-primary/50"
    },
    {
      title: "Academy",
      desc: "Currículo de 10 níveis",
      icon: GraduationCap,
      path: "/academy",
      color: "text-primary",
      bg: "bg-primary/20",
      border: "border-primary/50"
    },
    {
      title: "Next Talent",
      desc: "Audições e Carreira",
      icon: Star,
      path: "/talent",
      color: "text-accent",
      bg: "bg-accent/20",
      border: "border-accent/50"
    },
    {
      title: "Backstage",
      desc: "Seu Dashboard Vocal",
      icon: LayoutDashboard,
      path: "/backstage",
      color: "text-primary",
      bg: "bg-primary/20",
      border: "border-primary/50"
    },
    {
      title: "Next Success",
      desc: "Composição com IA",
      icon: Sparkles,
      path: "/next-success",
      color: "text-accent",
      bg: "bg-accent/20",
      border: "border-accent/50"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />

      <div className="relative z-10 text-center px-4 mt-20 animate-in fade-in slide-in-from-top-8 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
          KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-20 font-medium max-w-2xl mx-auto">
          A plataforma definitiva para evolução vocal, performance global e criação musical impulsionada por IA.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 w-full max-w-7xl pb-20 mt-auto">
         {pillars.map((pillar, idx) => (
           <div 
            key={pillar.title}
            onClick={() => navigate(pillar.path)} 
            className={cn(
              "cursor-pointer group p-6 rounded-2xl border bg-black/60 transition-all duration-500",
              "hover:scale-105 hover:bg-black/40",
              pillar.border,
              `animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[${idx * 100}ms]`
            )}
           >
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", pillar.bg, pillar.color)}>
                <pillar.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{pillar.title}</h3>
                <p className="text-xs text-gray-400">{pillar.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Index;