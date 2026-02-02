import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LyricLine } from '@/data/public-domain-library';

interface LyricPlayerProps {
  lyrics: LyricLine[];
  currentTime: number; // Current playback time in seconds
}

const LyricPlayer: React.FC<LyricPlayerProps> = ({ lyrics, currentTime }) => {
  
  // Determine the currently active line
  const activeLineIndex = useMemo(() => {
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) {
        activeIndex = i;
      } else {
        // Assuming lyrics are sorted by time, we can stop early
        break;
      }
    }
    return activeIndex;
  }, [lyrics, currentTime]);

  // Determine the next line for context
  const nextLineIndex = activeLineIndex !== -1 && activeLineIndex < lyrics.length - 1 
    ? activeLineIndex + 1 
    : -1;

  // Get the active line text
  const activeLine = activeLineIndex !== -1 ? lyrics[activeLineIndex] : null;
  const nextLine = nextLineIndex !== -1 ? lyrics[nextLineIndex] : null;

  // Simple word highlighting logic (Mock: highlight words sequentially)
  const highlightedText = useMemo(() => {
    if (!activeLine) return null;
    
    const words = activeLine.text.split(/\s+/);
    
    // Estimate line duration based on the next line's start time, or assume 4 seconds if it's the last line
    const lineDuration = (nextLine?.time || currentTime + 4) - activeLine.time; 
    const wordDuration = lineDuration / words.length;
    
    // Determine how many words should be highlighted based on time elapsed in the line
    const timeInLine = currentTime - activeLine.time;
    const wordsHighlightedCount = Math.floor(timeInLine / wordDuration);
    
    return (
      <p className="text-3xl font-extrabold text-center transition-colors duration-100">
        {words.map((word, index) => (
          <span 
            key={index} 
            className={cn(
              "mx-1 transition-colors duration-100",
              index < wordsHighlightedCount ? "text-primary neon-blue-glow" : "text-foreground/80"
            )}
          >
            {word}
          </span>
        ))}
      </p>
    );
  }, [activeLine, nextLine, currentTime]);


  return (
    <div className="h-24 flex flex-col justify-center items-center overflow-hidden">
      {activeLine ? (
        <>
          {highlightedText}
          {nextLine && (
            <p className="text-lg text-muted-foreground mt-2 opacity-70 transition-opacity duration-500">
              {nextLine.text}
            </p>
          )}
        </>
      ) : (
        <p className="text-xl text-muted-foreground italic">
          {currentTime === 0 ? "Ready to sing..." : "End of song."}
        </p>
      )}
    </div>
  );
};

export default LyricPlayer;