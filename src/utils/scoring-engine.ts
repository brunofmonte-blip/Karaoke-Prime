import { PublicDomainSong } from '@/data/public-domain-library';
import { VocalSandboxContextType } from '@/hooks/use-vocal-sandbox';

interface ChartDataItem {
  name: string;
  pitch: number;
  breath: number;
}

export interface PerformanceInsight {
  accuracyScore: number; // 0-100
  improvementTips: string[];
}

/**
 * Mock Scoring Engine: Simulates comparing user pitch history against a reference melody.
 * Since we don't have real-time frequency data or a complex Web Audio setup,
 * this function uses the simplified 0-100 pitch scale for calculation and generates mock tips.
 */
export const runScoringEngine = (
  pitchHistory: ChartDataItem[], 
  song: PublicDomainSong
): PerformanceInsight => {
  if (pitchHistory.length === 0) {
    return { accuracyScore: 0, improvementTips: ["No vocal data recorded. Try singing louder!"] };
  }

  // 1. Calculate Accuracy Score (Mock: Average of recorded pitch data)
  const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
  const averagePitch = totalPitch / pitchHistory.length;
  
  // Simulate a slight penalty/bonus based on the song's complexity (mock reference melody length)
  const complexityFactor = song.referenceMelody.length > 18 ? 0.95 : 1.0;
  let accuracyScore = Math.min(100, averagePitch * complexityFactor);

  // 2. Generate Improvement Tips (Mock based on score range)
  const tips: string[] = [];
  
  if (accuracyScore < 65) {
    tips.push("Fundamental pitch stability is low. Focus on Academy Lesson 2: Pitch Calibration I.");
  } else if (accuracyScore < 80) {
    tips.push("Good start! Work on sustaining notes longer. Try Academy Lesson 1: Steady Breath.");
  } else if (accuracyScore < 90) {
    tips.push("Excellent performance! To reach Pro-Vocal status, focus on micro-pitch adjustments (Academy Lesson 5).");
  } else {
    tips.push("Vocal Master! Your pitch accuracy is outstanding. Consider applying for Next Talent auditions.");
  }

  // Mock tip based on simulated pitch variance (if variance was high)
  const pitchValues = pitchHistory.map(p => p.pitch);
  const maxPitch = Math.max(...pitchValues);
  const minPitch = Math.min(...pitchValues);
  const variance = maxPitch - minPitch;

  if (variance > 40) {
    tips.push("High pitch variance detected. Try to hold the long notes steady.");
  }

  return {
    accuracyScore: accuracyScore,
    improvementTips: tips,
  };
};