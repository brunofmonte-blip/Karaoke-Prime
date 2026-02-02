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
}

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
  {
    id: "pd-1",
    title: "Ode to Joy (Instrumental)",
    artist: "Ludwig van Beethoven",
    audioUrl: "/audio/ode-to-joy.mp3", // Placeholder path
    lyrics: [
      { time: 0.0, text: "Freude, schöner Götterfunken," },
      { time: 3.5, text: "Tochter aus Elysium," },
      { time: 7.0, text: "Wir betreten feuertrunken," },
      { time: 10.5, text: "Himmlische, dein Heiligtum!" },
    ],
    referenceMelody: generateMockMelody(15),
  },
  {
    id: "pd-2",
    title: "Greensleeves (Instrumental)",
    artist: "Traditional English Folk",
    audioUrl: "/audio/greensleeves.mp3", // Placeholder path
    lyrics: [
      { time: 0.0, text: "Alas, my love, you do me wrong," },
      { time: 4.0, text: "To cast me off discourteously." },
      { time: 8.0, text: "For I have loved you well and long," },
      { time: 12.0, text: "Delighting in your company." },
    ],
    referenceMelody: generateMockMelody(16),
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
  },
];