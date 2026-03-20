import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2, ListVideo, CheckCircle2, Lock, Wind, Coffee, Volume2, Activity, Info, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// O Motor de Treino
import { VocalSandboxProvider } from '@/hooks/use-vocal-sandbox';
import FarinelliExercise from '@/components/FarinelliExercise';
import PitchCalibrationExercise from '@/components/PitchCalibrationExercise';

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

// ============================================================================
// O GRANDE BANCO DE DADOS DEFINITIVO KARAOKE PRIME (JULLIARD STANDARD)
// ============================================================================
const academyData: Record<string, { level: string, moduleName: string, introVideo: string, lessons: LessonType[] }> = {
  "1": {
    level: "Nível 1", moduleName: "Fundamentos e Respiração", introVideo: "m75jPge9QUM",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Respiração Diafragmática", youtubeId: "Wl6xUHg9iAQ", hasPractice: true, locked: false,
        exercise: "Ciclo 4-4-10-4", practiceDesc: "Inspira (4s), Segura (4s), Expira (10s) e Descansa (4s).",
        feedbackTitle: "A Base da Resistência", feedbackDesc: "O controle do diafragma tira a sobrecarga da sua garganta.", frequency: "3x ao dia",
        phases: [{phase: 'INSPIRA', t: 4, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'SEGURA', t: 4, instruction: 'Mantenha o ar', color: 'orange', icon: Lock}, {phase: 'EXPIRA', t: 10, instruction: 'Solte o ar devagar', color: 'blue', icon: Mic2}, {phase: 'DESCANSA', t: 4, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Controle de Fluxo de Ar", youtubeId: "fQKI_SFrrOo", hasPractice: true, locked: false,
        exercise: "Emissão de 'S'", practiceDesc: "Mantenha o som de 'S' constante.",
        feedbackTitle: "Economia e Pressão", feedbackDesc: "Ensina as pregas vocais a resistirem à pressão do ar.", frequency: "2x ao dia",
        phases: [{phase: 'INSPIRA', t: 4, instruction: 'Inspira fundo', color: 'cyan', icon: Wind}, {phase: 'SOLTE O S', t: 15, instruction: 'Mantenha o som constante', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 3, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", hasPractice: true, locked: true,
        exercise: "Teste de Sustentação", practiceDesc: "Mantenha uma nota confortável sem oscilar.",
        feedbackTitle: "Estabilidade Tonal", feedbackDesc: "Cantar notas longas sem tremer demonstra domínio técnico.", frequency: "Aquecimento diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Mantenha a nota', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", hasPractice: true, locked: true,
        exercise: "Lip Trill", practiceDesc: "Vibração de lábios contínua (Brrr).",
        feedbackTitle: "O Melhor Amigo", feedbackDesc: "Massageia as cordas vocais e equilibra a pressão.", frequency: "Antes de cantar",
        phases: [{phase: 'INSPIRA', t: 3, instruction: 'Puxe o ar', color: 'cyan', icon: Wind}, {phase: 'VIBRAÇÃO', t: 10, instruction: 'Lip Trill (Brrr)', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 2, instruction: 'Relaxe', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Soltando a Língua", youtubeId: "vImzV9TdLdo", hasPractice: true, locked: true,
        exercise: "Trinado de Língua", practiceDesc: "Vibração de língua contínua (Rrrr).",
        feedbackTitle: "Relaxamento Articulatório", feedbackDesc: "A tensão na língua causa quebra de voz.", frequency: "1x ao dia",
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
    level: "Nível 2", moduleName: "Afinação Precisa", introVideo: "8bR5O0hEMYU",
    lessons: [
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
        feedbackTitle: "Precisão Intermediária", feedbackDesc: "Cria memória muscular para transições comuns.", frequency: "Diário",
        phases: [{phase: 'OUVE', t: 2, instruction: 'Acorde', color: 'cyan', icon: Music}, {phase: 'CANTA', t: 10, instruction: 'Saltos de Terça', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Saltos Longos", youtubeId: "JRqTqIRCoWo", hasPractice: true, locked: true,
        exercise: "Oitavas", practiceDesc: "Pula Dó Grave pro Agudo.",
        feedbackTitle: "Elasticidade", feedbackDesc: "Dominar oitavas é essencial para refrões explosivos.", frequency: "1x ao dia",
        phases: [{phase: 'OUVE', t: 2, instruction: 'Referência', color: 'cyan', icon: Music}, {phase: 'PULA', t: 8, instruction: 'Grave pro Agudo', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Sustentação Limpa", youtubeId: "cp1ICtprIwU", hasPractice: true, locked: true,
        exercise: "Pitch Hold", practiceDesc: "Sustenta a Nota Exata em linha reta.",
        feedbackTitle: "Controle de Micro-Tom", feedbackDesc: "Mantém a afinação cravada sem oscilar.", frequency: "Sempre",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Reta e limpa', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "O Radar Cego", youtubeId: "sYQ_iugBGDE", hasPractice: true, locked: true,
        exercise: "Memória", practiceDesc: "Ouve a Nota, Silêncio, Canta às Cegas.",
        feedbackTitle: "Independência Auditiva", feedbackDesc: "Prepara você para cantar bem sem se ouvir.", frequency: "Desafio",
        phases: [{phase: 'OUVE', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'MEMÓRIA', t: 3, instruction: 'Pense na nota', color: 'blue', icon: Lock}, {phase: 'CANTA', t: 10, instruction: 'Sem ouvir', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Efeito Escorregador", youtubeId: "yfHrDfNBBH0", hasPractice: true, locked: true,
        exercise: "Slide", practiceDesc: "Começa baixo e escorrega até o Tom.",
        feedbackTitle: "Estilo", feedbackDesc: "Enfeite vocal muito usado no R&B e Pop moderno.", frequency: "Opcional",
        phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SLIDE', t: 8, instruction: 'Atinge o tom e crava', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Encontrando o Tom", youtubeId: "iOOrgqzN0tY", hasPractice: true, locked: true,
        exercise: "Banda", practiceDesc: "Acha e Sustenta a Tônica por cima da base.",
        feedbackTitle: "Inteligência Musical", feedbackDesc: "Impede você de ser puxado para a nota errada.", frequency: "Sempre",
        phases: [{phase: 'OUVE BASE', t: 5, instruction: 'Sinta a harmonia', color: 'cyan', icon: Music}, {phase: 'SUSTENTA', t: 10, instruction: 'A Tônica', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "Desafio A Capella", youtubeId: "_nkKaweJPSk", hasPractice: true, locked: true,
        exercise: "Showcase", practiceDesc: "Canta sem base instrumental.",
        feedbackTitle: "Mestre da Afinação", feedbackDesc: "O teste final do seu ouvido interno.", frequency: "Teste final",
        phases: [{phase: 'OUVE TÔNICA', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'A CAPELLA', t: 15, instruction: 'No tom cravado', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 3, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "3": {
    level: "Nível 3", moduleName: "Ressonância e Dicção", introVideo: "IzZCDVzsghA",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Despertar da Máscara", youtubeId: "vWuOiC1PqX0", hasPractice: true, locked: false,
        exercise: "Bocca Chiusa", practiceDesc: "Mastiga o som 'Hummm' e abre pra 'Mi'.",
        feedbackTitle: "Brilho Frontal", feedbackDesc: "O som sai mais alto sem forçar a garganta.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'HUM -> MI', t: 12, instruction: 'Máscara', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Ginástica Articulatória", youtubeId: "ErZxD3GAP-o", hasPractice: true, locked: true,
        exercise: "Trava-Língua", practiceDesc: "Pronuncia 'Bra-Bre-Bri / Pa-Ta-Ka' rápido.",
        feedbackTitle: "Articulação", feedbackDesc: "Garante que o público entenda tudo.", frequency: "Aquecimento",
        phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RÁPIDO', t: 10, instruction: 'Bra-Bre-Bri', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "A Ponte Vocal", youtubeId: "6U2Xk0OzsfA", hasPractice: true, locked: true,
        exercise: "Mix Voice", practiceDesc: "Sirene 'Uuu' aveludada do Peito à Cabeça.",
        feedbackTitle: "Transição Suave", feedbackDesc: "Elimina a quebra feia da voz.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PONTE', t: 12, instruction: 'Sem quebrar', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "A Base Sólida", youtubeId: "kp4Whqij-DE", hasPractice: true, locked: true,
        exercise: "Peito", practiceDesc: "Escala Descendente 'Báh-Báh' ancorada.",
        feedbackTitle: "Grave com Peso", feedbackDesc: "A autoridade da sua voz.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PEITO', t: 10, instruction: 'Báh-Báh', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "O Brilho da Cabeça", youtubeId: "GSR3YUQPHyM", hasPractice: true, locked: true,
        exercise: "Voz de Cabeça", practiceDesc: "Arpejo Ascendente 'Weee' no topo da cabeça.",
        feedbackTitle: "Agudos Leves", feedbackDesc: "Diferencia cabeça pura de falsete.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CABEÇA', t: 10, instruction: 'Weee limpo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Modificação de Vogais", youtubeId: "K66Di3oSw7M", hasPractice: true, locked: true,
        exercise: "Arredondando", practiceDesc: "Sustenta e transita 'A-E-I-O-U' arredondando.",
        feedbackTitle: "Agudo Cheio", feedbackDesc: "Impede voz de taquara rachada.", frequency: "Técnica Mestra",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'VOGAIS', t: 12, instruction: 'A-E-I-O-U', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "O Groove da Dicção", youtubeId: "ZBL2BM-XqvI", hasPractice: true, locked: true,
        exercise: "Metrônomo", practiceDesc: "Canta 'Pa-Ta-Ka' no ritmo da batida.",
        feedbackTitle: "Swing Vocal", feedbackDesc: "Cantor é instrumento rítmico.", frequency: "Treino",
        phases: [{phase: 'OUVE RITMO', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'GROOVE', t: 10, instruction: 'No tempo', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "O Brilho do Twang", youtubeId: "R8KYAK62gtk", hasPractice: true, locked: true,
        exercise: "Twang", practiceDesc: "Imitar 'Nyeah' anasalado/estridente.",
        feedbackTitle: "Corte Metálico", feedbackDesc: "Garante que sua voz fure a banda inteira.", frequency: "Quando necessário",
        phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'TWANG', t: 10, instruction: 'Nyeah!', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "O Mix Perfeito", youtubeId: "ec5tuQ1bhb0", hasPractice: true, locked: true,
        exercise: "Costura", practiceDesc: "Lamento 'Gug-Gug' subindo e descendo.",
        feedbackTitle: "Domínio", feedbackDesc: "Mistura força de peito com brilho de cabeça.", frequency: "Avançado",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'LAMENTO', t: 12, instruction: 'Gug-Gug', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "Desafio Final da Dicção", youtubeId: "kbNjMQwzJX8", hasPractice: true, locked: true,
        exercise: "Integração", practiceDesc: "Canta 'Bla-bla', depois Letra Real Exagerada.",
        feedbackTitle: "Pronto pro Show", feedbackDesc: "Sua dicção agora é de um profissional.", frequency: "Showcase",
        phases: [{phase: 'BASE', t: 2, instruction: '', color: 'cyan', icon: Music}, {phase: 'BLA-BLA', t: 8, instruction: '', color: 'orange', icon: Activity}, {phase: 'LETRA REAL', t: 8, instruction: 'Exagerado', color: 'blue', icon: Mic2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] }
    ]
  },
  "4": {
    level: "Nível 4", moduleName: "Ritual de Alta Performance", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Técnica Bocejo-Suspiro", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false,
        exercise: "Relaxamento", practiceDesc: "Inspira bocejando (4s), Expira suspirando (6s).",
        feedbackTitle: "Espaço Interno", feedbackDesc: "Remove a tensão da laringe.", frequency: "Diário",
        phases: [{phase: 'BOCEJA', t: 4, instruction: 'Boca fechada', color: 'cyan', icon: Wind}, {phase: 'SUSPIRA', t: 6, instruction: 'Pelo nariz', color: 'orange', icon: Wind}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Boca Chiusa Oitavada", youtubeId: "eZdxnM36wSQ", hasPractice: true, locked: true,
        exercise: "Escala Fechada", practiceDesc: "Sobe/Desce cantando 'Hmmm' relaxado.",
        feedbackTitle: "Ressonância Calma", feedbackDesc: "Aquece cordas e ossos da face suavemente.", frequency: "Aquecimento",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'HMMM', t: 12, instruction: 'Sobe e Desce', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Fonação com Canudo", youtubeId: "lIq4vd2K-rE", hasPractice: true, locked: true,
        exercise: "SOVT", practiceDesc: "Canta a música favorita soprando o canudo.",
        feedbackTitle: "Controle de Pressão", feedbackDesc: "Alinha a pressão acima e abaixo das pregas.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CANUDO', t: 15, instruction: 'Sopre cantando', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Vibração Labial Portamento", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Brrr Contínuo", practiceDesc: "'Brrr' escorregando notas do grave ao agudo.",
        feedbackTitle: "Massagem", feedbackDesc: "Solta a voz para atingir notas altas fáceis.", frequency: "Aquecimento",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'BRRR', t: 12, instruction: 'Escorregando', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Vibração de Língua", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Escala em R", practiceDesc: "Rola os 'Rs' subindo a escala.",
        feedbackTitle: "Sem Tensão", feedbackDesc: "Solta a base da língua totalmente.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RRRR', t: 10, instruction: 'Subindo', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 2, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Afrouxar a Mandíbula", youtubeId: "C7qjWI6OyAM", hasPractice: true, locked: true,
        exercise: "Bocejo Falso", practiceDesc: "Massagem/Bocejo e Canta relaxando o maxilar.",
        feedbackTitle: "Boca Aberta", feedbackDesc: "Maxilar travado engole o som.", frequency: "Sempre",
        phases: [{phase: 'MASSAGEM', t: 5, instruction: 'Solte o maxilar', color: 'cyan', icon: Activity}, {phase: 'CANTA', t: 10, instruction: 'Bem solto', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Portamento Duas Oitavas", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Deslize Épico", practiceDesc: "Deslize 'Eeee' ou 'Ohhh' cruzando 2 oitavas.",
        feedbackTitle: "Extensão", feedbackDesc: "Passeia por toda a sua extensão vocal.", frequency: "Avançado",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'DESLIZE', t: 12, instruction: 'Muito longo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Exercício da Sirene", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Oooo Longo", practiceDesc: "Sirene cobrindo tons intermediários lentos.",
        feedbackTitle: "Mix Suave", feedbackDesc: "Ajuste fino da transição de registros.", frequency: "Sempre",
        phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SIRENE', t: 12, instruction: 'Oooo', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Deslize Vocal (Pulos)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Saltos", practiceDesc: "Pula direto para a próxima nota sem cantar o meio.",
        feedbackTitle: "Exatidão", feedbackDesc: "Você acerta o alvo de primeira.", frequency: "Diário",
        phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PULA', t: 10, instruction: 'Cravando', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "Canto Diafragmático Expresso", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true,
        exercise: "Apoio 100%", practiceDesc: "Canta frase focando 100% no apoio diafragmático.",
        feedbackTitle: "Finalização", feedbackDesc: "A união de relaxamento e técnica pura.", frequency: "Showcase",
        phases: [{phase: 'POSTURA', t: 3, instruction: 'Abdômen firme', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 12, instruction: 'Com alma e apoio', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "5": {
    level: "Nível 5", moduleName: "Falsetes e Melismas", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Falsete vs Cabeça", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Transição", practiceDesc: "Alterna Soprado e Firme (10s).", feedbackTitle: "Agilidade", feedbackDesc: "Crie a textura perfeita.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ALTERNA', t: 10, instruction: 'Soprado e Firme', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Iodelei (Quebra Controlada)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Quebra", practiceDesc: "Quebra Peito/Falsete propositalmente (10s).", feedbackTitle: "Estilo", feedbackDesc: "A quebra intencional é uma arte.", frequency: "Treino", phases: [{phase: 'INSPIRA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'QUEBRA', t: 10, instruction: 'Peito para Falsete', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Pentatônica Básica", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sobe/Desce", practiceDesc: "Sobe/Desce 5 notas lentas (12s).", feedbackTitle: "O Mapa do Melisma", feedbackDesc: "Tudo começa na escala pentatônica.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ESCALA', t: 12, instruction: '5 notas lentas', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Trincas (Melismas Curtos)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "3 Notas Rápido", practiceDesc: "Desce 3 notas rápidas (8s).", feedbackTitle: "Agilidade Curta", feedbackDesc: "A semente da corrida vocal.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'TRINCA', t: 8, instruction: 'Rápido', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Corridas Vocais (Runs)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Run 5-8", practiceDesc: "Executa run de 5-8 notas (10s).", feedbackTitle: "Virtuose", feedbackDesc: "Fluência em notas rápidas.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RUN', t: 10, instruction: 'Desce a escala', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Modificação Rápida de Vogais", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Ah para Uh", practiceDesc: "Melisma fechando o formato do Ah para Uh (10s).", feedbackTitle: "Formato do Melisma", feedbackDesc: "Evita esgasgar na descida.", frequency: "Constante", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'MODIFICA', t: 10, instruction: 'Ah -> Uh', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Groove Pentatônico", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Metrônomo", practiceDesc: "Canta as 5 notas cravadas no metrônomo (12s).", feedbackTitle: "No Tempo", feedbackDesc: "Um melisma fora do tempo é um erro.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'GROOVE', t: 12, instruction: 'Cravado', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Flicks e Apoggiaturas", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Flicks", practiceDesc: "Deslizes muito rápidos no final da nota (10s).", feedbackTitle: "Enfeite Final", feedbackDesc: "A assinatura R&B na sua voz.", frequency: "Repertório", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'FLICK', t: 10, instruction: 'Rápido no fim', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Sustentação Soprosa", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sustenta", practiceDesc: "Sustenta falsete economizando ar (12s).", feedbackTitle: "Leveza Tonal", feedbackDesc: "O clímax sussurrado.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Soprado e contínuo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "Rotina Diva/Pop", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Executa Base", practiceDesc: "Executa Base Pop com 2 melismas obrigatórios (15s).", feedbackTitle: "O Palco", feedbackDesc: "Hora de brilhar.", frequency: "Showcase", phases: [{phase: 'BASE', t: 5, instruction: 'Sinta', color: 'cyan', icon: Wind}, {phase: 'EXECUTA', t: 15, instruction: 'Com Melismas', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "6": {
    level: "Nível 6", moduleName: "Vibrato Master", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Fantasma (Pulso Natural)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Sirene Tremente", practiceDesc: "Sirene 'Uuuh' deixando o final tremer solto (12s).", feedbackTitle: "Natural", feedbackDesc: "O vibrato não se força, ele acontece.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SIRENE', t: 12, instruction: 'Tremer o final', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Trinado de Semitom", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Lento", practiceDesc: "Alterna duas notas vizinhas lentamente (10s).", feedbackTitle: "Controle", feedbackDesc: "Você entende a origem da oscilação.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'TRINADO', t: 10, instruction: 'Lento', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Acelerador de Metrônomo", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Acelera", practiceDesc: "Começa lento e dobra a velocidade da oscilação (12s).", feedbackTitle: "Domínio Absoluto", feedbackDesc: "O vibrato serve a você, não o contrário.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ACELERA', t: 12, instruction: 'Lento -> Rápido', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Laríngeo vs Diafragmático", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Oscila", practiceDesc: "Oscila na garganta (rápido) / Pulsa no abdômen (lento) (10s).", feedbackTitle: "Consciência Corporal", feedbackDesc: "Sentindo a origem do som.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'OSCILA', t: 10, instruction: 'Alterne os músculos', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Straight to Vibrato", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Reta p/ Vib", practiceDesc: "Segura nota reta (4s) | Solta Vibrato no fim (4s).", feedbackTitle: "Estilo Broadway", feedbackDesc: "Dinâmica perfeita para musicais.", frequency: "Repertório", phases: [{phase: 'RETA', t: 4, instruction: 'Sem vibrar', color: 'cyan', icon: Wind}, {phase: 'VIBRA', t: 4, instruction: 'Solta no fim', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Equalização de Vogais", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "A-E-I-O-U", practiceDesc: "Vibra A-E-I-O-U mantendo a mesma velocidade (12s).", feedbackTitle: "Homogeneidade", feedbackDesc: "A mesma assinatura em todas as palavras.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'VIBRA', t: 12, instruction: 'Vogais constantes', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Vibrato de Pressão (Agudos)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Agudos", practiceDesc: "Canta agudo com apoio total e vibra sem cair a nota (10s).", feedbackTitle: "Fôlego", feedbackDesc: "Agudos pedem apoio extra.", frequency: "Avançado", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'VIBRA', t: 10, instruction: 'Agudo e Apoiado', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Vibrato de Peso (Graves)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Graves", practiceDesc: "Canta nota baixa sem sumir a voz ao vibrar (10s).", feedbackTitle: "Presença", feedbackDesc: "Grave precisa de espaço.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'VIBRA', t: 10, instruction: 'Grave presente', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Amplitude Estética", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Pop vs Teatro", practiceDesc: "Alterna Vibrato Estreito (Pop) e Largo (Teatro) (12s).", feedbackTitle: "Versatilidade", feedbackDesc: "Cante qualquer gênero.", frequency: "Repertório", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ALTERNA', t: 12, instruction: 'Estreito -> Largo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "A Balada Perfeita", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Interpretação", practiceDesc: "Canta frase romântica terminando em Straight to Vibrato (15s).", feedbackTitle: "Emoção", feedbackDesc: "Acabamento de estrela.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 15, instruction: 'Finaliza vibrando', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "7": {
    level: "Nível 7", moduleName: "Drives e Rasps", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Rugido Leve (Fry)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Vocal Fry", practiceDesc: "Produz o som de 'porta velha rangendo' no grave (10s).", feedbackTitle: "A Base Suja", feedbackDesc: "Não machuca a garganta.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'FRY', t: 10, instruction: 'Som de porta velha', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Limpo para Sujo", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sustenta e Suja", practiceDesc: "Sustenta nota limpa e adiciona o Fry no final (12s).", feedbackTitle: "Transição", feedbackDesc: "A entrada suave da distorção.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 12, instruction: 'Limpo -> Sujo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Falsas Pregas (Suspiro)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Suspiro Denso", practiceDesc: "Limpa a garganta suavemente para achar as pregas vestibulares (10s).", feedbackTitle: "Anatomia", feedbackDesc: "Distorção segura é feita pelas pregas falsas.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSPIRA', t: 10, instruction: 'Denso', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Grit/Rasp Moderado", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Rasp", practiceDesc: "Canta vogal adicionando a textura do suspiro denso (10s).", feedbackTitle: "O Blues", feedbackDesc: "Textura rasposa incrível.", frequency: "Repertório", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 10, instruction: 'Com textura', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Compressão Metálica", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Twang + Drive", practiceDesc: "Une o Twang com pressão de ar para rasgar o agudo (10s).", feedbackTitle: "Poder Rock", feedbackDesc: "Volume e corte absolutos.", frequency: "Avançado", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'TWANG', t: 10, instruction: 'Rasga o agudo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Distortion Sustentado", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sustenta", practiceDesc: "Segura a nota rasgada sem aumentar o volume (8s).", feedbackTitle: "Controle Absoluto", feedbackDesc: "Não deixe a emoção estourar sua voz.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 8, instruction: 'Sem gritar', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Yell/Grito Controlado", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Scream", practiceDesc: "Técnica de 'chamar alguém de longe' com apoio máximo (8s).", feedbackTitle: "Explosão", feedbackDesc: "Apenas com técnica isso não destrói a laringe.", frequency: "Ocasional", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'YELL', t: 8, instruction: 'Apoio MÁXIMO', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "O Grunhido (Growl)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Growl", practiceDesc: "Abaixa a laringe e vibra as falsas pregas no grave profundo (10s).", feedbackTitle: "Peso Extra", feedbackDesc: "Metal e nuances de Jazz.", frequency: "Ocasional", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'GROWL', t: 10, instruction: 'Grave e sujo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Recuperação Imediata", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Alterna", practiceDesc: "Alterna frase rasgada pesada com frase de voz de cabeça pura (12s).", feedbackTitle: "Flexibilidade", feedbackDesc: "Mostra que sua voz limpa continua lá.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ALTERNA', t: 12, instruction: 'Sujo -> Limpo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "Desafio do Rocker", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Showcase", practiceDesc: "Executa frase aguda com Drive constante sem perder a afinação (15s).", feedbackTitle: "Rockstar", feedbackDesc: "O auge da técnica de distorção.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 15, instruction: 'Drive Afinada', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "8": {
    level: "Nível 8", moduleName: "Agudos Extremos e Belting", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Choro do Bebê", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Pharyngeal", practiceDesc: "Som anasalado/choroso para afinar as pregas (10s).", feedbackTitle: "O Segredo do Agudo", feedbackDesc: "Encontra a ressonância exata.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CHORO', t: 10, instruction: 'Anasalado', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Ancoragem de Corpo", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Suporte", practiceDesc: "Contrai grandes músculos (dorso/abdômen) antes do agudo (10s).", feedbackTitle: "A Base da Força", feedbackDesc: "O corpo segura, a garganta relaxa.", frequency: "Sempre", phases: [{phase: 'CONTRAI', t: 3, instruction: 'Corpo firme', color: 'cyan', icon: Wind}, {phase: 'AGUDO', t: 7, instruction: 'Mantenha a força', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Belting 'Ney'", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sobe Escala", practiceDesc: "Sobe a escala com a sílaba 'Ney' mantendo o peso do peito (12s).", feedbackTitle: "Twang e Peso", feedbackDesc: "Combinação para o Belting.", frequency: "Diário", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ESCALA', t: 12, instruction: 'Ney', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Ataque de Belting", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Ataque Direto", practiceDesc: "Ouve a nota aguda e crava direto com potência (8s).", feedbackTitle: "Precisão Explosiva", feedbackDesc: "Chega na nota sem escorregar.", frequency: "Treino", phases: [{phase: 'OUVE', t: 2, instruction: 'A Nota', color: 'cyan', icon: Music}, {phase: 'CRAVA', t: 8, instruction: 'Direto na nota', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Modificação Extrema", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "I -> Ê", practiceDesc: "Transforma o 'I' em 'Ê' no agudo para não esganar (12s).", feedbackTitle: "Enganando o Ouvido", feedbackDesc: "O público ouve 'I', sua boca faz 'Ê'.", frequency: "Repertório", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'MODIFICA', t: 12, instruction: 'I -> Ê no agudo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Voz de Apito (Introdução)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Whistle", practiceDesc: "Sopra ar fino tentando achar a fricção altíssima (8s).", feedbackTitle: "As Estrelas", feedbackDesc: "O registro mais agudo humano.", frequency: "Ocasional", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SOPRO', t: 8, instruction: 'Fino, altíssimo', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 7, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Sustentação de Belting", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Sustenta", practiceDesc: "Segura o agudo potente gerenciando o ar sem gritar (10s).", feedbackTitle: "Resistência", feedbackDesc: "O Clímax inesquecível.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA', t: 10, instruction: 'Potente', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Mix Pesado vs Belting", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Alterna", practiceDesc: "Alterna entre agudo leve (Mix) e agudo com potência técnica (12s).", feedbackTitle: "Controle Dinâmico", feedbackDesc: "Saber quando usar qual força.", frequency: "Avançado", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ALTERNA', t: 12, instruction: 'Mix -> Belt', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Descompressão", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Relaxa", practiceDesc: "Desce da nota do Belting para o grave profundo relaxando tudo (10s).", feedbackTitle: "Massagem Pós-Belting", feedbackDesc: "Nunca termine um treino tenso.", frequency: "Sempre", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'DESCE', t: 10, instruction: 'Agudo -> Grave', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "O Clímax da Música", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Showcase", practiceDesc: "Executa os últimos 15s de uma balada explodindo no agudo (15s).", feedbackTitle: "A Diva", feedbackDesc: "Momento principal.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'EXPLODE', t: 15, instruction: 'O Clímax', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "9": {
    level: "Nível 9", moduleName: "Micro-Dinâmica e Textura", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Messa di Voce", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Pêndulo", practiceDesc: "Sussurro -> Volume Máximo -> Sussurro na mesma nota (15s).", feedbackTitle: "Domínio Absoluto", feedbackDesc: "A técnica clássica definitiva.", frequency: "Diário", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PÊNDULO', t: 15, instruction: 'Sussurro -> Forte -> Sussurro', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "O Sussurro Projetado", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Airy Voice", practiceDesc: "Canta com muito ar, mantendo afinado (12s).", feedbackTitle: "Ar e Tom", feedbackDesc: "Voz soprosa exige mais ar.", frequency: "Treino", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSSURRO', t: 12, instruction: 'Com Ar', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "O Soco (Forte-Piano)", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Ataque e Queda", practiceDesc: "Ataca muito alto, cai o volume e volta a crescer (10s).", feedbackTitle: "Dinâmica Intensa", feedbackDesc: "Efeito dramático fortíssimo.", frequency: "Avançado", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SOCO', t: 10, instruction: 'Forte -> Fraco -> Cresce', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "Textura Metálica", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Edge", practiceDesc: "Foca o som apenas no nariz e dentes (timbre cortante) (10s).", feedbackTitle: "Corte", feedbackDesc: "Para destacar a voz em arranjos densos.", frequency: "Repertório", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'METÁLICA', t: 10, instruction: 'Foco nos dentes', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Textura Escura", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Coring", practiceDesc: "Abaixa a laringe escurecendo o timbre (10s).", feedbackTitle: "Corpo", feedbackDesc: "Trás drama e peso à voz.", frequency: "Repertório", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ESCURA', t: 10, instruction: 'Laringe Baixa', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "Alternância Tímbrica", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Troca", practiceDesc: "Canta a mesma frase 1x Metálica, 1x Escura (12s).", feedbackTitle: "Versatilidade", feedbackDesc: "Muda a cor da voz.", frequency: "Treino", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'ALTERNA', t: 12, instruction: 'Metal -> Escuro', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "O Trinado de Volume", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Pulsa", practiceDesc: "Pulsa o volume (forte/fraco) na nota (12s).", feedbackTitle: "Efeito Rítmico", feedbackDesc: "Não confunda com vibrato de afinação.", frequency: "Estilo", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'PULSA', t: 12, instruction: 'Forte/Fraco', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Crescendo Emocional", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Evolução", practiceDesc: "Começa chorando (Airy) e termina rasgando (Drive) (12s).", feedbackTitle: "A Jornada", feedbackDesc: "Conta a história da música.", frequency: "Showcase", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'EVOLUI', t: 12, instruction: 'Airy -> Drive', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "Fade Out Perfeito", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Fim Lento", practiceDesc: "Sustenta a nota até o som sumir no silêncio (10s).", feedbackTitle: "Acabamento", feedbackDesc: "Lindo final de balada.", frequency: "Sempre", phases: [{phase: 'INSPIRA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'FADE', t: 10, instruction: 'Até sumir', color: 'orange', icon: Volume2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 10, displayTitle: "Aula 10", title: "A Leitura do Ator", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Atuação", practiceDesc: "Canta frase aplicando 3 emoções seguidas (15s).", feedbackTitle: "O Mestre", feedbackDesc: "A voz serve a emoção.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 3, instruction: 'Foco na emoção', color: 'cyan', icon: Wind}, {phase: 'CANTA', t: 15, instruction: '3 Emoções', color: 'orange', icon: Mic2}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] }
    ]
  },
  "10": {
    level: "Nível 10", moduleName: "O Estúdio de Alta Performance", introVideo: "ADD LINK YOUTUBE",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Aquecimento do Atleta", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: false, exercise: "Rotina Expressa", practiceDesc: "Sirene (5s) + Lip Trill (5s) + Terças (5s).", feedbackTitle: "Pronto Pro Jogo", feedbackDesc: "O Aquecimento rápido e efetivo.", frequency: "Antes de shows", phases: [{phase: 'SIRENE', t: 5, instruction: '', color: 'cyan', icon: Wind}, {phase: 'LIP TRILL', t: 5, instruction: '', color: 'orange', icon: Mic2}, {phase: 'TERÇAS', t: 5, instruction: '', color: 'blue', icon: Activity}, {phase: 'DESCANSA', t: 3, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 2, displayTitle: "Aula 2", title: "Tiro ao Alvo Tonal", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Pitch + Belt", practiceDesc: "Acha o tom cego (3s) e crava em Belting (7s).", feedbackTitle: "Tiro Certeiro", feedbackDesc: "Ataque agressivo e afinado.", frequency: "Avançado", phases: [{phase: 'TOM CEGO', t: 3, instruction: 'Pense a nota', color: 'cyan', icon: Music}, {phase: 'BELTING', t: 7, instruction: 'Crava Forte', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 3, displayTitle: "Aula 3", title: "Agilidade em Mix Voice", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Melisma Combinado", practiceDesc: "Melisma trocando Peito e Falsete no meio (10s).", feedbackTitle: "Transição Rápida", feedbackDesc: "Extremamente desafiador.", frequency: "Treino", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'MELISMA', t: 10, instruction: 'Troca os Registros', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 4, displayTitle: "Aula 4", title: "O Teste da Vogal Ingrata", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Agudo 'I'", practiceDesc: "Sustenta um agudo na vogal 'I' modificando ressonância (12s).", feedbackTitle: "Moldando a Vogal", feedbackDesc: "Vogal difícil sem soar estridente.", frequency: "Repertório", phases: [{phase: 'PREPARA', t: 2, instruction: '', color: 'cyan', icon: Wind}, {phase: 'SUSTENTA I', t: 12, instruction: 'Modifique', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 5, displayTitle: "Aula 5", title: "Distorção no Clímax", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Rasp Final", practiceDesc: "Canta crescendo e finaliza com Growl (12s).", feedbackTitle: "O Ápice", feedbackDesc: "Muita energia e distorção.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'CRESCENDO', t: 12, instruction: 'Termina com Growl', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 6, displayTitle: "Aula 6", title: "A Queda Dinâmica", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "100 ao 10", practiceDesc: "Do Belting para o sussurro em 3 segundos (10s).", feedbackTitle: "Contraste", feedbackDesc: "O público ama o extremo da dinâmica.", frequency: "Avançado", phases: [{phase: 'PREPARA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'QUEDA', t: 10, instruction: 'Belt -> Sussurro', color: 'orange', icon: Activity}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 7, displayTitle: "Aula 7", title: "Sustentação Mestra", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Endurance", practiceDesc: "Reta por 8s + Vibrato nos 4s finais (12s).", feedbackTitle: "Fôlego Premium", feedbackDesc: "Controle espetacular do ar.", frequency: "Sempre", phases: [{phase: 'PREPARA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'RETA + VIBRA', t: 12, instruction: 'Vibra no fim', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 8, displayTitle: "Aula 8", title: "Double Tracking", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Harmonia", practiceDesc: "Ouve guia e canta Terça cravada por cima (12s).", feedbackTitle: "Estúdio", feedbackDesc: "Essencial para gravações profissionais.", frequency: "Avançado", phases: [{phase: 'OUVE GUIA', t: 3, instruction: '', color: 'cyan', icon: Music}, {phase: 'TERÇA', t: 12, instruction: 'Cravado em cima', color: 'orange', icon: Mic2}, {phase: 'DESCANSA', t: 5, instruction: '', color: 'gray', icon: Coffee}] },
      { id: 9, displayTitle: "Aula 9", title: "O Take Único", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "Perfeição", practiceDesc: "Canta à capella com Dinâmica, Vibrato e Dicção sem errar (15s).", feedbackTitle: "Sem Edições", feedbackDesc: "Sua voz crua e perfeita.", frequency: "Showcase", phases: [{phase: 'PREPARA', t: 3, instruction: '', color: 'cyan', icon: Wind}, {phase: 'A CAPELLA', t: 15, instruction: 'Aplique tudo', color: 'orange', icon: Activity}, {phase: 'AVALIAÇÃO', t: 5, instruction: '', color: 'blue', icon: Activity}] },
      { id: 10, displayTitle: "Aula 10", title: "O Show do Estádio", youtubeId: "ADD LINK YOUTUBE", hasPractice: true, locked: true, exercise: "A Masterclass Final", practiceDesc: "O aluno executa a perfomance completa (20s).", feedbackTitle: "Formatura", feedbackDesc: "Você está pronto para o Mainstream.", frequency: "Sempre", phases: [{phase: 'PREPARA', t: 3, instruction: 'Sinta a emoção', color: 'cyan', icon: Music}, {phase: 'PERFORMANCE', t: 20, instruction: 'Dê o seu melhor', color: 'orange', icon: Mic2}, {phase: 'RESULTADO FINAL', t: 5, instruction: 'Análise Julliard', color: 'blue', icon: Activity}] }
    ]
  }
};

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  
  const levelId = id?.split('.')[0] || "1"; 
  const lessonIdFromUrl = id?.split('.')[1]; 
  
  const currentModule = academyData[levelId] || academyData["1"];
  
  const getInitialLessonIndex = () => {
    if (!lessonIdFromUrl || lessonIdFromUrl === 'intro') return 0;
    return parseInt(lessonIdFromUrl) || 0;
  };

  const [activeLessonIndex, setActiveLessonIndex] = useState(getInitialLessonIndex());
  const [step, setStep] = useState<'video' | 'practice'>('video');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPremiumUser = user?.email === 'bruno.fmonte@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      setActiveLessonIndex(getInitialLessonIndex());
      setStep('video');
      setTrainingStatus('idle');
    }
  }, [id]);

  const currentLesson = activeLessonIndex === 0 ? null : currentModule.lessons.find(l => l.id === activeLessonIndex);
  const isIntroActive = activeLessonIndex === 0;

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

  // MOTOR DINÂMICO DE CICLOS (Lê o campo "phases" do BD)
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
        navigate('/premium');
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
             <PlayCircle size={14} /> MASTERCLASS - {currentModule.level.toUpperCase()}
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
                  {videoToPlay && videoToPlay !== "ADD LINK YOUTUBE" ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoToPlay}?rel=0&modestbranding=1`} title={displayTitle} frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full"></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-gray-500"><Lock className="h-12 w-12 mb-4 opacity-50"/><p className="font-bold uppercase tracking-widest text-xs">VÍDEO EM PRODUÇÃO</p><p className="text-[10px] mt-2">Aguardando inserção do Link do YouTube</p></div>
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
                    <Button onClick={() => setTrainingStatus('countdown')} className="h-16 px-12 rounded-full bg-cyan-400 text-black font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all">COMEÇAR CRONÔMETRO (60s)</Button>
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
                      <Button onClick={() => { setStep('video'); setTrainingStatus('idle'); setTimeLeft(60); }} className="bg-white text-black font-black uppercase rounded-full px-8 h-12 hover:scale-105 transition-all">VOLTAR PARA AULA</Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <ListVideo className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black text-white uppercase tracking-widest text-sm">PLAYLIST {currentModule.level.toUpperCase()}</h3>
             </div>
             
             <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[2rem] p-4 overflow-y-auto max-h-[800px] space-y-3 custom-scrollbar">
                <Card onClick={() => changeLesson(0)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${activeLessonIndex === 0 ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-zinc-950 border-white/10 hover:border-white/30'}`}>
                   <PlayCircle size={20} className="shrink-0" />
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Introdução</p>
                     <p className="text-sm font-black italic uppercase line-clamp-1">{currentModule.moduleName}</p>
                   </div>
                </Card>

                {currentModule.lessons.map((lesson) => {
                  const isLockedForUser = lesson.locked && !isPremiumUser;
                  return (
                    <Card key={lesson.id} onClick={() => changeLesson(lesson.id)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${activeLessonIndex === lesson.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-zinc-950 border-white/10 hover:border-white/30'} ${isLockedForUser ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                       {isLockedForUser ? <Lock size={20} className="shrink-0" /> : <PlayCircle size={20} className="shrink-0" />}
                       <div>
                         <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Aula {lesson.id}</p>
                         <p className="text-sm font-black italic uppercase line-clamp-1">{lesson.title}</p>
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