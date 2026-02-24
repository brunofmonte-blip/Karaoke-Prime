"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Square, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function KaraokeRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const videoId = searchParams.get('v') || 'oVbXpK_BRbw';

  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micVolumeRef = useRef(0);

  // RECORDING TIMER LOGIC
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsCameraOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(newStream);
        setIsCameraOn(true);
        setIsMicOn(true);
        setupAudioAnalyzer(newStream);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
  };

  const setupAudioAnalyzer = (mediaStream: MediaStream) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    
    source.connect(analyser);
    analyser.fftSize = 256;
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      micVolumeRef.current = average;
      
      requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && isMicOn) {
      const words = ["PERFECT!", "BOM!", "EXCELENTE!", "INCRÍVEL!"];
      
      const checkPerformance = () => {
        if (micVolumeRef.current > 15) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          setFeedback(randomWord);
          setTimeout(() => setFeedback(''), 1500);
        } else {
          setFeedback('Gravando...');
          setTimeout(() => setFeedback(''), 1500);
        }
        
        const nextTime = Math.floor(Math.random() * 3000) + 3000;
        interval = setTimeout(checkPerformance, nextTime);
      };

      interval = setTimeout(checkPerformance, 2000);
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isRecording, isMicOn]);

  useEffect(() => {
    if (isCameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOn, stream]);

  const handleStop = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    // Pass the recording time to the score screen
    navigate('/score', { state: { time: recordingTime } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            navigate('/basic');
          }}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar ao Lobby
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">Live Studio</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto flex-grow">
        
        {/* LEFT COLUMN: Video Player */}
        <div className="flex-grow aspect-video lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-black relative">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1`} 
            title="Karaoke Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* RIGHT COLUMN: Studio Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Feedback Area */}
          <div className="h-32 flex items-center justify-center glass-pillar rounded-2xl border-2 border-accent/30 shadow-lg">
            {feedback ? (
              <h2 className={cn(
                "font-black italic animate-in zoom-in duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] uppercase tracking-tighter",
                feedback === 'Gravando...' ? "text-primary text-xl" : "text-4xl text-yellow-400"
              )}>
                {feedback}
              </h2>
            ) : (
              <div className="text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Performance</p>
                <p className="text-sm text-gray-400 italic">Aguardando voz...</p>
              </div>
            )}
          </div>

          {/* Webcam Area */}
          <div className="aspect-video rounded-2xl overflow-hidden border-2 border-cyan-500 bg-black relative shadow-xl">
            {isCameraOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                <VideoOff className="h-8 w-8 opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Câmera Desligada</span>
              </div>
            )}
          </div>

          {/* Control Dock */}
          <div className="glass-pillar border-2 border-primary/30 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleMic}
                className={cn(
                  "h-12 w-12 rounded-xl border-2 transition-all",
                  isMicOn ? "border-primary text-primary bg-primary/20 shadow-[0_0_10px_rgba(0,168,225,0.4)]" : "border-destructive text-destructive bg-destructive/10"
                )}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleCamera}
                className={cn(
                  "h-12 w-12 rounded-xl border-2 transition-all",
                  isCameraOn ? "border-primary text-primary bg-primary/20 shadow-[0_0_10px_rgba(0,168,225,0.4)]" : "border-muted text-muted-foreground bg-muted/10"
                )}
              >
                {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </div>

            <Button 
              onClick={() => isRecording ? handleStop() : setIsRecording(true)}
              className={cn(
                "w-full py-8 rounded-2xl font-black text-base transition-all duration-500 shadow-lg",
                isRecording 
                  ? "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/40 animate-pulse" 
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/40"
              )}
            >
              {isRecording ? (
                <>
                  <Square className="h-5 w-5 mr-2 fill-current" />
                  PARAR
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-ping" />
                  GRAVAR
                </>
              )}
            </Button>

            <div className="flex flex-col items-center pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Pitch Sync</span>
              </div>
              <span className="text-2xl font-black text-white tabular-nums">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}s
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}