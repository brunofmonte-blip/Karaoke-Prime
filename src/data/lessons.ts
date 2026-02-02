export interface Lesson {
  level: number;
  title: string;
  focus: 'Pitch Stability' | 'Breath Control' | 'Vibrato Technique' | 'Vocal Range' | 'Rhythm & Timing';
  description: string;
  required_score: number; // Score needed to pass the lesson
}

export const academyLessons: Lesson[] = [
  { level: 1, title: "Foundation: Steady Breath", focus: 'Breath Control', description: "Mastering diaphragmatic breathing for sustained notes.", required_score: 60 },
  { level: 2, title: "Pitch Calibration I", focus: 'Pitch Stability', description: "Introduction to hitting and holding target notes accurately.", required_score: 65 },
  { level: 3, title: "Rhythm Basics", focus: 'Rhythm & Timing', description: "Keeping time and syncing vocals with the instrumental track.", required_score: 70 },
  { level: 4, title: "Vocal Warm-up Routines", focus: 'Vocal Range', description: "Expanding your comfortable singing range safely.", required_score: 75 },
  { level: 5, title: "Pitch Calibration II", focus: 'Pitch Stability', description: "Advanced exercises for micro-pitch adjustments and stability.", required_score: 80 },
  { level: 6, title: "Sustained Vibrato", focus: 'Vibrato Technique', description: "Developing a controlled and consistent vibrato.", required_score: 85 },
  { level: 7, title: "Dynamic Control", focus: 'Breath Control', description: "Controlling volume and intensity (pianissimo to fortissimo).", required_score: 88 },
  { level: 8, title: "Advanced Timing", focus: 'Rhythm & Timing', description: "Handling complex syncopation and phrasing.", required_score: 90 },
  { level: 9, title: "Vocal Agility", focus: 'Vocal Range', description: "Executing fast runs and melismas with precision.", required_score: 92 },
  { level: 10, title: "Pro-Vocal Test", focus: 'Pitch Stability', description: "Final assessment for vocal mastery and Backstage access.", required_score: 95 },
];