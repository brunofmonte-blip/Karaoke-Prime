import React from "react";
import { cn } from "@/lib/utils";

export default function InstructorAvatar() {
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
      {/* Aura Glow */}
      <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
      
      {/* Photographic Model */}
      <div className="relative w-40 h-40 z-10">
        <div className="w-full h-full rounded-full border-4 border-primary/50 overflow-hidden shadow-[0_0_30px_rgba(0,168,225,0.4)]">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500" 
            alt="AI Vocal Coach" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
        {/* Status Indicator */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-lg animate-pulse" />
      </div>

      {/* Status Badge */}
      <div className="mt-6 bg-primary/20 text-primary text-[10px] font-black px-6 py-2 rounded-full border border-primary/40 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,168,225,0.3)] backdrop-blur-md">
        AI VOCAL COACH
      </div>
      
      {/* Active Indicator */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          Neural Engine Active
        </span>
      </div>
    </div>
  );
}