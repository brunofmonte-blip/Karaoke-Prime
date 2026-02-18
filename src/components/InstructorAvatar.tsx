import React from "react";
import { cn } from "@/lib/utils";
import { BreathingPhase, ConservatoryModule, CalibrationSubModule } from "@/hooks/use-vocal-sandbox";

interface InstructorAvatarProps {
  phase?: BreathingPhase;
  moduleType?: ConservatoryModule;
  subModule?: CalibrationSubModule;
}

export default function InstructorAvatar({ phase = 'idle', moduleType = 'none', subModule = 'none' }: InstructorAvatarProps) {
  const isExhaling = phase === 'exhale';
  const isInhaling = phase === 'inhale';
  const isSuspending = phase === 'suspend';
  const isResting = phase === 'rest';

  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
      {/* Aura Glow */}
      <div className={cn(
        "absolute inset-0 rounded-full filter blur-3xl transition-all duration-1000",
        isInhaling ? "bg-primary/40 scale-110" : 
        isExhaling ? "bg-accent/40 scale-105" : 
        isSuspending ? "bg-yellow-500/30 scale-100" :
        "bg-primary/20 scale-100"
      )} />
      
      {/* Photographic Model */}
      <div className="relative w-40 h-40 z-10">
        <div className={cn(
          "w-full h-full rounded-full border-4 transition-all duration-500 overflow-hidden shadow-2xl",
          isInhaling ? "border-primary scale-105" : 
          isExhaling ? "border-accent scale-100" : 
          "border-primary/50 scale-100"
        )}>
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500" 
            alt="AI Vocal Coach" 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              phase === 'idle' ? "grayscale" : "grayscale-0",
              isInhaling ? "scale-110" : "scale-100"
            )}
          />
        </div>
        
        {/* Status Indicator */}
        <div className={cn(
          "absolute bottom-2 right-2 w-6 h-6 border-4 border-background rounded-full shadow-lg transition-colors duration-500",
          isInhaling ? "bg-primary animate-pulse" : 
          isExhaling ? "bg-accent animate-bounce" : 
          isSuspending ? "bg-yellow-500" :
          "bg-green-500"
        )} />
      </div>

      {/* Status Badge */}
      <div className="mt-6 bg-primary/20 text-primary text-[10px] font-black px-6 py-2 rounded-full border border-primary/40 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,168,225,0.3)] backdrop-blur-md">
        {phase === 'idle' ? 'AI VOCAL COACH' : `PHASE: ${phase.toUpperCase()}`}
      </div>
      
      {/* Active Indicator */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          {isInhaling ? "Inhaling Oxygen..." : isExhaling ? "Measuring Airflow..." : "Neural Engine Active"}
        </span>
      </div>
    </div>
  );
}