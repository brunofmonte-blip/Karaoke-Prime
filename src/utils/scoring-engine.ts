import { PublicDomainSong } from '@/data/public-domain-library';
import { ChartDataItem } from '@/hooks/use-vocal-sandbox';

export interface PerformanceInsight {
  pitchAccuracy: number; // 0-100
  rhythmPrecision: number; // 0-100
  vocalStability: number; // 0-100
  improvementTips: string[];
}

// Helper function to convert frequency (Hz) to MIDI note number
const freqToMidi = (frequency: number): number => {
  if (frequency <= 0) return 0;
  // Standard MIDI formula: M = 69 + 12 * log2(f / 440)
  return 69 + 12 * Math.log2(frequency / 440);
};

/**
 * Mock Scoring Engine: Simulates comparing user pitch history against a reference melody.
 */
export const runScoringEngine = (
  pitchHistory: ChartDataItem[], 
  song: PublicDomainSong
): PerformanceInsight => {
  if (pitchHistory.length === 0) {
    return { pitchAccuracy: 0, rhythmPrecision: 0, vocalStability: 0, improvementTips: ["No vocal data recorded. Try singing louder!"] };
  }

  let totalScore = 0;
  let totalPoints = 0;
  let highNoteSharpCount = 0;
  let lowNoteFlatCount = 0;
  
  // 1. Calculate Average Reference Pitch (Hz) for simplified comparison
  const totalRefFreq = song.referenceMelody.reduce((sum, item) => sum + item.frequency, 0);
  const averageRefFreq = totalRefFreq / song.referenceMelody.length;
  const averageRefMidi = freqToMidi(averageRefFreq);

  // 2. Compare User History against Average Reference Pitch
  for (const userPoint of pitchHistory) {
    if (userPoint.frequency > 0) {
      const userMidi = freqToMidi(userPoint.frequency);
      const diff = Math.abs(userMidi - averageRefMidi);
      
      let pointScore = 0;
      if (diff < 0.2) {
        pointScore = 100; // Perfect match
      } else if (diff < 1.0) {
        pointScore = 70; // Close (less than a semitone off)
      } else if (diff < 2.0) {
        pointScore = 50; // Semi-tone off
      } else {
        pointScore = 0; // Wrong note
      }
      
      totalScore += pointScore;
      totalPoints++;

      // Mock diagnostic tracking (1.5 semitones off)
      if (userMidi > averageRefMidi + 1.5) highNoteSharpCount++;
      if (userMidi < averageRefMidi - 1.5) lowNoteFlatCount++;
    }
  }

  const pitchAccuracy = totalPoints > 0 ? (totalScore / totalPoints) : 0;

  // 3. Calculate Vocal Stability (Inverse of pitch variance in the 0-100 scale)
  const pitchValues = pitchHistory.map(p => p.pitch);
  const maxPitch = Math.max(...pitchValues);
  const minPitch = Math.min(...pitchValues);
  const variance = maxPitch - minPitch;
  const vocalStability = Math.max(0, 100 - variance); 
  
  // 4. Mock Rhythm Precision (Randomized based on overall pitch accuracy)
  const rhythmPrecision = Math.min(100, pitchAccuracy + (Math.random() * 10 - 5)); // +/- 5 points from pitch

  // 5. Generate Improvement Tips
  const tips: string[] = [];
  
  if (pitchAccuracy < 60) {
    tips.push("Fundamental pitch stability is low. Focus on Academy Lesson 2: Pitch Calibration I.");
  } else if (pitchAccuracy < 80) {
    tips.push("Good start! Work on sustaining notes longer. Try Academy Lesson 1: Steady Breath.");
  } else if (pitchAccuracy < 90) {
    tips.push("Excellent performance! Focus on micro-pitch adjustments (Academy Lesson 5) for higher scores.");
  } else {
    tips.push("Vocal Master! Your pitch accuracy is outstanding. Consider applying for Next Talent auditions.");
  }

  if (highNoteSharpCount / pitchHistory.length > 0.15) {
    tips.push("Your high notes were consistently sharp. Try relaxing your jaw and throat.");
  }
  if (lowNoteFlatCount / pitchHistory.length > 0.15) {
    tips.push("Your low notes were consistently flat. Ensure you are supporting your breath from the diaphragm.");
  }
  
  if (rhythmPrecision < 70) {
    tips.push("Rhythm needs work. Pay close attention to the instrumental track timing.");
  }
  
  if (vocalStability < 75) {
    tips.push("Vocal stability is low. Practice holding long tones without wavering.");
  }

  return {
    pitchAccuracy: pitchAccuracy,
    rhythmPrecision: rhythmPrecision,
    vocalStability: vocalStability,
    improvementTips: tips,
  };
};