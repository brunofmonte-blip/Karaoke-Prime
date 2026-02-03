export interface LyricLine {
  time: number; // time in seconds when the line starts
  text: string;
}

export interface PublicDomainSong {
  id: string;
  title: string;
  artist: string;
  audioUrl: string; // Placeholder for public domain audio
  lyrics: LyricLine[];
  referenceMelody: { time: number, frequency: number }[]; // Reference melody for scoring (mock data)
  genre: 'Rock Classics' | 'Pop Anthems' | 'Folk/Traditional' | 'Vocal Exercises';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
}

// Helper function to get XP multiplier based on difficulty
export const getDifficultyMultiplier = (difficulty: PublicDomainSong['difficulty']): number => {
  switch (difficulty) {
    case 'Hard':
      return 1.5;
    case 'Medium':
      return 1.2;
    case 'Easy':
    default:
      return 1.0;
  }
};

// Mock reference melody data (simplified: time in seconds, frequency in Hz)
const generateMockMelody = (duration: number): { time: number, frequency: number }[] => {
  const melody = [];
  for (let t = 0; t < duration; t += 1) {
    // Simulate a simple rising and falling pitch pattern
    const freq = 200 + 100 * Math.sin(t / 5) + 50 * Math.cos(t / 2);
    melody.push({ time: t, frequency: Math.max(80, Math.min(500, freq)) });
  }
  return melody;
};

export const publicDomainLibrary: PublicDomainSong[] = [
  // --- Rock Classics (New) ---
  {
    id: "pd-12",
    title: "House of the Rising Sun",
    artist: "Traditional",
    audioUrl: "/audio/rising-sun.mp3",
    lyrics: [
      { time: 0.0, text: "There is a house in New Orleans" },
      { time: 4.0, text: "They call the Rising Sun" },
      { time: 8.0, text: "And it's been the ruin of many a poor boy" },
      { time: 12.0, text: "And God I know I'm one." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Rock Classics',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500", // Stage lights
  },
  {
    id: "pd-13",
    title: "Amazing Grace (Rock Version)",
    artist: "John Newton",
    audioUrl: "/audio/amazing-grace.mp3",
    lyrics: [
      { time: 0.0, text: "Amazing grace! How sweet the sound" },
      { time: 4.0, text: "That saved a wretch like me!" },
      { time: 8.0, text: "I once was lost, but now am found;" },
      { time: 12.0, text: "Was blind, but now I see." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Rock Classics',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1519732773401-d92c7293764c?q=80&w=500", // Singer silhouette
  },
  {
    id: "pd-14",
    title: "Danny Boy (Acoustic)",
    artist: "Frederic Weatherly",
    audioUrl: "/audio/danny-boy.mp3",
    lyrics: [
      { time: 0.0, text: "Oh, Danny Boy, the pipes, the pipes are calling," },
      { time: 5.0, text: "From glen to glen, and down the mountain side." },
      { time: 10.0, text: "The summer's gone, and all the roses falling," },
      { time: 15.0, text: "'Tis you, 'tis you must go and I must bide." },
    ],
    referenceMelody: generateMockMelody(20),
    genre: 'Rock Classics',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1501084817091-ec513ea013b6?q=80&w=500", // Guitar/Acoustic
  },
  
  // --- Pop Anthems (New) ---
  {
    id: "pd-15",
    title: "Ode to Joy (Pop Mix)",
    artist: "Ludwig van Beethoven",
    audioUrl: "/audio/ode-to-joy.mp3", 
    lyrics: [
      { time: 0.0, text: "Freude, schöner Götterfunken," },
      { time: 3.5, text: "Tochter aus Elysium," },
      { time: 7.0, text: "Wir betreten feuertrunken," },
      { time: 10.5, text: "Himmlische, dein Heiligtum!" },
    ],
    referenceMelody: generateMockMelody(15),
    genre: 'Pop Anthems',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500", // Microphone/Studio
  },
  {
    id: "pd-16",
    title: "Auld Lang Syne (Dance Remix)",
    artist: "Robert Burns",
    audioUrl: "/audio/auld-lang-syne.mp3",
    lyrics: [
      { time: 0.0, text: "Should auld acquaintance be forgot," },
      { time: 4.0, text: "And never brought to mind?" },
      { time: 8.0, text: "Should auld acquaintance be forgot," },
      { time: 12.0, text: "And days o' auld lang syne?" },
    ],
    referenceMelody: generateMockMelody(16),
    genre: 'Pop Anthems',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500", // Concert crowd
  },
  {
    id: "pd-17",
    title: "The Star-Spangled Banner (A Capella)",
    artist: "Francis Scott Key",
    audioUrl: "/audio/star-spangled.mp3",
    lyrics: [
      { time: 0.0, text: "Oh, say can you see by the dawn's early light," },
      { time: 5.0, text: "What so proudly we hailed at the twilight's last gleaming?" },
      { time: 10.0, text: "Whose broad stripes and bright stars through the perilous fight," },
      { time: 15.0, text: "O'er the ramparts we watched were so gallantly streaming?" },
    ],
    referenceMelody: generateMockMelody(20),
    genre: 'Pop Anthems',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500", // Patriotic/Stage
  },

  // --- Folk/Traditional (New) ---
  {
    id: "pd-18",
    title: "Greensleeves (Traditional)",
    artist: "Traditional English Folk",
    audioUrl: "/audio/greensleeves.mp3", 
    lyrics: [
      { time: 0.0, text: "Alas, my love, you do me wrong," },
      { time: 4.0, text: "To cast me off discourteously." },
      { time: 8.0, text: "For I have loved you well and long," },
      { time: 12.0, text: "Delighting in your company." },
    ],
    referenceMelody: generateMockMelody(16),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1505705694340-aba0e606b796?q=80&w=500", // Nature/Acoustic
  },
  {
    id: "pd-19",
    title: "O Sole Mio (Classical)",
    artist: "Eduardo di Capua",
    audioUrl: "/audio/sole-mio.mp3",
    lyrics: [
      { time: 0.0, text: "Che bella cosa na jurnata 'e sole," },
      { time: 4.0, text: "N'aria serena doppo na tempesta!" },
      { time: 8.0, text: "Pe' ll'aria fresca pare già na festa..." },
      { time: 12.0, text: "Che bella cosa na jurnata 'e sole." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Folk/Traditional',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b9b7a1c69202?q=80&w=500", // Opera/Classical
  },
  {
    id: "pd-20",
    title: "Asa Branca (Folk)",
    artist: "Luiz Gonzaga",
    audioUrl: "/audio/asa-branca.mp3",
    lyrics: [
      { time: 0.0, text: "Quando olhei a terra ardendo," },
      { time: 3.0, text: "Qual fogueira de São João," },
      { time: 6.0, text: "Eu perguntei, ai, a Deus do céu, ai," },
      { time: 9.0, text: "Por que tamanha judiação." },
    ],
    referenceMelody: generateMockMelody(15),
    genre: 'Folk/Traditional',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500", // Brazilian folk theme
  },
  
  // --- Vocal Exercises (New) ---
  {
    id: "pd-21",
    title: "Scale Practice: C Major",
    artist: "Vocal Coach AI",
    audioUrl: "/audio/scale-c.mp3",
    lyrics: [
      { time: 0.0, text: "Doh, Re, Mi, Fa, Sol, La, Ti, Doh" },
      { time: 4.0, text: "Doh, Ti, La, Sol, Fa, Mi, Re, Doh" },
    ],
    referenceMelody: generateMockMelody(10),
    genre: 'Vocal Exercises',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500", // Studio/Mic
  },
  {
    id: "pd-22",
    title: "Vibrato Drill: Long Tones",
    artist: "Vocal Coach AI",
    audioUrl: "/audio/vibrato-drill.mp3",
    lyrics: [
      { time: 0.0, text: "Aaaaaaah (Hold)" },
      { time: 5.0, text: "Eeeeeeeh (Hold)" },
    ],
    referenceMelody: generateMockMelody(12),
    genre: 'Vocal Exercises',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500", // Abstract sound waves
  },
  {
    id: "pd-23",
    title: "Rhythm Syncopation Test",
    artist: "Vocal Coach AI",
    audioUrl: "/audio/rhythm-test.mp3",
    lyrics: [
      { time: 0.0, text: "One and Two and Three and Four and" },
      { time: 4.0, text: "Syncopate the beat now" },
    ],
    referenceMelody: generateMockMelody(8),
    genre: 'Vocal Exercises',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500", // Abstract rhythm
  },
  
  // --- Existing songs (re-categorized) ---
  {
    id: "pd-1",
    title: "Ode to Joy (Instrumental)",
    artist: "Ludwig van Beethoven",
    audioUrl: "/audio/ode-to-joy.mp3", 
    lyrics: [
      { time: 0.0, text: "Freude, schöner Götterfunken," },
      { time: 3.5, text: "Tochter aus Elysium," },
      { time: 7.0, text: "Wir betreten feuertrunken," },
      { time: 10.5, text: "Himmlische, dein Heiligtum!" },
    ],
    referenceMelody: generateMockMelody(15),
    genre: 'Folk/Traditional',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b9b7a1c69202?q=80&w=500",
  },
  {
    id: "pd-2",
    title: "Greensleeves (Instrumental)",
    artist: "Traditional English Folk",
    audioUrl: "/audio/greensleeves.mp3", 
    lyrics: [
      { time: 0.0, text: "Alas, my love, you do me wrong," },
      { time: 4.0, text: "To cast me off discourteously." },
      { time: 8.0, text: "For I have loved you well and long," },
      { time: 12.0, text: "Delighting in your company." },
    ],
    referenceMelody: generateMockMelody(16),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1505705694340-aba0e606b796?q=80&w=500",
  },
  {
    id: "pd-3",
    title: "The Star-Spangled Banner",
    artist: "Francis Scott Key",
    audioUrl: "/audio/star-spangled.mp3",
    lyrics: [
      { time: 0.0, text: "Oh, say can you see by the dawn's early light," },
      { time: 5.0, text: "What so proudly we hailed at the twilight's last gleaming?" },
      { time: 10.0, text: "Whose broad stripes and bright stars through the perilous fight," },
      { time: 15.0, text: "O'er the ramparts we watched were so gallantly streaming?" },
    ],
    referenceMelody: generateMockMelody(20),
    genre: 'Pop Anthems',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500",
  },
  {
    id: "pd-4",
    title: "O Sole Mio",
    artist: "Eduardo di Capua",
    audioUrl: "/audio/sole-mio.mp3",
    lyrics: [
      { time: 0.0, text: "Che bella cosa na jurnata 'e sole," },
      { time: 4.0, text: "N'aria serena doppo na tempesta!" },
      { time: 8.0, text: "Pe' ll'aria fresca pare già na festa..." },
      { time: 12.0, text: "Che bella cosa na jurnata 'e sole." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Folk/Traditional',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b9b7a1c69202?q=80&w=500",
  },
  {
    id: "pd-5",
    title: "Asa Branca (Folk)",
    artist: "Luiz Gonzaga",
    audioUrl: "/audio/asa-branca.mp3",
    lyrics: [
      { time: 0.0, text: "Quando olhei a terra ardendo," },
      { time: 3.0, text: "Qual fogueira de São João," },
      { time: 6.0, text: "Eu perguntei, ai, a Deus do céu, ai," },
      { time: 9.0, text: "Por que tamanha judiação." },
    ],
    referenceMelody: generateMockMelody(15),
    genre: 'Folk/Traditional',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500",
  },
  {
    id: "pd-6",
    title: "Auld Lang Syne",
    artist: "Robert Burns",
    audioUrl: "/audio/auld-lang-syne.mp3",
    lyrics: [
      { time: 0.0, text: "Should auld acquaintance be forgot," },
      { time: 4.0, text: "And never brought to mind?" },
      { time: 8.0, text: "Should auld acquaintance be forgot," },
      { time: 12.0, text: "And days o' auld lang syne?" },
    ],
    referenceMelody: generateMockMelody(16),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500",
  },
  {
    id: "pd-7",
    title: "Amazing Grace",
    artist: "John Newton",
    audioUrl: "/audio/amazing-grace.mp3",
    lyrics: [
      { time: 0.0, text: "Amazing grace! How sweet the sound" },
      { time: 4.0, text: "That saved a wretch like me!" },
      { time: 8.0, text: "I once was lost, but now am found;" },
      { time: 12.0, text: "Was blind, but now I see." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1519732773401-d92c7293764c?q=80&w=500",
  },
  {
    id: "pd-8",
    title: "Danny Boy",
    artist: "Frederic Weatherly",
    audioUrl: "/audio/danny-boy.mp3",
    lyrics: [
      { time: 0.0, text: "Oh, Danny Boy, the pipes, the pipes are calling," },
      { time: 5.0, text: "From glen to glen, and down the mountain side." },
      { time: 10.0, text: "The summer's gone, and all the roses falling," },
      { time: 15.0, text: "'Tis you, 'tis you must go and I must bide." },
    ],
    referenceMelody: generateMockMelody(20),
    genre: 'Folk/Traditional',
    difficulty: 'Hard',
    imageUrl: "https://images.unsplash.com/photo-1501084817091-ec513ea013b6?q=80&w=500",
  },
  {
    id: "pd-9",
    title: "House of the Rising Sun",
    artist: "Traditional",
    audioUrl: "/audio/rising-sun.mp3",
    lyrics: [
      { time: 0.0, text: "There is a house in New Orleans" },
      { time: 4.0, text: "They call the Rising Sun" },
      { time: 8.0, text: "And it's been the ruin of many a poor boy" },
      { time: 12.0, text: "And God I know I'm one." },
    ],
    referenceMelody: generateMockMelody(18),
    genre: 'Rock Classics',
    difficulty: 'Medium',
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500",
  },
  {
    id: "pd-10",
    title: "When the Saints Go Marching In",
    artist: "Traditional",
    audioUrl: "/audio/saints.mp3",
    lyrics: [
      { time: 0.0, text: "Oh, when the saints go marching in," },
      { time: 4.0, text: "Oh, when the saints go marching in," },
      { time: 8.0, text: "Lord, I want to be in that number," },
      { time: 12.0, text: "When the saints go marching in." },
    ],
    referenceMelody: generateMockMelody(16),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500",
  },
  {
    id: "pd-11",
    title: "Cai Cai Balão (Traditional)",
    artist: "Traditional Brazilian Folk",
    audioUrl: "/audio/cai-cai-balao.mp3",
    lyrics: [
      { time: 0.0, text: "Cai, cai, balão, cai, cai, balão," },
      { time: 3.0, text: "Aqui na minha mão." },
      { time: 6.0, text: "Não cai não, não cai não, não cai não," },
      { time: 9.0, text: "Cai na rua do sabão." },
    ],
    referenceMelody: generateMockMelody(12),
    genre: 'Folk/Traditional',
    difficulty: 'Easy',
    imageUrl: "https://images.unsplash.com/photo-1517457375823-3203864a9009?q=80&w=500",
  },
];