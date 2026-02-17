import React from "react";
import { User, Headphones, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstructorAvatar() {
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
      {/* Aura Glow */}
      <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
      
      {/* Studio Specialist Visual Model */}
      <div className="relative w-32 h-40 flex flex-col items-center z-10">
        
        {/* Head & Face Container */}
        <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-primary/50 relative z-10 overflow-hidden shadow-[0_0_20px_rgba(0,168,225,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-5 bg-slate-500 rounded-t-full" />
          <div className="absolute inset-0 flex items-center justify-center pt-2">
            <User className="h-12 w-12 text-slate-400" />
          </div>
          
          {/* AI Pulse Eye */}
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
        </div>
        
        {/* Professional Studio Headphones */}
        <div className="absolute top-[-6px] z-20 flex justify-between w-24">
          <div className="h-10 w-4 bg-slate-900 rounded-l-lg shadow-lg border-r border-white/10" />
          <div className="h-10 w-4 bg-slate-900 rounded-r-lg shadow-lg border-l border-white/10" />
          <Headphones className="absolute top-[-10px] left-1/2 -translate-x-1/2 h-24 w-24 text-primary/80 drop-shadow-[0_0_12px_rgba(0,168,225,0.6)]" />
        </div>
        
        {/* Body: Professional Studio Attire */}
        <div className="w-32 h-32 bg-slate-800 rounded-t-[50px] mt-[-15px] relative shadow-2xl border-t border-white/20">
          {/* Shirt Detail */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-14 bg-slate-300" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* AI Core Badge */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <Sparkles className="h-4 w-4 text-primary animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-8 bg-primary/20 text-primary text-[10px] font-black px-6 py-2 rounded-full border border-primary/40 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,168,225,0.3)] backdrop-blur-md">
        AI VOCAL COACH
      </div>
      
      {/* Active Indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          System Online
        </span>
      </div>
    </div>
  );
}