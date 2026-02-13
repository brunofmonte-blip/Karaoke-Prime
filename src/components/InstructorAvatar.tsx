"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { User, Headphones } from 'lucide-react';

interface InstructorAvatarProps {
  phase: 'inhale' | 'suspend' | 'exhale' | 'rest';
  className?: string;
}

const InstructorAvatar: React.FC<InstructorAvatarProps> = ({ phase, className }) => {
  return (
    <div className={cn(
      "relative w-48 h-64 flex flex-col items-center justify-center transition-all duration-1000",
      className
    )}>
      {/* Studio Specialist Visual Model */}
      <div className="relative w-32 h-40 flex flex-col items-center">
        
        {/* Head with Grey Hair */}
        <div className="w-16 h-16 rounded-full bg-[#f3f4f6] border-2 border-border relative z-10 overflow-hidden">
          {/* Grey Hair Overlay */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#9ca3af] rounded-t-full" />
          <div className="absolute inset-0 flex items-center justify-center pt-2">
            <User className="h-10 w-10 text-muted-foreground/40" />
          </div>
        </div>
        
        {/* Professional Studio Headphones */}
        <div className="absolute top-[-4px] z-20 flex justify-between w-20">
          <div className="h-8 w-3 bg-[#111827] rounded-l-lg shadow-lg" />
          <div className="h-8 w-3 bg-[#111827] rounded-r-lg shadow-lg" />
          <Headphones className="absolute top-[-8px] left-1/2 -translate-x-1/2 h-20 w-20 text-accent/80 amazon-gold-glow" />
        </div>
        
        {/* Body: Dark Blazer over Light Grey Sweater */}
        <div className={cn(
          "w-28 h-28 bg-[#1f2937] rounded-t-[40px] mt-[-10px] relative transition-all duration-1000 shadow-xl",
          phase === 'inhale' && "scale-x-110 scale-y-105",
          phase === 'suspend' && "scale-x-105",
          phase === 'exhale' && "scale-x-95 scale-y-95"
        )}>
          {/* Light Grey Sweater V-Neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-[#d1d5db]" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* Hands demonstrating breathing (Diaphragm focus) */}
          <div className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 transition-all duration-1000",
            phase === 'inhale' && "translate-y-[-8px] gap-10",
            phase === 'suspend' && "translate-y-[-4px]",
            phase === 'exhale' && "translate-y-[4px] gap-2"
          )}>
            <div className="w-3 h-3 rounded-full bg-[#f3f4f6] shadow-md" />
            <div className="w-3 h-3 rounded-full bg-[#f3f4f6] shadow-md" />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
        Studio Specialist
      </div>
    </div>
  );
};

export default InstructorAvatar;