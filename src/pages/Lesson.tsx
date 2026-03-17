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
};

// ============================================================================
// O GRANDE BANCO DE DADOS DA ACADEMIA (NÍVEIS 1 AO 10)
// ============================================================================
const academyData: Record<string, { level: string, moduleName: string, introVideo: string, lessons: LessonType[] }> = {
  "1": {
    level: "Nível 1", moduleName: "Fundamentos e Respiração", introVideo: "m75jPge9QUM",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Respiração Diafragmática", youtubeId: "Wl6xUHg9iAQ", hasPractice: true, locked: false, exercise: "Ciclo 4-4-10-4", practiceDesc: "Inspira (4s), Segura (4s), Expira (10s) e Descansa (4s).", feedbackTitle: "A Base da Resistência", feedbackDesc: "Sem ar, não há som. O controle do diafragma tira a sobrecarga da sua garganta.", frequency: "3x ao dia" },
      { id: 2, displayTitle: "Aula 2", title: "Controle de Fluxo de Ar", youtubeId: "fQKI_SFrrOo", hasPractice: true, locked: false, exercise: "Emissão de 'S'", practiceDesc: "Mantenha o som de 'S' constante.", feedbackTitle: "Economia e Pressão", feedbackDesc: "Ensina as pregas vocais a resistirem à pressão do ar.", frequency: "2x ao dia" },
      { id: 3, displayTitle: "Aula 3", title: "Sustentação Vocal", youtubeId: "X65IOyha6EQ", hasPractice: true, locked: true, exercise: "Sustentação de Nota", practiceDesc: "Mantenha uma nota confortável sem oscilar.", feedbackTitle: "Estabilidade Tonal", feedbackDesc: "Cantar notas longas sem tremer a voz demonstra domínio técnico.", frequency: "Aquecimento diário" },
      { id: 4, displayTitle: "Aula 4", title: "Aquecimento Labial", youtubeId: "3nL733b7rgQ", hasPractice: true, locked: true, exercise: "Lip Trill", practiceDesc: "Vibração de lábios contínua (Brrr).", feedbackTitle: "O Melhor Amigo do Cantor", feedbackDesc: "Massageia as cordas vocais e equilibra a pressão do ar.", frequency: "Sempre antes de cantar" },
      { id: 5, displayTitle: "Aula 5", title: "Soltando a Língua", youtubeId: "vImzV9TdLdo", hasPractice: true, locked: true, exercise: "Trinado de Língua", practiceDesc: "Vibração de língua relaxada (Rrrr).", feedbackTitle: "Relaxamento Articulatório", feedbackDesc: "A tensão na raiz da língua é uma das maiores causas de quebra de voz.", frequency: "1x ao dia" },
      { id: 6, displayTitle: "Aula 6", title: "Sirene Vocal", youtubeId: "ZsvFS4u2P8I", hasPractice: true, locked: true, exercise: "Sirene do Grave ao Agudo", practiceDesc: "Deslize a voz imitando uma sirene.", feedbackTitle: "Conexão de Registros", feedbackDesc: "Apaga a linha que divide a voz de peito e a voz de cabeça.", frequency: "2x ao dia" },
      { id: 7, displayTitle: "Aula 7", title: "Articulação Exagerada", youtubeId: "PW3Oj_uagpI", hasPractice: true, locked: true, exercise: "Leitura Hiperarticulada", practiceDesc: "Fale ou cante abrindo bastante a boca.", feedbackTitle: "Dicção de Palco", feedbackDesc: "Abre espaço interno na boca, amplificando sua voz sem gritar.", frequency: "Antes de músicas rápidas" },
      { id: 8, displayTitle: "Aula 8", title: "Ataque Suave", youtubeId: "KqVkz8jdcpc", hasPractice: true, locked: true, exercise: "Início com Sopros", practiceDesc: "Inicie frases com um leve sopro.", feedbackTitle: "Fim da Borda de Glote", feedbackDesc: "O ataque suave é a cura para pregas vocais cansadas.", frequency: "3x ao dia" },
      { id: 9, displayTitle: "Aula 9", title: "Ressonância Básica", youtubeId: "dHVMUp4MRD8", hasPractice: true, locked: true, exercise: "Humming", practiceDesc: "Faça o som de 'Hummm' vibrando nariz.", feedbackTitle: "Colocação na Máscara", feedbackDesc: "Dá brilho profissional à voz e facilita os agudos.", frequency: "2x ao dia" },
      { id: 10, displayTitle: "Aula 10", title: "Prática Geral", youtubeId: "qpQuTYKLC-U", hasPractice: true, locked: true, exercise: "Rotina Completa Nível 1", practiceDesc: "Passagem por todos os exercícios.", feedbackTitle: "Consolidação Muscular", feedbackDesc: "A repetição substitui falhas por técnicas que vão preservar sua voz.", frequency: "Treino diário oficial" }
    ]
  },
  "2": {
    level: "Nível 2", moduleName: "Afinação Precisa", introVideo: "8bR5O0hEMYU",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Percepção Auditiva", youtubeId: "TTVVJTnentM", hasPractice: true, locked: false, exercise: "Escuta Ativa", practiceDesc: "Ouça a nota e tente reproduzi-la mentalmente antes de cantar.", feedbackTitle: "Treinando o Ouvido", feedbackDesc: "A afinação começa na mente.", frequency: "2x ao dia" },
      { id: 2, displayTitle: "Aula 2", title: "Escalas Maiores", youtubeId: "uIgaE7Ekh1k", hasPractice: true, locked: true, exercise: "Subida e Descida 1 a 8", practiceDesc: "Cante do Dó1 ao Dó2 e desça.", feedbackTitle: "Mapa Tonal", feedbackDesc: "A escala maior impede você de se perder.", frequency: "Aquecimento" },
      { id: 3, displayTitle: "Aula 3", title: "Saltos de Terça", youtubeId: "fsIczoqU89M", hasPractice: true, locked: true, exercise: "Treino de Intervalos", practiceDesc: "Cante Dó - Mi - Dó repetidamente.", feedbackTitle: "Precisão de Saltos", feedbackDesc: "Cria memória muscular para transições comuns.", frequency: "3x ao dia" },
      { id: 4, displayTitle: "Aula 4", title: "Memória Muscular", youtubeId: "Ld6XC8dlNlA", hasPractice: true, locked: true, exercise: "Repetição Cega", practiceDesc: "Cante a nota, feche os ouvidos e cante de novo.", feedbackTitle: "Cantar sem Retorno", feedbackDesc: "Prepara você para cantar bem sem se ouvir.", frequency: "2x ao dia" },
      { id: 5, displayTitle: "Aula 5", title: "Arpejos Simples", youtubeId: "JRqTqIRCoWo", hasPractice: true, locked: true, exercise: "Saltos 1-3-5-8", practiceDesc: "Cante notas chave do acorde.", feedbackTitle: "Cravar as Notas", feedbackDesc: "Melhora exatidão em pulos grandes.", frequency: "1x ao dia" },
      { id: 6, displayTitle: "Aula 6", title: "Afinação com Vibrato", youtubeId: "cp1ICtprIwU", hasPractice: true, locked: true, exercise: "Centro da Nota", practiceDesc: "Vibrato sem sair do tom.", feedbackTitle: "Controle de Oscilação", feedbackDesc: "O vibrato não deve esconder afinação ruim.", frequency: "Prática focada" },
      { id: 7, displayTitle: "Aula 7", title: "Harmonia Básica", youtubeId: "sYQ_iugBGDE", hasPractice: true, locked: true, exercise: "Terça Acima", practiceDesc: "Cante uma terça acima da melodia.", feedbackTitle: "Abrindo Vozes", feedbackDesc: "Introdução para vocais de apoio.", frequency: "Constante" },
      { id: 8, displayTitle: "Aula 8", title: "Correção de Pitch", youtubeId: "yfHrDfNBBH0", hasPractice: true, locked: true, exercise: "Glissando Controlado", practiceDesc: "Deslize até a nota vizinha e pare.", feedbackTitle: "Polimento Tonal", feedbackDesc: "Corrige a micro-afinação.", frequency: "Quando necessário" },
      { id: 9, displayTitle: "Aula 9", title: "Sustentação Afinada", youtubeId: "iOOrgqzN0tY", hasPractice: true, locked: true, exercise: "Final de Frase", practiceDesc: "Segure nota longa sem cair afinação.", feedbackTitle: "Fôlego e Tom", feedbackDesc: "Suporte até o último segundo.", frequency: "Constante" },
      { id: 10, displayTitle: "Aula 10", title: "Desafio A Capella", youtubeId: "_nkKaweJPSk", hasPractice: true, locked: true, exercise: "Rotina Completa Afinação", practiceDesc: "Cante sem acompanhamento mantendo tom.", feedbackTitle: "Domínio Absoluto", feedbackDesc: "Teste final da percepção.", frequency: "Uso diário" }
    ]
  },
  "3": {
    level: "Nível 3", moduleName: "Ressonância e Dicção", introVideo: "IzZCDVzsghA",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Poder do Humming", youtubeId: "vWuOiC1PqX0", hasPractice: true, locked: false, exercise: "Bocca Chiusa", practiceDesc: "Sinta a vibração nos ossos da face.", feedbackTitle: "Projeção sem Força", feedbackDesc: "A máscara facial atua como um megafone natural.", frequency: "Diário" },
      { id: 2, displayTitle: "Aula 2", title: "Ginástica Articulatória", youtubeId: "ErZxD3GAP-o", hasPractice: true, locked: true, exercise: "Trava-línguas", practiceDesc: "Articule consoantes rápido e limpo.", feedbackTitle: "Agilidade", feedbackDesc: "Permite cantar pop e rap sem enrolar a língua.", frequency: "Diário" },
      { id: 3, displayTitle: "Aula 3", title: "Sirenes e Conexão", youtubeId: "6U2Xk0OzsfA", hasPractice: true, locked: true, exercise: "Mix Voice", practiceDesc: "Deslize sem deixar a voz falhar.", feedbackTitle: "Voz Mista", feedbackDesc: "O segredo para notas altas sem gritar.", frequency: "Aquecimento" },
      { id: 4, displayTitle: "Aula 4", title: "Acordando o Peito", youtubeId: "kp4Whqij-DE", hasPractice: true, locked: true, exercise: "Ressonância Peitoral", practiceDesc: "Notas graves sentindo o peito vibrar.", feedbackTitle: "Presença", feedbackDesc: "Garante um grave aveludado e audível.", frequency: "3x semana" },
      { id: 5, displayTitle: "Aula 5", title: "O Brilho da Cabeça", youtubeId: "GSR3YUQPHyM", hasPractice: true, locked: true, exercise: "Acesso ao Agudo", practiceDesc: "Uuu em notas altas com leveza.", feedbackTitle: "Agudos Claros", feedbackDesc: "Voz de cabeça não é falsete, tem brilho e presença.", frequency: "3x semana" },
      { id: 6, displayTitle: "Aula 6", title: "Modificação de Vogais", youtubeId: "K66Di3oSw7M", hasPractice: true, locked: true, exercise: "Arredondando Vogais", practiceDesc: "Troque Ah por Uh nos agudos.", feedbackTitle: "Segredo Pro", feedbackDesc: "Evita que os agudos fiquem estridentes.", frequency: "Em repertório" },
      { id: 7, displayTitle: "Aula 7", title: "O Groove da Dicção", youtubeId: "ZBL2BM-XqvI", hasPractice: true, locked: true, exercise: "Consoantes Percussivas", practiceDesc: "Cante no ritmo exato do metrônomo.", feedbackTitle: "Swing", feedbackDesc: "O cantor também é um instrumento rítmico.", frequency: "Diário" },
      { id: 8, displayTitle: "Aula 8", title: "O Brilho do Twang", youtubeId: "", hasPractice: true, locked: true, exercise: "Epilaringe", practiceDesc: "Som de pato para gerar corte na voz.", feedbackTitle: "Cortando a Banda", feedbackDesc: "Ouvido sobre a bateria sem precisar de volume extra.", frequency: "2x semana" },
      { id: 9, displayTitle: "Aula 9", title: "Costurando os Registros", youtubeId: "", hasPractice: true, locked: true, exercise: "Voz Mista Avançada", practiceDesc: "Cantando na região de passagem.", feedbackTitle: "Ponte Vocal", feedbackDesc: "Onde 90% dos cantores falham, você dominará.", frequency: "Diário" },
      { id: 10, displayTitle: "Aula 10", title: "Prova de Fogo", youtubeId: "", hasPractice: true, locked: true, exercise: "Showcase Completo", practiceDesc: "Aplicando tudo em uma música.", feedbackTitle: "Consolidação", feedbackDesc: "Dicção, ressonância e mix voice juntos.", frequency: "Fim de módulo" }
    ]
  },
  "4": {
    level: "Nível 4", moduleName: "Interpretação Vocal", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Bocejo-Suspiro", youtubeId: "", hasPractice: true, locked: false, exercise: "Relaxamento", practiceDesc: "Inspire como um bocejo, solte como suspiro.", feedbackTitle: "Espaço Interno", feedbackDesc: "Remove a tensão da laringe.", frequency: "Diário" },
      { id: 2, displayTitle: "Aula 2", title: "Boca Chiusa Oitavada", youtubeId: "", hasPractice: true, locked: true, exercise: "Escala Fechada", practiceDesc: "Humming passando por 8 notas.", feedbackTitle: "Ressonância", feedbackDesc: "Aquece cordas e ossos da face.", frequency: "Aquecimento" },
      { id: 3, displayTitle: "Aula 3", title: "Exercício com Canudo", youtubeId: "", hasPractice: true, locked: true, exercise: "SOVT", practiceDesc: "Cante toda a música através do canudo.", feedbackTitle: "Controle de Pressão", feedbackDesc: "Alinha a pressão acima e abaixo das pregas.", frequency: "Diário" },
      { id: 4, displayTitle: "Aula 4", title: "Dinâmica de Volume", youtubeId: "", hasPractice: true, locked: true, exercise: "Crescendo", practiceDesc: "Do piano (baixo) ao forte, e de volta.", feedbackTitle: "Emoção", feedbackDesc: "Cantar reto é chato. A dinâmica conta a história.", frequency: "Repertório" },
      { id: 5, displayTitle: "Aula 5", title: "Canto Falado", youtubeId: "", hasPractice: true, locked: true, exercise: "Speech Level", practiceDesc: "Cante como se estivesse conversando.", feedbackTitle: "Naturalidade", feedbackDesc: "Tira o som artificial e engessado.", frequency: "Repertório" },
      { id: 6, displayTitle: "Aula 6", title: "Ataque e Finais", youtubeId: "", hasPractice: true, locked: true, exercise: "Design de Frase", practiceDesc: "Como começar e como terminar a sílaba.", feedbackTitle: "Acabamento", feedbackDesc: "O que separa o amador do profissional.", frequency: "Constante" },
      { id: 7, displayTitle: "Aula 7", title: "Choro Vocal", youtubeId: "", hasPractice: true, locked: true, exercise: "Cry", practiceDesc: "Incline a laringe imitando um leve choro.", feedbackTitle: "Acesso ao Agudo", feedbackDesc: "O 'cry' solta a laringe e dá tom emotivo.", frequency: "Diário" },
      { id: 8, displayTitle: "Aula 8", title: "Conexão Lírica", youtubeId: "", hasPractice: true, locked: true, exercise: "Análise de Letra", practiceDesc: "Leia o texto da música como poesia.", feedbackTitle: "Verdade", feedbackDesc: "Se você não sente, o público não sente.", frequency: "Sempre" },
      { id: 9, displayTitle: "Aula 9", title: "Uso do Rosto", youtubeId: "", hasPractice: true, locked: true, exercise: "Expressão Facial", practiceDesc: "Cante em frente ao espelho.", feedbackTitle: "Atuação", feedbackDesc: "A sobrancelha e os olhos mudam o som.", frequency: "Semanal" },
      { id: 10, displayTitle: "Aula 10", title: "Performance Completa", youtubeId: "", hasPractice: true, locked: true, exercise: "Interpretação", practiceDesc: "Cante focando 100% na emoção.", feedbackTitle: "O Artista", feedbackDesc: "Aqui a técnica some e a arte aparece.", frequency: "Semanal" }
    ]
  },
  "5": {
    level: "Nível 5", moduleName: "Falsetes e Melismas", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Falsete Leve", youtubeId: "", hasPractice: true, locked: false, exercise: "Emissão Aérea", practiceDesc: "Deixe bastante ar passar na voz aguda.", feedbackTitle: "Textura", feedbackDesc: "O falsete é lindo e intimista.", frequency: "Diário" },
      { id: 2, displayTitle: "Aula 2", title: "Cabeça vs Falsete", youtubeId: "", hasPractice: true, locked: true, exercise: "Transição", practiceDesc: "Troque do falsete (soprado) para cabeça (limpo).", feedbackTitle: "Controle", feedbackDesc: "Saiba exatamente qual músculo usar.", frequency: "Diário" },
      { id: 3, displayTitle: "Aula 3", title: "Agilidade Básica", youtubeId: "", hasPractice: true, locked: true, exercise: "3 Notas Rápidas", practiceDesc: "Desça 3 notas em uma única sílaba.", feedbackTitle: "Precisão", feedbackDesc: "O início da corrida vocal (run).", frequency: "Aquecimento" },
      { id: 4, displayTitle: "Aula 4", title: "Escalas Pentatônicas", youtubeId: "", hasPractice: true, locked: true, exercise: "Penta Maior/Menor", practiceDesc: "Cante as 5 notas da base do R&B.", feedbackTitle: "Fluência R&B", feedbackDesc: "O mapa mental dos melismas.", frequency: "Diário" },
      { id: 5, displayTitle: "Aula 5", title: "Corridas (Runs)", youtubeId: "", hasPractice: true, locked: true, exercise: "Descida Pentatônica", practiceDesc: "Desça 5 notas de uma vez, limpo.", feedbackTitle: "Limpeza", feedbackDesc: "Evite que o melisma vire um escorregão.", frequency: "Treino focado" },
      { id: 6, displayTitle: "Aula 6", title: "Riffs R&B", youtubeId: "", hasPractice: true, locked: true, exercise: "Riffs Curtos", practiceDesc: "Pequenos enfeites no final da frase.", feedbackTitle: "Estilo", feedbackDesc: "Dá a sua identidade à música.", frequency: "Repertório" },
      { id: 7, displayTitle: "Aula 7", title: "Melismas Lentos", youtubeId: "", hasPractice: true, locked: true, exercise: "Mapeamento", practiceDesc: "Cante um melisma longo em câmera lenta.", feedbackTitle: "Memória", feedbackDesc: "A velocidade vem da precisão lenta.", frequency: "Sempre que errar" },
      { id: 8, displayTitle: "Aula 8", title: "Acelerando", youtubeId: "", hasPractice: true, locked: true, exercise: "Metrônomo", practiceDesc: "Dobre a velocidade do melisma anterior.", feedbackTitle: "Virtuose", feedbackDesc: "Voz rápida e conectada à batida.", frequency: "Avançado" },
      { id: 9, displayTitle: "Aula 9", title: "Articulação no Agudo", youtubeId: "", hasPractice: true, locked: true, exercise: "Melisma Agudo", practiceDesc: "Riffs na região de voz de cabeça.", feedbackTitle: "Diva Pop", feedbackDesc: "Extremamente exigente no apoio.", frequency: "Cuidado vocal" },
      { id: 10, displayTitle: "Aula 10", title: "Desafio Pop/R&B", youtubeId: "", hasPractice: true, locked: true, exercise: "Rotina Completa", practiceDesc: "Música cheia de enfeites e falsetes.", feedbackTitle: "Execução", feedbackDesc: "O teste de fogo da sua agilidade.", frequency: "Showcase" }
    ]
  },
  "6": {
    level: "Nível 6", moduleName: "Vibrato Master", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Oscilação Natural", youtubeId: "", hasPractice: true, locked: false, exercise: "Duas Notas", practiceDesc: "Alterne lentamente entre duas notas.", feedbackTitle: "A Semente", feedbackDesc: "Vibrato é a oscilação entre tons.", frequency: "Diário" },
      { id: 2, displayTitle: "Aula 2", title: "Exercício do Fantasma", youtubeId: "", hasPractice: true, locked: true, exercise: "Pulsação Diafragmática", practiceDesc: "Pulse o ar como um riso mudo.", feedbackTitle: "Apoio do Vibrato", feedbackDesc: "A energia vem do abdômen.", frequency: "Diário" },
      { id: 3, displayTitle: "Aula 3", title: "Controle de Velocidade", youtubeId: "", hasPractice: true, locked: true, exercise: "Lento para Rápido", practiceDesc: "Comece oscilando lento e acelere.", feedbackTitle: "Domínio", feedbackDesc: "Você controla o vibrato, não ele você.", frequency: "Treino" },
      { id: 4, displayTitle: "Aula 4", title: "Vibrato Delayed", youtubeId: "", hasPractice: true, locked: true, exercise: "Retardo", practiceDesc: "Segure a nota reta (3s) e insira o vibrato no final.", feedbackTitle: "Estilo Moderno", feedbackDesc: "A marca registrada de grandes estrelas Pop.", frequency: "Repertório" },
      { id: 5, displayTitle: "Aula 5", title: "Vibrato Agudo", youtubeId: "", hasPractice: true, locked: true, exercise: "Mix Vibrato", practiceDesc: "Vibrato na voz de cabeça/mista.", feedbackTitle: "Relaxamento", feedbackDesc: "Prova que sua garganta não está travada.", frequency: "Constante" },
      { id: 6, displayTitle: "Aula 6", title: "Vibrato vs Tremolo", youtubeId: "", hasPractice: true, locked: true, exercise: "Correção de Tremolo", practiceDesc: "Remova a tremedeira da mandíbula.", feedbackTitle: "Limpeza Visual", feedbackDesc: "O vibrato verdadeiro é interno.", frequency: "Se necessário" },
      { id: 7, displayTitle: "Aula 7", title: "Dinâmica no Vibrato", youtubeId: "", hasPractice: true, locked: true, exercise: "Fade Out", practiceDesc: "Diminua o volume junto com o vibrato.", feedbackTitle: "Finais Épicos", feedbackDesc: "Acabamento de baladas.", frequency: "Show" },
      { id: 8, displayTitle: "Aula 8", title: "Vibrato Rápido", youtubeId: "", hasPractice: true, locked: true, exercise: "Gospel Vibrato", practiceDesc: "Vibrato curto e muito acelerado.", feedbackTitle: "Gênero", feedbackDesc: "Estética essencial para Black Music.", frequency: "Avançado" },
      { id: 9, displayTitle: "Aula 9", title: "Sustentação Longa", youtubeId: "", hasPractice: true, locked: true, exercise: "Resistência", practiceDesc: "Segure 12s de vibrato constante.", feedbackTitle: "Pulmão de Aço", feedbackDesc: "Exige apoio perfeito.", frequency: "Diário" },
      { id: 10, displayTitle: "Aula 10", title: "Desafio de Balada", youtubeId: "", hasPractice: true, locked: true, exercise: "Aplicação Prática", practiceDesc: "Cante uma balada abusando dos finais com vibrato.", feedbackTitle: "Consolidação", feedbackDesc: "O toque de mestre na interpretação.", frequency: "Showcase" }
    ]
  },
  "7": {
    level: "Nível 7", moduleName: "Drives e Rasps", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Anatomia da Distorção", youtubeId: "", hasPractice: false, locked: false, exercise: "Teoria", practiceDesc: "Entenda as cordas falsas.", feedbackTitle: "Segurança", feedbackDesc: "A regra nº 1: Drive não pode doer.", frequency: "Teoria" },
      { id: 2, displayTitle: "Aula 2", title: "O Vocal Fry", youtubeId: "", hasPractice: true, locked: true, exercise: "Fritura Basica", practiceDesc: "Faça o som de 'porta velha abrindo' sem ar.", feedbackTitle: "O Início", feedbackDesc: "A base mais segura da distorção.", frequency: "Aquecimento de Drive" },
      { id: 3, displayTitle: "Aula 3", title: "False Cords", youtubeId: "", hasPractice: true, locked: true, exercise: "Suspiro Pesado", practiceDesc: "Suspire ativando as cordas falsas (som de zumbi).", feedbackTitle: "Rock Drive", feedbackDesc: "A distorção clássica do Rock.", frequency: "Com cuidado" },
      { id: 4, displayTitle: "Aula 4", title: "Adicionando a Nota", youtubeId: "", hasPractice: true, locked: true, exercise: "Voz + Drive", practiceDesc: "Misture 70% voz limpa e 30% False Cord.", feedbackTitle: "O Mix de Distorção", feedbackDesc: "O som sujo e melódico.", frequency: "Treino Diário" },
      { id: 5, displayTitle: "Aula 5", title: "Rasp em Médios", youtubeId: "", hasPractice: true, locked: true, exercise: "Rasp Controlado", practiceDesc: "Coloque areia na voz da região de fala.", feedbackTitle: "Estilo Blues", feedbackDesc: "Dá personalidade crua ao som.", frequency: "Repertório" },
      { id: 6, displayTitle: "Aula 6", title: "Drive de Epiglote", youtubeId: "", hasPractice: true, locked: true, exercise: "Distorção Alta", practiceDesc: "O rasgado do sertanejo e hard rock.", feedbackTitle: "Pressão", feedbackDesc: "Exige extremo apoio abdominal.", frequency: "Avançado" },
      { id: 7, displayTitle: "Aula 7", title: "Grito Controlado", youtubeId: "", hasPractice: true, locked: true, exercise: "Scream Dinâmico", practiceDesc: "Grito agudo usando apenas falso cord.", feedbackTitle: "Catarse", feedbackDesc: "Efeito pontual de alta energia.", frequency: "Mínima" },
      { id: 8, displayTitle: "Aula 8", title: "Distorção em Vogais", youtubeId: "", hasPractice: true, locked: true, exercise: "Mapeamento", practiceDesc: "Treine o drive no A, E, I, O, U.", feedbackTitle: "Controle Total", feedbackDesc: "Impede o som de engasgar na consoante.", frequency: "Treino" },
      { id: 9, displayTitle: "Aula 9", title: "Cuidados Pós-Drive", youtubeId: "", hasPractice: true, locked: true, exercise: "Cooldown", practiceDesc: "Sopros e lip trills pós distorção.", feedbackTitle: "Saúde", feedbackDesc: "Sempre 'lave' a garganta após rock.", frequency: "Sempre" },
      { id: 10, displayTitle: "Aula 10", title: "Desafio Rock", youtubeId: "", hasPractice: true, locked: true, exercise: "Música Completa", practiceDesc: "Cante um clássico intercalando voz limpa e suja.", feedbackTitle: "Mestre do Drive", feedbackDesc: "A execução perfeita da agressividade.", frequency: "Showcase" }
    ]
  },
  "8": {
    level: "Nível 8", moduleName: "Agudos (Belting)", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "O Que é Belting?", youtubeId: "", hasPractice: false, locked: false, exercise: "Teoria do Mix", practiceDesc: "Entenda o mix dominado pelo peito.", feedbackTitle: "Poder", feedbackDesc: "O belting é a nota aguda com força de grito, mas sem gritar.", frequency: "Única" },
      { id: 2, displayTitle: "Aula 2", title: "Ancoragem Torácica", youtubeId: "", hasPractice: true, locked: true, exercise: "Tensão Boa", practiceDesc: "Ative os músculos do peito e costas antes de subir.", feedbackTitle: "Suporte Físico", feedbackDesc: "O corpo segura o tranco, não o pescoço.", frequency: "Diário" },
      { id: 3, displayTitle: "Aula 3", title: "Twang no Belting", youtubeId: "", hasPractice: true, locked: true, exercise: "Agudo 'Nyeah'", practiceDesc: "Suba na escala usando um som de bruxa.", feedbackTitle: "Lâmina", feedbackDesc: "O twang tira o peso da nota, permitindo o agudo.", frequency: "Aquecimento" },
      { id: 4, displayTitle: "Aula 4", title: "Vogais Fechadas", youtubeId: "", hasPractice: true, locked: true, exercise: "Ah para Uh", practiceDesc: "Nos agudos, feche o formato da boca.", feedbackTitle: "Aero-dinâmica", feedbackDesc: "Vogais muito abertas 'racham' a voz no alto.", frequency: "Repertório" },
      { id: 5, displayTitle: "Aula 5", title: "Cinto de Segurança", youtubeId: "", hasPractice: true, locked: true, exercise: "Apoio Extremo", practiceDesc: "Empurre o diafragma para fora na nota alta.", feedbackTitle: "Pressão de Ar", feedbackDesc: "Belting requer muito menos ar, mas muita pressão.", frequency: "Treino" },
      { id: 6, displayTitle: "Aula 6", title: "Notas de Passagem", youtubeId: "", hasPractice: true, locked: true, exercise: "Passaggio Forte", practiceDesc: "Cante do Fá4 ao Dó5 com volume alto.", feedbackTitle: "A Quebra", feedbackDesc: "Onde os amadores falham, você brilha.", frequency: "Constante" },
      { id: 7, displayTitle: "Aula 7", title: "Sustentação Aguda", youtubeId: "", hasPractice: true, locked: true, exercise: "Belt Longo", practiceDesc: "Segure a nota aguda por 6 segundos.", feedbackTitle: "Resistência", feedbackDesc: "O clímax da música.", frequency: "Avançado" },
      { id: 8, displayTitle: "Aula 8", title: "Relaxando o Pescoço", youtubeId: "", hasPractice: true, locked: true, exercise: "Canto Balançando", practiceDesc: "Cante o agudo balançando a cabeça (Dizer Não).", feedbackTitle: "Soltura", feedbackDesc: "Se o pescoço travar, a voz quebra.", frequency: "Sempre" },
      { id: 9, displayTitle: "Aula 9", title: "Belt Saudável vs Grito", youtubeId: "", hasPractice: true, locked: true, exercise: "Análise", practiceDesc: "Sinta se raspou. Se raspou, parou.", feedbackTitle: "Saúde", feedbackDesc: "O belting perfeito soa difícil, mas é fácil para o corpo.", frequency: "Regra Ouro" },
      { id: 10, displayTitle: "Aula 10", title: "Desafio Diva Pop", youtubeId: "", hasPractice: true, locked: true, exercise: "A Prática", practiceDesc: "Música de alto alcance vocal.", feedbackTitle: "O Show", feedbackDesc: "Execute o clímax com maestria.", frequency: "Showcase" }
    ]
  },
  "9": {
    level: "Nível 9", moduleName: "Dinâmica e Microfone", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Afastamento (Mic)", youtubeId: "", hasPractice: true, locked: false, exercise: "Técnica de Palco", practiceDesc: "Afaste o mic 10cm durante o agudo.", feedbackTitle: "Compressão Manual", feedbackDesc: "O técnico de som agradece.", frequency: "Treino com Mic" },
      { id: 2, displayTitle: "Aula 2", title: "Efeito de Proximidade", youtubeId: "", hasPractice: true, locked: true, exercise: "Graves Encorpados", practiceDesc: "Cante colado no mic para notas muito graves.", feedbackTitle: "Calor Vocal", feedbackDesc: "O rádio usa isso o tempo todo.", frequency: "Treino" },
      { id: 3, displayTitle: "Aula 3", title: "Crescendo Dramático", youtubeId: "", hasPractice: true, locked: true, exercise: "Do Piano ao Forte", practiceDesc: "Aumente volume e vá afastando o mic.", feedbackTitle: "Controle de Onda", feedbackDesc: "Uma evolução perfeita de intensidade.", frequency: "Repertório" },
      { id: 4, displayTitle: "Aula 4", title: "Cores da Voz", youtubeId: "", hasPractice: true, locked: true, exercise: "Sorriso vs Triste", practiceDesc: "Cante sorrindo (som claro), depois faça beiço (som escuro).", feedbackTitle: "Timbre", feedbackDesc: "A mesma nota com diferentes intenções.", frequency: "Atuação" },
      { id: 5, displayTitle: "Aula 5", title: "Retorno (In-Ear)", youtubeId: "", hasPractice: true, locked: true, exercise: "Canto Obstruído", practiceDesc: "Cante com fones tapando o ouvido.", feedbackTitle: "Afinação Interna", feedbackDesc: "Simula o palco profissional.", frequency: "Avançado" },
      { id: 6, displayTitle: "Aula 6", title: "A Voz na Mixagem", youtubeId: "", hasPractice: true, locked: true, exercise: "Cortando a Base", practiceDesc: "Cante por cima de um playback muito alto.", feedbackTitle: "Projeção", feedbackDesc: "Sem perder o timbre para ser ouvido.", frequency: "Constante" },
      { id: 7, displayTitle: "Aula 7", title: "Ataques Explosivos", youtubeId: "", hasPractice: true, locked: true, exercise: "Staccato", practiceDesc: "Notas curtas e fortes com o mic.", feedbackTitle: "Ritmo de Banda", feedbackDesc: "Acompanhando bateria e metais.", frequency: "Repertório" },
      { id: 8, displayTitle: "Aula 8", title: "Decrescendo", youtubeId: "", hasPractice: true, locked: true, exercise: "Fading", practiceDesc: "Suma com a nota aos poucos, puxando o mic.", feedbackTitle: "Finais Sutis", feedbackDesc: "Deixa o público hipnotizado.", frequency: "Finais de música" },
      { id: 9, displayTitle: "Aula 9", title: "Microfonação Dinâmica", youtubeId: "", hasPractice: true, locked: true, exercise: "Coreografia", practiceDesc: "Ande pelo quarto mantendo a distância do mic correta.", feedbackTitle: "O Palco", feedbackDesc: "O show não para.", frequency: "Mover-se" },
      { id: 10, displayTitle: "Aula 10", title: "Show ao Vivo", youtubeId: "", hasPractice: true, locked: true, exercise: "Prática com Equipamento", practiceDesc: "Simulação de show com microfonação perfeita.", feedbackTitle: "Pronto pro Mundo", feedbackDesc: "Som nivelado do início ao fim.", frequency: "Showcase" }
    ]
  },
  "10": {
    level: "Nível 10", moduleName: "Masterclass Julliard", introVideo: "",
    lessons: [
      { id: 1, displayTitle: "Aula 1", title: "Identidade Artística", youtubeId: "", hasPractice: false, locked: false, exercise: "O Seu Som", practiceDesc: "Qual é a sua assinatura vocal?", feedbackTitle: "Unicidade", feedbackDesc: "A técnica perfeita deve servir à sua personalidade.", frequency: "Sempre" },
      { id: 2, displayTitle: "Aula 2", title: "Conexão Emocional", youtubeId: "", hasPractice: true, locked: true, exercise: "Canto Atuação", practiceDesc: "Cante chorando, depois com raiva.", feedbackTitle: "Storytelling", feedbackDesc: "O cantor é um contador de histórias.", frequency: "Interpretação" },
      { id: 3, displayTitle: "Aula 3", title: "Presença de Palco", youtubeId: "", hasPractice: true, locked: true, exercise: "Linguagem Corporal", practiceDesc: "O corpo canta junto com a voz.", feedbackTitle: "Magnetismo", feedbackDesc: "Ocupar o espaço do palco.", frequency: "Visual" },
      { id: 4, displayTitle: "Aula 4", title: "Improvisação (Scat)", youtubeId: "", hasPractice: true, locked: true, exercise: "Free Style", practiceDesc: "Crie melodias novas em cima do playback.", feedbackTitle: "Criatividade", feedbackDesc: "Saindo da partitura com segurança.", frequency: "Avançado" },
      { id: 5, displayTitle: "Aula 5", title: "Saúde em Turnê", youtubeId: "", hasPractice: false, locked: true, exercise: "Manutenção", practiceDesc: "Como cuidar da voz cantando todos os dias.", feedbackTitle: "Longevidade", feedbackDesc: "Hidratação, sono e aquecimento.", frequency: "Vida" },
      { id: 6, displayTitle: "Aula 6", title: "O Lado Psicológico", youtubeId: "", hasPractice: false, locked: true, exercise: "Foco", practiceDesc: "Lidando com nervosismo e palco.", feedbackTitle: "Mente Fria", feedbackDesc: "O corpo trava se a mente trava.", frequency: "Mental" },
      { id: 7, displayTitle: "Aula 7", title: "Lidando com Erros", youtubeId: "", hasPractice: true, locked: true, exercise: "Recuperação", practiceDesc: "Erre a letra de propósito e não pare de cantar.", feedbackTitle: "The Show Must Go On", feedbackDesc: "O público perdoa o erro, mas não a desistência.", frequency: "Palco" },
      { id: 8, displayTitle: "Aula 8", title: "Estúdio vs Ao Vivo", youtubeId: "", hasPractice: true, locked: true, exercise: "Adaptação", practiceDesc: "Cante a música contida (estúdio) e depois grandiosa (ao vivo).", feedbackTitle: "Versatilidade", feedbackDesc: "Duas abordagens para a mesma arte.", frequency: "Carreira" },
      { id: 9, displayTitle: "Aula 9", title: "O Som Único", youtubeId: "", hasPractice: true, locked: true, exercise: "Sua Assinatura", practiceDesc: "Ajuste todos os exercícios para o seu gênero musical.", feedbackTitle: "O Artista", feedbackDesc: "Não tente imitar ninguém.", frequency: "Sempre" },
      { id: 10, displayTitle: "Aula 10", title: "O Showcase Final", youtubeId: "", hasPractice: true, locked: true, exercise: "O Concerto", practiceDesc: "Apresentação completa de 3 músicas.", feedbackTitle: "Formatura", feedbackDesc: "Você está pronto para o Mainstream.", frequency: "Parabéns!" }
    ]
  }
};

export default function Lesson() {
  const navigate = useNavigate();
  // id da URL (ex: "1.1" -> Nível 1, Aula 1)
  const { id } = useParams<{ id: string }>(); 
  
  const levelId = id?.split('.')[0] || "1"; 
  const lessonIdFromUrl = id?.split('.')[1]; // Pode ser "intro" ou o número (1 a 10)
  
  const currentModule = academyData[levelId];
  
  const getInitialLessonIndex = () => {
    if (!lessonIdFromUrl || lessonIdFromUrl === 'intro') return 0;
    return parseInt(lessonIdFromUrl) || 0;
  };

  const [activeLessonIndex, setActiveLessonIndex] = useState(getInitialLessonIndex());
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPremiumUser = user?.email === 'bruno.fmonte@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      setActiveLessonIndex(getInitialLessonIndex());
      setIsTrainingActive(false); 
    }
  }, [id]);

  // Estados do Treino
  const [step, setStep] = useState<'video' | 'practice'>('video');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'countdown' | 'active' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); 

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-black text-cyan-400 mb-4">NÍVEL EM CONSTRUÇÃO</h1>
        <Button onClick={() => navigate('/academy')} variant="outline" className="text-white border-white/20">Voltar</Button>
      </div>
    );
  }

  const isIntroActive = activeLessonIndex === 0;
  const currentLesson = isIntroActive ? null : currentModule.lessons.find(l => l.id === activeLessonIndex);

  // Controle de Timer e Áudio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (trainingStatus === 'countdown') {
      if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      else {
        setTrainingStatus('active');
        if (audioRef.current) {
          audioRef.current.volume = 0.2;
          audioRef.current.play().catch(e => console.log("Áudio bloqueado"));
        }
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

  // Motor Dinâmico (Ciclos)
  const getCycleState = () => {
    if (!currentLesson) return { phase: '', instruction: '', color: 'gray', icon: Activity };
    const elapsed = 60 - timeLeft; 
    
    if (levelId === "1" && currentLesson.id === 1) { 
        const t = elapsed % 22; 
        if (t < 4) return { phase: 'INSPIRA', instruction: 'Puxe o ar (4s)', color: 'cyan', icon: Wind };
        if (t < 8) return { phase: 'SEGURA', instruction: 'Mantenha o ar (4s)', color: 'orange', icon: Lock };
        if (t < 18) return { phase: 'EXPIRA', instruction: 'Solte o ar devagar (10s)', color: 'blue', icon: Mic2 };
        return { phase: 'DESCANSA', instruction: 'Relaxe (4s)', color: 'gray', icon: Coffee };
    }
    if (levelId === "1" && currentLesson.id === 2) { 
        const t = elapsed % 20;
        if (t < 5) return { phase: 'INSPIRA', instruction: 'Inspira fundo', color: 'cyan', icon: Wind };
        if (t < 18) return { phase: 'SOLTE O S', instruction: 'Mantenha o som constante', color: 'orange', icon: Volume2 };
        return { phase: 'DESCANSA', instruction: 'Descansa', color: 'gray', icon: Coffee };
    }
    
    // Padrão genérico para os demais Níveis
    const t = elapsed % 15;
    if (t < 5) return { phase: 'PREPARAÇÃO', instruction: 'Ouça a nota e concentre-se', color: 'cyan', icon: Music };
    return { phase: 'EXECUÇÃO', instruction: 'Cante com precisão', color: 'orange', icon: Mic2 };
  };

  const cycleState = getCycleState();
  const CycleIcon = cycleState.icon || Activity;

  const changeLesson = (lessonId: number) => {
    if (lessonId > 0) {
      const lessonTarget = currentModule.lessons.find(l => l.id === lessonId);
      const isLockedForUser = lessonTarget?.locked && !isPremiumUser;

      if (isLockedForUser) {
        navigate('/premium');
        return;
      }
    }
    
    navigate(`/lesson/${levelId}.${lessonId === 0 ? 'intro' : lessonId}`);
    setStep('video');
    setTrainingStatus('idle');
    setTimeLeft(60);
    setCountdown(3);
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
            {displayLabel}: <span className="text-cyan-400">{displayTitle}</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* PLAYER OU ARENA DE EXERCÍCIO (ÁREA ESQUERDA) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            
            {isTrainingActive ? (
              <VocalSandboxProvider>
                <div className="w-full bg-zinc-950 rounded-[2rem] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] p-8 relative flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in-95 duration-500">
                  <Button variant="ghost" onClick={() => setIsTrainingActive(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white rounded-full bg-black/50 backdrop-blur-md">
                    <X size={24} className="mr-2" /> FECHAR TREINO
                  </Button>
                  
                  {/* INTELIGÊNCIA DE ROTAS DOS TREINOS (Baseado no Nível) */}
                  {levelId === "2" ? (
                     <PitchCalibrationExercise /> // Nível 2 = Afinação
                  ) : (
                     <FarinelliExercise moduleType="farinelli" /> // Todos os outros (Respiração/Performance) caem no Painel Neon por enquanto
                  )}
                </div>
              </VocalSandboxProvider>

            ) : (
              <>
                <div className="w-full aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group animate-in fade-in duration-500">
                  {videoToPlay ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoToPlay}?autoplay=1&rel=0&modestbranding=1`} title="Aula Academy" frameBorder="0" allowFullScreen className="absolute inset-0 w-full h-full"></iframe>
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-black">
                        <Lock className="h-12 w-12 mb-4 opacity-50" />
                        <p className="font-bold uppercase tracking-widest text-xs">VÍDEO EM PRODUÇÃO</p>
                        <p className="text-[10px] mt-2">Aguardando inserção do Link do YouTube</p>
                     </div>
                  )}
                </div>

                {!isIntroActive && currentLesson?.hasPractice && (
                  <div className="bg-zinc-950 border border-cyan-500/20 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(6,182,212,0.1)] mt-4 animate-in slide-in-from-bottom-5">
                    <Mic2 className="h-12 w-12 text-cyan-400 mb-4 opacity-80" />
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-widest mb-2">{currentLesson.exercise || "TREINO PRÁTICO"}</h2>
                    <p className="text-sm text-gray-400 font-medium mb-8">{currentLesson.practiceDesc || "Execute a técnica aprendida no vídeo."}</p>
                    
                    <div className="flex gap-4">
                      {/* BOTÃO DO CRONÔMETRO */}
                      <Button onClick={() => {setStep('practice'); setTrainingStatus('idle'); setIsTrainingActive(false);}} variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-black uppercase tracking-widest h-14 px-8 rounded-full">
                        MODO CRONÔMETRO
                      </Button>
                      
                      {/* BOTÃO DA IA / JULLIARD */}
                      <Button onClick={() => setIsTrainingActive(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest h-14 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105">
                        LIGAR IA JULLIARD
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* TELA DE CRONÔMETRO ANTIGA (Se o usuário escolher MODO CRONÔMETRO) */}
                {step === 'practice' && !isTrainingActive && (
                  <Card className="bg-zinc-950/80 backdrop-blur-xl border-cyan-400/30 rounded-[3rem] p-8 md:p-12 min-h-[400px] flex flex-col justify-center items-center mt-6 animate-in zoom-in-95">
                    {trainingStatus === 'idle' ? (
                      <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{currentLesson?.exercise}</h2>
                        <Button onClick={() => setTrainingStatus('countdown')} className="h-16 px-12 rounded-full bg-cyan-400 text-black font-black uppercase">COMEÇAR CRONÔMETRO (60s)</Button>
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
              </>
            )}
          </div>

          {/* A PLAYLIST LATERAL */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <ListVideo className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black text-white uppercase tracking-widest text-sm">PLAYLIST NÍVEL {levelId}</h3>
             </div>
             
             <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[2rem] p-4 overflow-y-auto max-h-[800px] space-y-3 custom-scrollbar">
                
                <div onClick={() => changeLesson(0)} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeLessonIndex === 0 ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'}`}>
                   <PlayCircle size={20} className="shrink-0" />
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Introdução</p>
                     <p className="text-sm font-black italic uppercase line-clamp-1">{currentModule.moduleName}</p>
                   </div>
                </div>

                {currentModule.lessons.map((lesson) => (
                  <div key={lesson.id} onClick={() => lesson.youtubeId ? changeLesson(lesson.id) : toast.error("Aula ainda não liberada.")} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeLessonIndex === lesson.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'} ${!lesson.youtubeId ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                     {lesson.youtubeId ? <PlayCircle size={20} className="shrink-0" /> : <Lock size={20} className="shrink-0" />}
                     <div>
                       <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Aula {lesson.id}</p>
                       <p className="text-sm font-black italic uppercase line-clamp-1">{lesson.title}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}