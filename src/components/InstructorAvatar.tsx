import React from "react";
import { User, Headphones, Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstructorAvatarProps {
  phase?: 'inhale' | 'suspend' | 'exhale' | 'rest' | string;
  moduleType?: string;
  subModule?: string;
}

export default function InstructorAvatar({ phase = "rest" }: InstructorAvatarProps) {
  // Animation logic based on breathing phase
  const isBreathing = phase === 'inhale' || phase === 'exhale';
  
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* Studio Specialist Visual Model */}
      <div className="relative w-32 h-40 flex flex-col items-center">
        
        {/* Head & Face Container */}
        <div className={cn(
          "w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-400 relative z-10 overflow-hidden shadow-inner transition-transform duration-500",
          phase === 'inhale' && "scale-110",
          phase === 'exhale' && "scale-95"
        )}>
          <div className="absolute top-0 left-0 right-0 h-4 bg-slate-500 rounded-t-full" />
          <div className="absolute inset-0 flex items-center justify-center pt-2">
            <User className="h-10 w-10 text-slate-400" />
          </div>
          
          {/* Mouth Animation for Breathing */}
          {isBreathing && (
            <div className={cn(
              "absolute bottom-3 left-1/2 -translate-x-1/2 w-3 h-1 bg-slate-600 rounded-full transition-all duration-300",
              phase === 'inhale' ? "h-3 w-3" : "h-1 w-4"
            )} />
          )}
        </div>
        
        {/* Professional Studio Headphones */}
        <div className="absolute top-[-4px] z-20 flex justify-between w-20">
          <div className="h-8 w-3 bg-slate-900 rounded-l-lg shadow-lg" />
          <div className="h-8 w-3 bg-slate-900 rounded-r-lg shadow-lg" />
          <Headphones className="absolute top-[-8px] left-1/2 -translate-x-1/2 h-20 w-20 text-primary/60 drop-shadow-[0_0_8px_rgba(0,168,225,0.4)]" />
        </div>
        
        {/* Body: Professional Studio Attire */}
        <div className="w-28 h-28 bg-slate-800 rounded-t-[40px] mt-[-10px] relative shadow-2xl border-t border-white/10">
          {/* Shirt Detail */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-slate-300" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* Hands/Gestures - Animated during active phases */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
            <div className={cn(
              "w-3 h-3 rounded-full bg-slate-100 shadow-md transition-all duration-500",
              isBreathing ? "animate-bounce" : "opacity-50"
            )} style={{ animationDelay: '0ms' }} />
            <div className={cn(
              "w-3 h-3 rounded-full bg-slate-100 shadow-md transition-all duration-500",
              isBreathing ? "animate-bounce" : "opacity-50"
            )} style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-6 bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/40 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,168,225,0.2)]">
        Studio Specialist
      </div>
      
      {/* Phase Indicator */}
      <div className="mt-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
        Status: {phase}
      </div>
    </div>
  );
}