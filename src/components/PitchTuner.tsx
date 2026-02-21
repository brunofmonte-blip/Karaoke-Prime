"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Target, Zap } from 'lucide-react';

interface PitchTunerProps {
  frequency: number;
  isVisible?: boolean;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const getNoteFromFreq = (freq: number) => {
  if (freq <= 0) return null;
  const n = 12 * Math.log2(freq / 440) + 69;
  const midi = Math.round(n);
  const noteName = NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  const cents = Math.floor((n - midi) * 100);
  
  return { note: `${noteName}${octave}`, cents, midi };
};

const PitchTuner: React.FC<PitchTunerProps> = ({ frequency, isVisible = true }) => {
  const noteData = useMemo(() => getNoteFromFreq(frequency), [frequency]);
  
  if (!isVisible) return (
    <div className="h-48 flex items-center justify-center glass-pillar border-2 border-primary/20 rounded-2xl">
      <p className="text-muted-foreground italic animate-pulse">Blind Tuning Active...</p>
    </div>
  );

  const isLaser = noteData && Math.abs(noteData.cents) < 5;

  return (
    <div className={cn(
      "relative h-48 flex flex-col items-center justify-center glass-pillar border-2 transition-all duration-300 rounded-2xl overflow-hidden",
      isLaser ? "border-accent shadow-lg shadow-accent/30" : "border-primary/30"
    )}>
      {/* Cent Scale */}
      <div className="absolute top-4 left-0 right-0 px-8 flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest notranslate" translate="no">
        <span>-50</span>
        <span>0</span>
        <span>+50</span>
      </div>

      {/* Tuner Needle Area */}
      <div className="w-full px-8 mt-4 relative h-8">
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1 bg-border/30 rounded-full" />
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/50" />
        
        {noteData && (
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-1 transition-all duration-100 shadow-lg",
              isLaser ? "bg-accent w-1.5" : "bg-primary"
            )}
            style={{ left: `calc(50% + ${noteData.cents}%)`, transform: 'translateX(-50%)' }}
          />
        )}
      </div>

      {/* Note Display */}
      <div className="mt-4 text-center">
        {noteData ? (
          <>
            <div className="flex items-center justify-center gap-2">
              <span className={cn(
                "text-5xl font-black tracking-tighter notranslate",
                isLaser ? "text-accent neon-gold-glow" : "text-foreground"
              )} translate="no">
                {noteData.note}
              </span>
              {isLaser && <Zap className="h-6 w-6 text-accent amazon-gold-glow animate-bounce" />}
            </div>
            <div className="flex items-center justify-center gap-4 mt-1">
              <span className="text-xs font-bold text-muted-foreground">{frequency.toFixed(1)} Hz</span>
              <span className={cn(
                "text-xs font-bold notranslate",
                isLaser ? "text-accent" : noteData.cents > 0 ? "text-destructive" : "text-primary"
              )} translate="no">
                {noteData.cents > 0 ? `+${noteData.cents}` : noteData.cents} cents
              </span>
            </div>
          </>
        ) : (
          <span className="text-2xl font-bold text-muted-foreground/30">SILÊNCIO</span>
        )}
      </div>

      {/* Laser Status */}
      {isLaser && (
        <div className="absolute bottom-2 flex items-center gap-1 text-[10px] font-black text-accent uppercase tracking-widest animate-pulse">
          <Target className="h-3 w-3" />
          Laser Attack Active
        </div>
      )}
    </div>
  );
};

export default PitchTuner;