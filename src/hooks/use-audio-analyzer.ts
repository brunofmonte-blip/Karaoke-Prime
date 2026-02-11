import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AudioAnalyzerResult {
  isAnalyzing: boolean;
  startAnalysis: () => void;
  stopAnalysis: () => void;
  pitchDataHz: number;
  pitchDataVisualization: number;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

const FFT_SIZE = 2048;
const SAMPLE_RATE = 44100;
const MIN_FREQ = 80;
const MAX_FREQ = 1000;
const DEFAULT_SENSITIVITY_THRESHOLD = 100; 

const frequencyToVisualizationScale = (frequency: number): number => {
  if (frequency < MIN_FREQ) return 0;
  if (frequency > MAX_FREQ) return 100;
  return ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
};

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
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);

    let maxVolume = 0;
    let maxIndex = -1;

    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxVolume) {
        maxVolume = dataArray[i];
        maxIndex = i;
      }
    }

    let frequency = 0;
    if (maxIndex > 0 && maxVolume > sensitivity) { 
      frequency = (maxIndex * SAMPLE_RATE) / FFT_SIZE;
    }
    
    const visualizationPitch = frequencyToVisualizationScale(frequency);
    
    setPitchDataHz(frequency);
    setPitchDataVisualization(visualizationPitch);

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, [sensitivity]);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      
      // Explicitly resume context to bypass browser security
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
      toast.success("Microfone conectado. Pode começar a cantar!", { duration: 2000 });
      
      animationFrameRef.current = requestAnimationFrame(analyze);

    } catch (error) {
      console.error("[use-audio-analyzer] Error accessing microphone:", error);
      toast.error("Acesso ao microfone negado. Verifique as permissões.", { duration: 5000 });
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
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsAnalyzing(false);
    setPitchDataHz(0);
    setPitchDataVisualization(0);
  };

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
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