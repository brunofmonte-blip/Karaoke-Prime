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
}

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
  },
];