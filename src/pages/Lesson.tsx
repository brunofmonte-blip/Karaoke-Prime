import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Volume2, Activity, Info, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

type PhaseType = { phase: string; t: number; instruction: string; color: string; icon: any };

type LessonType = {
  id: number;
  displayTitle: string;
  title: string;
  youtubeId: string;
  hasPractice: boolean;
  locked: boolean;
  exercise?: string;
  practiceDesc?: string;
  feedbackTitle?: string;
  feedbackDesc?: string;
  frequency?: string;
  phases?: PhaseType[];
};

type ModuleType = {
  level: string;
  moduleName: string;
  lessons: LessonType[];
};

export default function Lesson() {
  const navigate = useNavigate();
  // A mágica do roteamento dinâmico: a URL dita o nível e a aula (ex: /lesson/3.4)
  const { id } = useParams(); 
  
  const levelId = id?.split('.')[0] || "1"; 
  const lessonIdStr = id?.split('.')[1];
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const isPremiumUser = user?.email === 'bruno.fmonte@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // ============================================================================
  // BANCO DE DADOS DEFINITIVO JULLIARD STANDARD (10 NÍVEIS)
  // ============================================================================
  const modulesData: Record<string, ModuleType> = {
    "1": {
      level: "Nível 1", moduleName: "Fundamentos e Respiração",
      lessons: [
        { id: 0, displayTitle: "Introdução", title: "A Base do Artista", youtubeId: "m75jPge9QUM", hasPractice: false, locked: false },
        { id: 1, displayTitle: "Aula 1", title: "Respiração Diafragmática", youtubeId: "Wl6xUHg9iAQ", hasPractice: true, locked: false,
          exercise: "Ciclo 4-4-10-4", practiceDesc: "Inspira (4s), Segura (4s), Expira (10s) e Descansa (4s).",
          feedbackTitle: "A Base da Resistência Vocal", feedbackDesc: "Sem ar, não há som. O controle do diafragma tira a sobrecarga da garganta.", frequency: "3x ao dia",
          phases: [{phase: 'INSPIRA', t: 4, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'SEGURA', t: 4, instruction: 'Mantenha o ar', color: 'orange', icon: Lock}, {phase: 'EXPIRA', t: 10, instruction: 'Solte o ar devagar', color: 'blue', icon: Mic2}, {phase: 'DESCANSA', t: 4, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 2, displayTitle: "Aula 2", title: "Controle de Fluxo de Ar", youtubeId: "fQKI_SFrrOo", hasPractice: true, locked: false,
          exercise: "Emissão de 'S'", practiceDesc: "Mantenha o som de 'S' constante e longo.",
          feedbackTitle: "Economia e Pressão", feedbackDesc: "Ensina suas pregas vocais a resistirem à pressão do ar.", frequency: "2x ao dia",
          phases: [{phase: 'INSPIRA', t: 4, instruction: 'Inspira fundo', color: 'cyan', icon: Wind}, {phase: 'SOLTE O S', t: 15, instruction: 'Mantenha o som constante', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 3, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", hasPractice: true, locked: true,
          exercise: "Teste de Sustentação", practiceDesc: "Sustente uma nota confortável sem oscilar.",
          feedbackTitle: "Estabilidade Tonal", feedbackDesc: "Cantar notas longas sem tremer a voz demonstra domínio técnico.", frequency: "Aquecimento diário",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Mantenha a nota', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", hasPractice: true, locked: true,
          exercise: "Lip Trill", practiceDesc: "Vibração de lábios contínua (Brrr).",
          feedbackTitle: "O Melhor Amigo", feedbackDesc: "Massageia as cordas vocais e equilibra a pressão do ar.", frequency: "Antes de cantar",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'VIBRAÇÃO', t: 10, instruction: 'Lip Trill (Brrr)', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 2, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 5, displayTitle: "Aula 5", title: "Soltando a Língua", youtubeId: "vImzV9TdLdo", hasPractice: true, locked: true,
          exercise: "Trinado de Língua", practiceDesc: "Vibração de língua contínua (Rrrr).",
          feedbackTitle: "Relaxamento Articulatório", feedbackDesc: "A tensão na raiz da língua causa quebra de voz.", frequency: "1x ao dia",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'TRINADO', t: 10, instruction: 'Rola os Rs', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 2, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 6, displayTitle: "Aula 6", title: "Sirene Vocal", youtubeId: "ZsvFS4u2P8I", hasPractice: true, locked: true,
          exercise: "Conexão", practiceDesc: "Deslize a voz imitando uma sirene.",
          feedbackTitle: "Conexão de Registros", feedbackDesc: "Apaga a linha que divide a voz de peito e cabeça.", frequency: "2x ao dia",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'SIRENE', t: 12, instruction: 'Grave pro Agudo e volta', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 7, displayTitle: "Aula 7", title: "Articulação Exagerada", youtubeId: "PW3Oj_uagpI", hasPractice: true, locked: true,
          exercise: "Vogais Abertas", practiceDesc: "Pronuncia A-E-I-O-U abrindo muito a boca.",
          feedbackTitle: "Dicção de Palco", feedbackDesc: "Abre espaço interno na boca, amplificando sua voz.", frequency: "Sempre",
          phases: [{phase: 'INSPIRA', t: 2, instruction: 'Ar rápido', color: 'cyan', icon: Wind}, {phase: 'ARTICULA', t: 8, instruction: 'A-E-I-O-U', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 8, displayTitle: "Aula 8", title: "Ataque Suave", youtubeId: "KqVkz8jdcpc", hasPractice: true, locked: true,
          exercise: "Sopro Inicial", practiceDesc: "Emite HÁ-HÉ-HÍ com sopro antes da nota.",
          feedbackTitle: "Fim da Borda de Glote", feedbackDesc: "O ataque suave é a cura para pregas vocais cansadas.", frequency: "3x ao dia",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'ATAQUE', t: 8, instruction: 'Sopro antes da nota', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 4, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 9, displayTitle: "Aula 9", title: "Ressonância Básica", youtubeId: "dHVMUp4MRD8", hasPractice: true, locked: true,
          exercise: "Humming", practiceDesc: "Boca Fechada 'Mmm' vibrando o nariz.",
          feedbackTitle: "Colocação na Máscara", feedbackDesc: "Traz o som da garganta para o rosto, dando brilho.", frequency: "2x ao dia",
          phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'HUMMING', t: 12, instruction: 'Vibra no nariz', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
        { id: 10, displayTitle: "Aula 10", title: "Prática Geral", youtubeId: "qpQuTYKLC-U", hasPractice: true, locked: true,
          exercise: "Estabilidade", practiceDesc: "Canta Frase Curta e avalia estabilidade.",
          feedbackTitle: "Consolidação Muscular", feedbackDesc: "A repetição correta cria memória muscular.", frequency: "Treino diário",
          phases: [{phase: 'OUVE', t: 5, instruction: 'Sinta a batida', color: 'cyan', icon: Music}, {phase: 'CANTA', t: 10, instruction: 'Execute a frase', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: 'IA Processando', color: 'blue', icon: Activity}] }
      ]
    },
    "2": {
      level: "Nível 2", moduleName: "Afinação Precisa",
      lessons: [
        { id: 0, displayTitle: "Introdução", title: "Fundamentos da Afinação", youtubeId: "8bR5O0hEMYU", hasPractice: false, locked: false },
        { id: 1, displayTitle: "Aula 1", title: "A Sirene Vocal", youtubeId: "TTVVJTnentM", hasPractice: true, locked: false,
          exercise: "Glissando", practiceDesc: "Deslize Lento passando por todas as notas.",
          feedbackTitle: "Mapeamento Tonal", feedbackDesc: "Você aprende a não pular os semitons.", frequency: "Aquecimento",
          phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'DESLIZA', t: 12, instruction: 'Sobe e Desce lento', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 2, displayTitle: "Aula 2", title: "Acertando o Alvo", youtubeId: "uIgaE7Ekh1k", hasPractice: true, locked: true,
          exercise: "Staccato", practiceDesc: "Ouve o Piano, Emite 'HÁ' Curto.",
          feedbackTitle: "Ataque Certeiro", feedbackDesc: "Treina a sua voz a acertar a nota sem escorregar antes.", frequency: "3x ao dia",
          phases: [{phase: 'OUVE', t: 2, instruction: 'Piano', color: 'cyan', icon: Music}, {phase: 'CANTA', t: 1, instruction: 'HÁ', color: 'orange', icon: Mic2}, {phase: 'PAUSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 3, displayTitle: "Aula 3", title: "A Escada Musical", youtubeId: "fsIczoqU89M", hasPractice: true, locked: true,
          exercise: "Escala Maior", practiceDesc: "Sobe e Desce Dó a Dó.",
          feedbackTitle: "Memória de Escala", feedbackDesc: "A escala maior é o mapa que impede você de se perder.", frequency: "Diário",
          phases: [{phase: 'OUVE', t: 2, instruction: 'Tom base', color: 'cyan', icon: Music}, {phase: 'ESCALA', t: 12, instruction: '1 a 8 e volta', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 6, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 4, displayTitle: "Aula 4", title: "Saltos Curtos", youtubeId: "Ld6XC8dlNlA", hasPractice: true, locked: true,
          exercise: "Terças", practiceDesc: "Canta Dó-Mi / Ré-Fá.",
          feedbackTitle: "Precisão Intermediária", feedbackDesc: "Cria memória muscular para transições comuns na música Pop.", frequency: "Diário",
          phases: [{phase: 'OUVE', t: 2, instruction: 'Acorde', color: 'cyan', icon: Music}, {phase: 'CANTA', t: 10, instruction: 'Saltos de Terça', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 5, displayTitle: "Aula 5", title: "Saltos Longos", youtubeId: "JRqTqIRCoWo", hasPractice: true, locked: true,
          exercise: "Oitavas", practiceDesc: "Pula Dó Grave pro Agudo.",
          feedbackTitle: "Elasticidade", feedbackDesc: "Dominar oitavas é essencial para refrões explosivos.", frequency: "1x ao dia",
          phases: [{phase: 'OUVE', t: 2, instruction: 'Referência', color: 'cyan', icon: Music}, {phase: 'PULA', t: 8, instruction: 'Grave pro Agudo', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 6, displayTitle: "Aula 6", title: "Sustentação Limpa", youtubeId: "cp1ICtprIwU", hasPractice: true, locked: true,
          exercise: "Pitch Hold", practiceDesc: "Sustenta a Nota Exata em linha reta.",
          feedbackTitle: "Controle de Micro-Tom", feedbackDesc: "Mantém a afinação cravada sem oscilar no final.", frequency: "Sempre",
          phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Reta e limpa', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 7, displayTitle: "Aula 7", title: "O Radar Cego", youtubeId: "sYQ_iugBGDE", hasPractice: true, locked: true,
          exercise: "Memória", practiceDesc: "Ouve a Nota, Silêncio, Canta às Cegas.",
          feedbackTitle: "Independência Auditiva", feedbackDesc: "Prepara você para cantar bem quando não estiver se ouvindo.", frequency: "Desafio",
          phases: [{phase: 'OUVE', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'MEMÓRIA', t: 3, instruction: 'Pense na nota', color: 'blue', icon: Lock}, {phase: 'CANTA', t: 10, instruction: 'Sem ouvir', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 8, displayTitle: "Aula 8", title: "Efeito Escorregador", youtubeId: "yfHrDfNBBH0", hasPractice: true, locked: true,
          exercise: "Slide", practiceDesc: "Começa baixo e escorrega até o Tom.",
          feedbackTitle: "Estilo", feedbackDesc: "Enfeite vocal muito usado no R&B e Pop moderno.", frequency: "Opcional",
          phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SLIDE', t: 8, instruction: 'Atinge o tom e crava', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 9, displayTitle: "Aula 9", title: "Encontrando o Tom", youtubeId: "iOOrgqzN0tY", hasPractice: true, locked: true,
          exercise: "Banda", practiceDesc: "Acha e Sustenta a Tônica por cima da base.",
          feedbackTitle: "Inteligência Musical", feedbackDesc: "Impede você de ser puxado para a nota errada pela banda.", frequency: "Sempre",
          phases: [{phase: 'OUVE BASE', t: 5, instruction: 'Sinta a harmonia', color: 'cyan', icon: Music}, {phase: 'SUSTENTA', t: 10, instruction: 'A Tônica', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 10, displayTitle: "Aula 10", title: "Desafio A Capella", youtubeId: "_nkKaweJPSk", hasPractice: true, locked: true,
          exercise: "Showcase", practiceDesc: "Canta sem base instrumental.",
          feedbackTitle: "Mestre da Afinação", feedbackDesc: "O teste final do seu ouvido interno.", frequency: "Teste final",
          phases: [{phase: 'OUVE TÔNICA', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'A CAPELLA', t: 15, instruction: 'No tom cravado', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 3, instruction: '', color: 'blue', icon: Activity}] }
      ]
    },
    "3": {
      level: "Nível 3", moduleName: "Ressonância e Dicção",
      lessons: [
        { id: 0, displayTitle: "Introdução", title: "Projeção de Palco", youtubeId: "IzZCDVzsghA", hasPractice: false, locked: false },
        { id: 1, displayTitle: "Aula 1", title: "O Despertar da Máscara", youtubeId: "vWuOiC1PqX0", hasPractice: true, locked: false, exercise: "Bocca Chiusa", practiceDesc: "Mastiga o som 'Hummm' e abre pra 'Mi'.", feedbackTitle: "Brilho Frontal", feedbackDesc: "O som sai mais alto sem forçar a garganta.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'HUM -> MI', t: 12, instruction: 'Máscara', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 2, displayTitle: "Aula 2", title: "Ginástica Articulatória", youtubeId: "ErZxD3GAP-o", hasPractice: true, locked: true, exercise: "Trava-Língua", practiceDesc: "Pronuncia 'Bra-Bre-Bri / Pa-Ta-Ka' rápido.", feedbackTitle: "Articulação", feedbackDesc: "Garante que o público entenda tudo.", frequency: "Aquecimento", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RÁPIDO', t: 10, instruction: 'Bra-Bre-Bri', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 3, displayTitle: "Aula 3", title: "A Ponte Vocal", youtubeId: "6U2Xk0OzsfA", hasPractice: true, locked: true, exercise: "Mix Voice", practiceDesc: "Sirene 'Uuu' aveludada do Peito à Cabeça.", feedbackTitle: "Transição Suave", feedbackDesc: "Elimina a quebra feia da voz.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PONTE', t: 12, instruction: 'Sem quebrar', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 4, displayTitle: "Aula 4", title: "A Base Sólida", youtubeId: "kp4Whqij-DE", hasPractice: true, locked: true, exercise: "Peito", practiceDesc: "Escala Descendente 'Báh-Báh' ancorada.", feedbackTitle: "Grave com Peso", feedbackDesc: "A autoridade da sua voz.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PEITO', t: 10, instruction: 'Báh-Báh', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 5, displayTitle: "Aula 5", title: "O Brilho", youtubeId: "GSR3YUQPHyM", hasPractice: true, locked: true, exercise: "Voz de Cabeça", practiceDesc: "Arpejo Ascendente 'Weee' no topo da cabeça.", feedbackTitle: "Agudos Leves", feedbackDesc: "Diferencia cabeça pura de falsete.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CABEÇA', t: 10, instruction: 'Weee limpo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 6, displayTitle: "Aula 6", title: "Modificação de Vogais", youtubeId: "K66Di3oSw7M", hasPractice: true, locked: true, exercise: "Arredondando", practiceDesc: "Sustenta e transita 'A-E-I-O-U' arredondando.", feedbackTitle: "Agudo Cheio", feedbackDesc: "Impede voz de taquara rachada.", frequency: "Técnica Mestra", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'VOGAIS', t: 12, instruction: 'A-E-I-O-U', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 7, displayTitle: "Aula 7", title: "O Groove da Dicção", youtubeId: "ZBL2BM-XqvI", hasPractice: true, locked: true, exercise: "Metrônomo", practiceDesc: "Canta 'Pa-Ta-Ka' no ritmo da batida.", feedbackTitle: "Swing Vocal", feedbackDesc: "Cantor é instrumento rítmico.", frequency: "Treino", phases: [{phase: 'OUVE RITMO', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'GROOVE', t: 10, instruction: 'No tempo', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 8, displayTitle: "Aula 8", title: "O Brilho do Twang", youtubeId: "", hasPractice: true, locked: true, exercise: "Twang", practiceDesc: "Imitar 'Nyeah' anasalado/estridente.", feedbackTitle: "Corte Metálico", feedbackDesc: "Garante que sua voz fure a banda inteira.", frequency: "Quando necessário", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'TWANG', t: 10, instruction: 'Nyeah!', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 9, displayTitle: "Aula 9", title: "O Mix Perfeito", youtubeId: "", hasPractice: true, locked: true, exercise: "Costura", practiceDesc: "Lamento 'Gug-Gug' subindo e descendo.", feedbackTitle: "Domínio", feedbackDesc: "Mistura força de peito com brilho de cabeça.", frequency: "Avançado", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'LAMENTO', t: 12, instruction: 'Gug-Gug', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 10, displayTitle: "Aula 10", title: "Desafio da Dicção", youtubeId: "", hasPractice: true, locked: true, exercise: "Integração", practiceDesc: "Canta 'Bla-bla', depois Letra Real Exagerada.", feedbackTitle: "Pronto pro Show", feedbackDesc: "Sua dicção agora é de um profissional.", frequency: "Showcase", phases: [{phase: 'BASE', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'BLA-BLA', t: 8, instruction: '', color: 'orange', icon: Activity}, {phase: 'LETRA REAL', t: 8, instruction: 'Exagerado', color: 'blue', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] }
      ]
    },
    "4": {
      level: "Nível 4", moduleName: "Ritual de Alta Performance",
      lessons: [
        { id: 0, displayTitle: "Introdução", title: "Emoção Pura", youtubeId: "", hasPractice: false, locked: false },
        { id: 1, displayTitle: "Aula 1", title: "Técnica Bocejo-Suspiro", youtubeId: "", hasPractice: true, locked: false, exercise: "Relaxamento", practiceDesc: "Inspira bocejando (4s), Expira suspirando (6s).", feedbackTitle: "Espaço Interno", feedbackDesc: "Remove a tensão da laringe.", frequency: "Diário", phases: [{phase: 'BOCEJA', t: 4, instruction: 'Boca fechada', color: 'cyan', icon: Wind}, {phase: 'SUSPIRA', t: 6, instruction: 'Pelo nariz', color: 'orange', icon: Wind}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 2, displayTitle: "Aula 2", title: "Boca Chiusa Oitavada", youtubeId: "", hasPractice: true, locked: true, exercise: "Escala Fechada", practiceDesc: "Sobe/Desce cantando 'Hmmm' relaxado.", feedbackTitle: "Ressonância Calma", feedbackDesc: "Aquece cordas e ossos da face suavemente.", frequency: "Aquecimento", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'HMMM', t: 12, instruction: 'Sobe e Desce', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 3, displayTitle: "Aula 3", title: "Fonação com Canudo", youtubeId: "", hasPractice: true, locked: true, exercise: "SOVT", practiceDesc: "Canta a música favorita soprando o canudo.", feedbackTitle: "Controle de Pressão", feedbackDesc: "Alinha a pressão acima e abaixo das pregas.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CANUDO', t: 15, instruction: 'Sopre cantando', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 4, displayTitle: "Aula 4", title: "Vibração Labial Portamento", youtubeId: "", hasPractice: true, locked: true, exercise: "Brrr Contínuo", practiceDesc: "'Brrr' escorregando notas do grave ao agudo.", feedbackTitle: "Massagem", feedbackDesc: "Solta a voz para atingir notas altas fáceis.", frequency: "Aquecimento", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'BRRR', t: 12, instruction: 'Escorregando', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 5, displayTitle: "Aula 5", title: "Vibração de Língua", youtubeId: "", hasPractice: true, locked: true, exercise: "Escala em R", practiceDesc: "Rola os 'Rs' subindo a escala.", feedbackTitle: "Sem Tensão", feedbackDesc: "Solta a base da língua totalmente.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RRRR', t: 10, instruction: 'Subindo', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 6, displayTitle: "Aula 6", title: "Afrouxar a Mandíbula", youtubeId: "", hasPractice: true, locked: true, exercise: "Bocejo Falso", practiceDesc: "Massagem/Bocejo e Canta relaxando o maxilar.", feedbackTitle: "Boca Aberta", feedbackDesc: "Maxilar travado engole o som.", frequency: "Sempre", phases: [{phase: 'MASSAGEM', t: 5, instruction: 'Solte o maxilar', color: 'cyan', icon: Activity}, {phase: 'CANTA', t: 10, instruction: 'Bem solto', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 7, displayTitle: "Aula 7", title: "Portamento Duas Oitavas", youtubeId: "", hasPractice: true, locked: true, exercise: "Deslize Épico", practiceDesc: "Deslize 'Eeee' ou 'Ohhh' cruzando 2 oitavas.", feedbackTitle: "Extensão", feedbackDesc: "Passeia por toda a sua extensão vocal.", frequency: "Avançado", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'DESLIZE', t: 12, instruction: 'Muito longo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 8, displayTitle: "Aula 8", title: "Exercício da Sirene", youtubeId: "", hasPractice: true, locked: true, exercise: "Oooo Longo", practiceDesc: "Sirene cobrindo tons intermediários lentos.", feedbackTitle: "Mix Suave", feedbackDesc: "Ajuste fino da transição de registros.", frequency: "Sempre", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SIRENE', t: 12, instruction: 'Oooo', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 9, displayTitle: "Aula 9", title: "Deslize Vocal (Pulos)", youtubeId: "", hasPractice: true, locked: true, exercise: "Saltos", practiceDesc: "Pula direto para a próxima nota sem cantar o meio.", feedbackTitle: "Exatidão", feedbackDesc: "Você acerta o alvo de primeira.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PULA', t: 10, instruction: 'Cravando', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
        { id: 10, displayTitle: "Aula 10", title: "Canto Expresso", youtubeId: "", hasPractice: true, locked: true, exercise: "Apoio 100%", practiceDesc: "Canta frase focando 100% no apoio diafragmático.", feedbackTitle: "Finalização", feedbackDesc: "A união de relaxamento e técnica pura.", frequency: "Showcase", phases: [{phase: 'POSTURA', t: 3, instruction: 'Abdômen firme', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 12, instruction: 'Com alma e apoio', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
      ]
    },
    // Você pode plugar os níveis 5 a 10 seguindo a mesma estrutura assim que os links estiverem prontos!
    "5": { level: "Nível 5", moduleName: "Falsetes e Melismas", lessons: [{ id: 0, displayTitle: "Introdução", title: "Agilidade", youtubeId: "", hasPractice: false, locked: false }, { id: 1, displayTitle: "Aula 1", title: "Falsete vs Cabeça", youtubeId: "", hasPractice: true, locked: true, exercise: "Transição", practiceDesc: "Alterna Soprado e Firme (10s)", phases: [{phase: 'CANTA', t: 10, instruction: 'Alterne sopro e limpo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] }] },
    "6": { level: "Nível 6", moduleName: "Vibrato Master", lessons: [{ id: 0, displayTitle: "Introdução", title: "Oscilação", youtubeId: "", hasPractice: false, locked: false }] },
    "7": { level: "Nível 7", moduleName: "Drives e Rasps", lessons: [{ id: 0, displayTitle: "Introdução", title: "Distorção Segura", youtubeId: "", hasPractice: false, locked: false }] },
    "8": { level: "Nível 8", moduleName: "Agudos Extremos", lessons: [{ id: 0, displayTitle: "Introdução", title: "Belting", youtubeId: "", hasPractice: false, locked: false }] },
    "9": { level: "Nível 9", moduleName: "Micro-Dinâmica", lessons: [{ id: 0, displayTitle: "Introdução", title: "Texturas", youtubeId: "", hasPractice: false, locked: false }] },
    "10": { level: "Nível 10", moduleName: "O Estúdio de Alta Performance", lessons: [{ id: 0, displayTitle: "Introdução", title: "Masterclass", youtubeId: "", hasPractice: false, locked: false }] },
  };

  // Resolve qual nível e aula estamos visualizando
  const currentModule = modulesData[levelId] || modulesData["1"];
  const getInitialLessonIndex = () => {
    if (!lessonIdStr || lessonIdStr === 'intro') return 0;
    return parseInt(lessonIdStr) || 0;
  };

  const [activeLessonIndex, setActiveLessonIndex] = useState(getInitialLessonIndex());
  const [step, setStep] = useState<'video' | 'practice'>('video');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 

  useEffect(() => {
    if (id) {
      setActiveLessonIndex(getInitialLessonIndex());
      setStep('video');
      setTrainingStatus('idle');
    }
  }, [id]);

  const currentLesson = currentModule.lessons.find(l => l.id === activeLessonIndex);
  const isIntroActive = activeLessonIndex === 0;

  // Controle de Timer e Áudio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (trainingStatus === 'countdown') {
      if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      else {
        setTrainingStatus('active');
        if (audioRef.current) { audioRef.current.volume = 0.2; audioRef.current.play().catch(() => {}); }
      }
    } else if (trainingStatus === 'active') {
      if (timeLeft > 0) timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      else {
        setTrainingStatus('finished');
        if (audioRef.current) audioRef.current.pause();
      }
    }
    return () => clearTimeout(timer);
  }, [trainingStatus, countdown, timeLeft]);

  // MOTOR DINÂMICO DE CICLOS (Lê as 'phases' do Banco de Dados automaticamente)
  const getCycleState = () => {
    if (!currentLesson || !currentLesson.phases || currentLesson.phases.length === 0) {
      return { phase: 'CANTA', instruction: 'Treino livre', color: 'cyan', icon: Mic2 };
    }
    
    const elapsed = 60 - timeLeft;
    const phases = currentLesson.phases;
    const totalCycleTime = phases.reduce((acc, p) => acc + p.t, 0);
    const tInCycle = elapsed % totalCycleTime;

    let currentT = 0;
    for (const phase of phases) {
      currentT += phase.t;
      if (tInCycle < currentT) return phase;
    }
    return phases[0];
  };

  const cycleState = getCycleState();
  const CycleIcon = cycleState.icon;

  const changeLesson = (lessonId: number) => {
    if (lessonId > 0) {
      const target = currentModule.lessons.find(l => l.id === lessonId);
      if (target?.locked && !isPremiumUser) {
        toast.error("Aula Bloqueada. Assine o Premium para acessar!");
        return;
      }
    }
    navigate(`/lesson/${levelId}.${lessonId === 0 ? 'intro' : lessonId}`);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  const videoToPlay = isIntroActive ? currentModule.introVideo : currentLesson?.youtubeId;
  const displayLabel = isIntroActive ? "AULA INTRODUTÓRIA" : `AULA ${currentLesson?.id}`;
  const displayTitle = isIntroActive ? currentModule.moduleName : currentLesson?.title;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans text-white">
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" loop />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors w-fit">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-3">
             <PlayCircle size={14} /> MASTERCLASS - NÍVEL {levelId}
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight flex flex-col">
            {displayLabel}: <span className={isIntroActive ? "text-orange-500" : "text-cyan-400"}>{displayTitle}</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="lg:w-2/3 flex flex-col gap-6">
            {step === 'video' ? (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 mb-8 relative">
                  {videoToPlay ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoToPlay}?rel=0&modestbranding=1`} title={displayTitle} frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full"></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-gray-500"><Lock className="h-12 w-12 mb-4 opacity-50"/><p className="font-bold uppercase tracking-widest text-xs">VÍDEO EM PRODUÇÃO</p></div>
                  )}
                </div>
                <div className="flex justify-end">
                  {!isIntroActive && currentLesson?.hasPractice && (
                    <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xl italic uppercase tracking-tighter transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105">
                      INICIAR TREINAMENTO <ArrowLeft size={20} className="ml-3 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Card className="bg-zinc-950/80 backdrop-blur-xl border-cyan-400/30 rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col justify-center items-center animate-in zoom-in-95">
                {trainingStatus === 'idle' ? (
                  <div className="flex flex-col items-center text-center">
                    <Mic2 className="h-16 w-16 text-cyan-400 mb-6" />
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{currentLesson?.exercise}</h2>
                    <p className="text-gray-400 mb-10 max-w-lg">{currentLesson?.practiceDesc}</p>
                    <Button onClick={() => setTrainingStatus('countdown')} className="h-16 px-12 rounded-full bg-cyan-400 text-black font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)]">COMEÇAR CRONÔMETRO (60s)</Button>
                  </div>
                ) : trainingStatus === 'countdown' ? (
                  <h1 className="text-9xl font-black italic text-cyan-400 animate-pulse">{countdown}</h1>
                ) : trainingStatus === 'active' ? (
                  <div className="flex flex-col items-center text-center w-full">
                    <div className="relative flex items-center justify-center mb-8">
                      <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <circle cx="112" cy="112" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`transition-all duration-1000 ease-linear ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <CycleIcon size={32} className={`mb-2 ${cycleState.color === 'cyan' ? 'text-cyan-400' : cycleState.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} />
                        <p className="font-black text-3xl italic">{timeLeft}s</p>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black italic uppercase mb-2 text-white">{cycleState.phase}</h3>
                    <p className="text-xl font-bold text-cyan-400 uppercase tracking-widest">{cycleState.instruction}</p>
                  </div>
                ) : (
                  <div className="text-center w-full max-w-2xl">
                    <CheckCircle2 size={64} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-black italic mb-8 uppercase text-white">Treino Concluído!</h2>
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-10 text-left">
                      <div className="flex items-center gap-3 mb-4"><Info size={20} className="text-cyan-400" /><h4 className="text-cyan-400 font-black uppercase tracking-widest text-sm">{currentLesson?.feedbackTitle}</h4></div>
                      <p className="text-gray-300 text-sm font-medium leading-relaxed mb-6">{currentLesson?.feedbackDesc}</p>
                      <div className="bg-black/50 rounded-xl p-4 border border-white/5 flex items-start gap-3"><Activity size={16} className="text-orange-500 shrink-0 mt-0.5" /><div><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Frequência Recomendada</p><p className="text-sm font-bold text-white">{currentLesson?.frequency}</p></div></div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => { setStep('video'); setTrainingStatus('idle'); setTimeLeft(60); }} className="bg-white text-black font-black uppercase rounded-full px-8 h-12">VOLTAR PARA AULA</Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <ListVideo className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black text-white uppercase tracking-widest text-sm">PLAYLIST NÍVEL {levelId}</h3>
             </div>
             
             <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[2rem] p-4 overflow-y-auto max-h-[800px] space-y-3 custom-scrollbar">
                {currentModule.lessons.map((lesson) => {
                  const isLockedForUser = lesson.locked && !isPremiumUser;
                  const isIntro = lesson.id === 0;
                  return (
                    <Card key={lesson.id} onClick={() => changeLesson(lesson.id)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${activeLessonIndex === lesson.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'} ${isLockedForUser ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                       {isLockedForUser ? <Lock size={20} className="shrink-0" /> : <PlayCircle size={20} className="shrink-0" />}
                       <div>
                         <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">{isIntro ? "Introdução" : `Aula ${lesson.id}`}</p>
                         <p className="text-sm font-black italic uppercase line-clamp-1">{isIntro ? currentModule.moduleName : lesson.title}</p>
                       </div>
                    </Card>
                  );
                })}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}