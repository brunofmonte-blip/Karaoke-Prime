import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { createPitchDetector, frequencyToNote } from '@/utils/pitch-detection';
import { useI18n } from '@/i18n';

export interface MicDevice {
  id: string;
  label: string;
}

const MIC_STORAGE_KEY = 'kp_mic';
// Entradas virtuais (Voicemeeter, cabos de áudio, mixagem estéreo) costumam
// mandar silêncio ou o som do próprio computador — nunca a voz.
const VIRTUAL_MIC = /voicemeeter|vb-audio|virtual|cable|stereo mix|mixagem est|wave link|obs|blackhole|soundflower|loopback/i;

const AUDIO_CONSTRAINTS = {
  // Processamentos do navegador distorcem a afinação; desligados para medir a voz real
  echoCancellation: false,
  noiseSuppression: false,
  // Ganho automático só mexe no volume, não na afinação; ajuda microfones fracos
  autoGainControl: true,
};

function readSavedMic(): string | null {
  try {
    return window.localStorage.getItem(MIC_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveMic(id: string) {
  try {
    window.localStorage.setItem(MIC_STORAGE_KEY, id);
  } catch {
    // sem persistência
  }
}

async function openMic(deviceId?: string): Promise<MediaStream> {
  const audio: MediaTrackConstraints = { ...AUDIO_CONSTRAINTS };
  if (deviceId) audio.deviceId = { exact: deviceId };
  else audio.deviceId = { ideal: 'default' }; // microfone padrão do sistema
  return navigator.mediaDevices.getUserMedia({ audio });
}

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
  /** 0–1: volume do microfone (para o medidor de sinal) */
  micLevel: number;
  /** Microfones disponíveis (aparecem depois da permissão) */
  micDevices: MicDevice[];
  /** deviceId do microfone em uso */
  currentMicId: string;
  /** Troca o microfone (e lembra a escolha) */
  selectMic: (deviceId: string) => Promise<void>;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

const BUFFER_SIZE = 2048;
const MIN_FREQ = 80;
const MAX_FREQ = 1000;
const MIN_CLARITY = 0.75;
const DEFAULT_SENSITIVITY_THRESHOLD = 100; // slider 0–200: maior = ignora sons mais baixos

// O detector aceita sons bem baixos; quem decide o que é voz é o "portão"
// adaptativo abaixo, calibrado pelo ruído de fundo de CADA microfone
// (fones Bluetooth chegam ~10x mais baixos que o microfone do notebook).
const DETECTOR_MIN_RMS = 0.0003;
const MIN_NOISE_FLOOR = 0.0001;
// Sensibilidade 0–200 (padrão 100): voz precisa ficar 2x–6x acima do ruído (padrão 4x)
const sensitivityToGateFactor = (sensitivity: number) => 2 + (sensitivity / 200) * 4;

const frequencyToVisualizationScale = (frequency: number): number => {
  if (frequency < MIN_FREQ) return 0;
  if (frequency > MAX_FREQ) return 100;
  // escala logarítmica: cada oitava ocupa o mesmo espaço, como o ouvido percebe
  return (Math.log2(frequency / MIN_FREQ) / Math.log2(MAX_FREQ / MIN_FREQ)) * 100;
};

export const useAudioAnalyzer = (): AudioAnalyzerResult => {
  const { tr } = useI18n();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchDataHz, setPitchDataHz] = useState(0);
  const [pitchDataVisualization, setPitchDataVisualization] = useState(0);
  const [pitchNote, setPitchNote] = useState('');
  const [pitchCents, setPitchCents] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [micLevel, setMicLevel] = useState(0);
  const [micDevices, setMicDevices] = useState<MicDevice[]>([]);
  const [currentMicId, setCurrentMicId] = useState('');
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY_THRESHOLD);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const detectorRef = useRef<ReturnType<typeof createPitchDetector> | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const noiseFloorRef = useRef(0.001);
  const sensitivityRef = useRef(DEFAULT_SENSITIVITY_THRESHOLD);
  sensitivityRef.current = sensitivity;

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    const detect = detectorRef.current;
    if (!analyser || !buffer || !detect) return;

    analyser.getFloatTimeDomainData(buffer);
    const result = detect(buffer);

    // Ruído de fundo: desce rápido quando o ambiente fica quieto, sobe devagar
    const floor = noiseFloorRef.current;
    const rms = result.rms;
    noiseFloorRef.current = Math.max(
      MIN_NOISE_FLOOR,
      rms < floor ? floor * 0.7 + rms * 0.3 : floor * 1.002,
    );
    const gate = noiseFloorRef.current * sensitivityToGateFactor(sensitivityRef.current);
    const isVoice = rms >= gate && result.clarity >= MIN_CLARITY;
    const frequency = isVoice ? result.frequency : 0;
    const note = frequencyToNote(frequency);

    setPitchDataHz(frequency);
    setPitchDataVisualization(frequencyToVisualizationScale(frequency));
    setPitchNote(note?.name ?? '');
    setPitchCents(note?.cents ?? 0);
    setClarity(result.clarity);
    // Medidor relativo ao ruído de fundo: 0 = silêncio, 1 = ~30x acima do ruído
    setMicLevel(rms > 0 ? Math.max(0, Math.min(1, Math.log10(rms / noiseFloorRef.current) / 1.5)) : 0);

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, []);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    // O AudioContext precisa nascer DENTRO do clique; se for criado depois de
    // esperar a permissão do microfone, o Chrome pode deixá-lo pausado (silêncio).
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const context: AudioContext = new AudioContextClass();
    context.resume().catch(() => undefined);

    try {
      // 1) microfone salvo; 2) padrão do sistema
      const saved = readSavedMic();
      let stream: MediaStream;
      try {
        stream = await openMic(saved || undefined);
      } catch {
        stream = await openMic();
      }

      // Se o navegador entregou uma entrada virtual (ex.: Voicemeeter), troca
      // por um microfone de verdade — a menos que a pessoa tenha escolhido essa.
      const devices = await listMics();
      const inUse = stream.getAudioTracks()[0]?.getSettings().deviceId ?? '';
      const inUseLabel = devices.find((d) => d.id === inUse)?.label ?? stream.getAudioTracks()[0]?.label ?? '';
      if (!saved && VIRTUAL_MIC.test(inUseLabel)) {
        const real =
          devices.find((d) => d.id === 'default' && !VIRTUAL_MIC.test(d.label)) ??
          devices.find((d) => d.id !== 'default' && d.id !== 'communications' && !VIRTUAL_MIC.test(d.label));
        if (real) {
          try {
            const better = await openMic(real.id);
            stream.getTracks().forEach((track) => track.stop());
            stream = better;
          } catch {
            // fica com o que temos
          }
        }
      }
      setCurrentMicId(stream.getAudioTracks()[0]?.getSettings().deviceId ?? '');

      if (context.state === 'suspended') {
        await context.resume();
      }
      audioContextRef.current = context;

      const analyser = context.createAnalyser();
      analyser.fftSize = BUFFER_SIZE;
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);
      noiseFloorRef.current = 0.001; // recalibra para o microfone atual

      // Usa a taxa de amostragem REAL do aparelho (44.1k ou 48k), não um valor fixo
      detectorRef.current = createPitchDetector({
        sampleRate: context.sampleRate,
        minFrequency: MIN_FREQ,
        maxFrequency: MAX_FREQ,
        minRms: DETECTOR_MIN_RMS,
      });

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsAnalyzing(true);
      toast.success(tr('Microfone conectado. Pode começar a cantar!', 'Mic connected. Start singing!'), { duration: 2000 });

      animationFrameRef.current = requestAnimationFrame(analyze);
    } catch (error) {
      console.error('[use-audio-analyzer] Error accessing microphone:', error);
      toast.error(tr('Não conseguimos usar seu microfone. Libere o acesso no navegador e tente de novo.', "We couldn't use your microphone. Allow access in your browser and try again."), { duration: 6000 });
      context.close().catch(() => undefined);
      setIsAnalyzing(false);
    }
  };

  async function listMics(): Promise<MicDevice[]> {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const mics = all
        .filter((d) => d.kind === 'audioinput')
        .map((d, i) => ({ id: d.deviceId, label: d.label || `Microfone ${i + 1}` }));
      setMicDevices(mics);
      return mics;
    } catch {
      return [];
    }
  }

  const selectMic = async (deviceId: string) => {
    const context = audioContextRef.current;
    const analyser = analyserRef.current;
    if (!context || !analyser) {
      saveMic(deviceId);
      return;
    }
    try {
      const stream = await openMic(deviceId);
      if (sourceRef.current) {
        sourceRef.current.mediaStream.getTracks().forEach((track) => track.stop());
        sourceRef.current.disconnect();
      }
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;
      noiseFloorRef.current = 0.001;
      saveMic(deviceId);
      setCurrentMicId(stream.getAudioTracks()[0]?.getSettings().deviceId ?? deviceId);
    } catch {
      toast.error(tr('Não foi possível usar esse microfone.', "Couldn't use that microphone."));
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
    setMicLevel(0);
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
    micLevel,
    micDevices,
    currentMicId,
    selectMic,
    sensitivity,
    setSensitivity,
  };
};
