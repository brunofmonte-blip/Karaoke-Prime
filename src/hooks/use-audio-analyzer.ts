import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AudioAnalyzerResult {
  isAnalyzing: boolean;
  startAnalysis: () => void;
  stopAnalysis: () => void;
  pitchDataHz: number; // New: Raw detected frequency in Hz
  pitchDataVisualization: number; // Existing: 0-100 scale for UI
}

const FFT_SIZE = 2048;
const SAMPLE_RATE = 44100;
const MIN_FREQ = 80; // Approx E2
const MAX_FREQ = 1000; // Approx C6

// Function to convert frequency (Hz) to a 0-100 visualization scale
const frequencyToVisualizationScale = (frequency: number): number => {
  if (frequency < MIN_FREQ) return 0;
  if (frequency > MAX_FREQ) return 100;
  
  // Simple linear scaling for visualization purposes
  return ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
};

export const useAudioAnalyzer = (): AudioAnalyzerResult => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchDataHz, setPitchDataHz] = useState(0); // New state for Hz
  const [pitchDataVisualization, setPitchDataVisualization] = useState(0); // Existing state for visualization
  
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

    // Simple pitch detection: find the peak frequency bin
    let maxVolume = 0;
    let maxIndex = -1;

    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxVolume) {
        maxVolume = dataArray[i];
        maxIndex = i;
      }
    }

    let frequency = 0;
    if (maxIndex > 0 && maxVolume > 100) { // Threshold volume to ignore silence
      // Calculate frequency based on bin index
      frequency = (maxIndex * SAMPLE_RATE) / FFT_SIZE;
    }
    
    const visualizationPitch = frequencyToVisualizationScale(frequency);
    
    setPitchDataHz(frequency); // Update raw frequency
    setPitchDataVisualization(visualizationPitch); // Update visualization pitch

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, []);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;

      const analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyserRef.current = analyser;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsAnalyzing(true);
      toast.success("Microphone connected. Start singing!", { duration: 2000 });
      
      // Start the analysis loop
      animationFrameRef.current = requestAnimationFrame(analyze);

    } catch (error) {
      console.error("[use-audio-analyzer] Error accessing microphone:", error);
      toast.error("Microphone access denied. Please check permissions.", { duration: 5000 });
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      const track = sourceRef.current.mediaStream.getTracks()[0];
      track.stop();
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsAnalyzing(false);
    setPitchDataHz(0);
    setPitchDataVisualization(0);
    toast.info("Analysis stopped.", { duration: 2000 });
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
  };
};