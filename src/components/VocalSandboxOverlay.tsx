import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AudioAnalyzerResult {
  isAnalyzing: boolean;
  startAnalysis: () => Promise<void>;
  stopAnalysis: () => void;
  pitchDataHz: number;
  pitchDataVisualization: number;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

const FFT_SIZE = 2048;
const MIN_FREQ = 80;   // Voz humana mais grave aceitável
const MAX_FREQ = 1000; // Voz humana mais aguda aceitável
const DEFAULT_SENSITIVITY_THRESHOLD = 100;

// Escala de 0 a 100 para os gráficos do DYAD
const frequencyToVisualizationScale = (frequency: number): number => {
  if (frequency < MIN_FREQ || frequency > MAX_FREQ) return 0;
  return ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
};

// O nosso Motor Matemático Cirúrgico
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let SIZE = buf.length;
  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

function getRMS(buf: Float32Array): number {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  return Math.sqrt(rms / buf.length);
}

export const useAudioAnalyzer = (): AudioAnalyzerResult => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchDataHz, setPitchDataHz] = useState(0);
  const [pitchDataVisualization, setPitchDataVisualization] = useState(0);
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY_THRESHOLD);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  const analyze = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    
    // Pega o sinal CRU de áudio para descobrir a afinação real
    analyser.getFloatTimeDomainData(buffer);

    const rms = getRMS(buffer);
    
    // Lógica de sensibilidade: Quanto maior o slider (0-200), menor o limite para detectar som
    const volumeThreshold = Math.max(0.001, (200 - sensitivity) * 0.0005);

    if (rms > volumeThreshold) {
      const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
      
      if (frequency !== -1 && frequency >= MIN_FREQ && frequency <= MAX_FREQ) {
        setPitchDataHz(frequency);
        setPitchDataVisualization(frequencyToVisualizationScale(frequency));
      } else {
        // Ignora ruídos que não são voz
        setPitchDataHz(0);
        setPitchDataVisualization(0);
      }
    } else {
      // Silêncio
      setPitchDataHz(0);
      setPitchDataVisualization(0);
    }

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, [sensitivity]);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      audioContextRef.current = context;

      const analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyserRef.current = analyser;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsAnalyzing(true);
      toast.success("Motor de Alta Precisão ativado!", { duration: 2000 });
      
      animationFrameRef.current = requestAnimationFrame(analyze);

    } catch (error) {
      console.error("[use-audio-analyzer] Erro de microfone:", error);
      toast.error("Microfone não autorizado.", { duration: 5000 });
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      const tracks = sourceRef.current.mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsAnalyzing(false);
    setPitchDataHz(0);
    setPitchDataVisualization(0);
  };

  useEffect(() => {
    return () => { stopAnalysis(); };
  }, []);

  return {
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    pitchDataHz,
    pitchDataVisualization,
    sensitivity,
    setSensitivity,
  };
};