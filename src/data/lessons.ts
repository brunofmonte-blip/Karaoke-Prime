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
    bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600"
  },
  { 
    level: 2, 
    title: "Pitch Calibration I", 
    focus: 'Pitch Stability', 
    description: "Introduction to hitting and holding target notes accurately.", 
    required_score: 65,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600"
  },
  { 
    level: 3, 
    title: "Rhythm Basics", 
    focus: 'Rhythm & Timing', 
    description: "Keeping time and syncing vocals with the instrumental track.", 
    required_score: 70,
    bgImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600"
  },
  { 
    level: 4, 
    title: "Vocal Warm-up Routines", 
    focus: 'Vocal Range', 
    description: "Expanding your comfortable singing range safely.", 
    required_score: 75,
    bgImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600"
  },
  { 
    level: 5, 
    title: "Pitch Calibration II", 
    focus: 'Pitch Stability', 
    description: "Advanced exercises for micro-pitch adjustments and stability.", 
    required_score: 80,
    bgImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600"
  },
  { 
    level: 6, 
    title: "Vibrato Sustentado", 
    focus: 'Vibrato Technique', 
    description: "Desenvolvendo um vibrato controlado, consistente e relaxado.", 
    required_score: 85,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600"
  },
  { 
    level: 7, 
    title: "Transição de Registros", 
    focus: 'Vocal Range', 
    description: "Dominando o Passaggio: conectando a voz de peito e cabeça sem quebras.", 
    required_score: 88,
    bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600"
  },
  { 
    level: 8, 
    title: "Potência e Belting", 
    focus: 'Breath Control', 
    description: "Cantando notas agudas com força, volume e segurança.", 
    required_score: 90,
    bgImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1600"
  },
  { 
    level: 9, 
    title: "Riffs e Runs Avançados", 
    focus: 'Vocal Range', 
    description: "Acrobacias vocais complexas e agilidade extrema.", 
    required_score: 92,
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600"
  },
  { 
    level: 10, 
    title: "Resistência e Performance", 
    focus: 'Pitch Stability', 
    description: "O teste final: afinação perfeita sob fadiga e variação de estilo.", 
    required_score: 95,
    bgImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600"
  },
];