export interface Lesson {
  level: number;
  title: string;
  focus: 'Pitch Stability' | 'Breath Control' | 'Vibrato Technique' | 'Vocal Range' | 'Rhythm & Timing';
  description: string;
  required_score: number;
  bgImage: string;
}

export const academyLessons: Lesson[] = [
  { 
    level: 1, 
    title: "Foundation: Steady Breath", 
    focus: 'Breath Control', 
    description: "Mastering diaphragmatic breathing for sustained notes.", 
    required_score: 60,
    bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600" // Airy Studio
  },
  { 
    level: 2, 
    title: "Pitch Calibration I", 
    focus: 'Pitch Stability', 
    description: "Introduction to hitting and holding target notes accurately.", 
    required_score: 65,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600" // Vocal Booth
  },
  { 
    level: 3, 
    title: "Rhythm Basics", 
    focus: 'Rhythm & Timing', 
    description: "Keeping time and syncing vocals with the instrumental track.", 
    required_score: 70,
    bgImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600" // Stage
  },
  { 
    level: 4, 
    title: "Vocal Warm-up Routines", 
    focus: 'Vocal Range', 
    description: "Expanding your comfortable singing range safely.", 
    required_score: 75,
    bgImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600" // Rehearsal Room
  },
  { 
    level: 5, 
    title: "Pitch Calibration II", 
    focus: 'Pitch Stability', 
    description: "Advanced exercises for micro-pitch adjustments and stability.", 
    required_score: 80,
    bgImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600" // Control Room
  },
  { 
    level: 6, 
    title: "Sustained Vibrato", 
    focus: 'Vibrato Technique', 
    description: "Developing a controlled and consistent vibrato.", 
    required_score: 85,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600" // Pro Booth
  },
  { 
    level: 7, 
    title: "Dynamic Control", 
    focus: 'Breath Control', 
    description: "Controlling volume and intensity (pianissimo to fortissimo).", 
    required_score: 88,
    bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600" // Large Hall
  },
  { 
    level: 8, 
    title: "Advanced Timing", 
    focus: 'Rhythm & Timing', 
    description: "Handling complex syncopation and phrasing.", 
    required_score: 90,
    bgImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1600" // Jazz Club
  },
  { 
    level: 9, 
    title: "Vocal Agility", 
    focus: 'Vocal Range', 
    description: "Executing fast runs and melismas with precision.", 
    required_score: 92,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600" // Modern Studio
  },
  { 
    level: 10, 
    title: "Pro-Vocal Test", 
    focus: 'Pitch Stability', 
    description: "Final assessment for vocal mastery and Backstage access.", 
    required_score: 95,
    bgImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600" // Grand Stage
  },
];