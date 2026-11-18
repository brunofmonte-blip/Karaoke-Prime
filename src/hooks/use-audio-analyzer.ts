import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { createPitchDetector, frequencyToNote } from '@/utils/pitch-detection';

interface AudioAnalyzerResult {
  isAnalyzing: boolean;
  startAnalysis: () => void;
  stopAnalysis: () => void;
  /** Frequência fundamental real (YIN) em Hz; 0 = sem voz afinada */
  pitchDataHz: number;
  pitchDataVisualization: number;
  /** Nota cantada, ex.: "A4" (vazio quando não há voz) */
  pitchNote: string;
  /** Desvio em cents da nota mais próxima (-50 a +50) */
  pitchCents: number;
  /** 0–1: estabilidade/clareza do som */
  clarity: number;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

const BUFFER_SIZE = 2048;
const MIN_FREQ = 80;
const MAX_FREQ = 1000;
const MIN_CLARITY = 0.8;
const DEFAULT_SENSITIVITY_THRESHOLD = 100; // slider 0–200: maior = ignora sons mais baixos

const sensitivityToMinRms = (sensitivity: number) => 0.002 + (sensitivity / 200) * 0.05;

const frequencyToVisualizationScale = (frequency: number): number => {
  if (frequency < MIN_FREQ) return 0;
  if (frequency > MAX_FREQ) return 100;
  // escala logarítmica: cada oitava ocupa o mesmo espaço, como o ouvido percebe
  return (Math.log2(frequency / MIN_FREQ) / Math.log2(MAX_FREQ / MIN_FREQ)) * 100;
};

export const useAudioAnalyzer = (): AudioAnalyzerResult => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchDataHz, setPitchDataHz] = useState(0);
  const [pitchDataVisualization, setPitchDataVisualization] = useState(0);
  const [pitchNote, setPitchNote] = useState('');
  const [pitchCents, setPitchCents] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY_THRESHOLD);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const detectorRef = useRef<ReturnType<typeof createPitchDetector> | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Recria o detector quando a sensibilidade muda
  useEffect(() => {
    const ctx = audioContextRef.current;
    if (ctx) {
      detectorRef.current = createPitchDetector({
        sampleRate: ctx.sampleRate,
        minFrequency: MIN_FREQ,
        maxFrequency: MAX_FREQ,
        minRms: sensitivityToMinRms(sensitivity),
      });
    }
  }, [sensitivity]);

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    const detect = detectorRef.current;
    if (!analyser || !buffer || !detect) return;

    analyser.getFloatTimeDomainData(buffer);
    const result = detect(buffer);

    const frequency = result.clarity >= MIN_CLARITY ? result.frequency : 0;
    const note = frequencyToNote(frequency);

    setPitchDataHz(frequency);
    setPitchDataVisualization(frequencyToVisualizationScale(frequency));
    setPitchNote(note?.name ?? '');
    setPitchCents(note?.cents ?? 0);
    setClarity(result.clarity);

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, []);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Processamentos do navegador distorcem a afinação; desligados para medir a voz real
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context: AudioContext = new AudioContextClass();
      if (context.state === 'suspended') {
        await context.resume();
      }
      audioContextRef.current = context;

      const analyser = context.createAnalyser();
      analyser.fftSize = BUFFER_SIZE;
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);

      // Usa a taxa de amostragem REAL do aparelho (44.1k ou 48k), não um valor fixo
      detectorRef.current = createPitchDetector({
        sampleRate: context.sampleRate,
        minFrequency: MIN_FREQ,
        maxFrequency: MAX_FREQ,
        minRms: sensitivityToMinRms(sensitivity),
      });

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsAnalyzing(true);
      toast.success('Microfone conectado. Pode começar a cantar!', { duration: 2000 });

      animationFrameRef.current = requestAnimationFrame(analyze);
    } catch (error) {
      console.error('[use-audio-analyzer] Error accessing microphone:', error);
      toast.error('Acesso ao microfone negado. Verifique as permissões.', { duration: 5000 });
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.mediaStream.getTracks().forEach((track) => track.stop());
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    setIsAnalyzing(false);
    setPitchDataHz(0);
    setPitchDataVisualization(0);
    setPitchNote('');
    setPitchCents(0);
    setClarity(0);
  };

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    pitchDataHz,
    pitchDataVisualization,
    pitchNote,
    pitchCents,
    clarity,
    sensitivity,
    setSensitivity,
  };
};
