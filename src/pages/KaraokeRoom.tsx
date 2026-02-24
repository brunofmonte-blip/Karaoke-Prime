"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Square, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function KaraokeRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // IF NO ID IS SENT, FALLBACK TO A GENERIC KARAOKE BACKGROUND, NEVER MOANA.
  const videoId = searchParams.get('v') || 'oVbXpK_BRbw';

  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // MEDIA LOGIC: WEBCAM & MIC
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
          audio: isMicOn 
        });
        setStream(newStream);
        setIsCameraOn(true);
        // We'll set the srcObject in a useEffect to ensure the ref is ready
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // In a real app, we would update the audio track of the existing stream here
  };

  // MOCK SCORING LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && isMicOn) {
      const words = ["PERFECT!", "BOM!", "EXCELENTE!", "INCRÍVEL!"];
      
      const triggerFeedback = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setFeedback(randomWord);
        
        // Clear feedback after 1.5s
        setTimeout(() => setFeedback(''), 1500);
        
        // Schedule next feedback between 3 and 6 seconds
        const nextTime = Math.floor(Math.random() * 3000) + 3000;
        interval = setTimeout(triggerFeedback, nextTime);
      };

      interval = setTimeout(triggerFeedback, 3000);
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isRecording, isMicOn]);

  // Sync video element with stream
  useEffect(() => {
    if (isCameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOn, stream]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
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

      {/* Video Player Section */}
      <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 bg-black relative group">
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

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <h2 className="text-6xl md:text-8xl font-black text-yellow-400 italic animate-in zoom-in duration-300 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] uppercase tracking-tighter">
              {feedback}
            </h2>
          </div>
        )}
        
        {/* Webcam Overlay */}
        {isCameraOn && (
          <div className="absolute bottom-6 right-6 z-30">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className="w-48 h-32 object-cover rounded-2xl border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20" 
            />
          </div>
        )}
        
        {/* Pitch Visualizer Overlay */}
        <div className="absolute bottom-8 left-8 right-8 h-16 flex items-end gap-1 pointer-events-none opacity-50">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-primary rounded-t-sm animate-pulse" 
              style={{ 
                height: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.05}s`
              }} 
            />
          ))}
        </div>
      </div>

      {/* Control Dock */}
      <div className="mt-8 w-full max-w-2xl glass-pillar border-2 border-primary/30 rounded-3xl p-6 flex items-center justify-between shadow-2xl">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleMic}
            className={cn(
              "h-14 w-14 rounded-2xl border-2 transition-all",
              isMicOn ? "border-primary text-primary bg-primary/20 shadow-[0_0_15px_rgba(0,168,225,0.4)]" : "border-destructive text-destructive bg-destructive/10"
            )}
          >
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleCamera}
            className={cn(
              "h-14 w-14 rounded-2xl border-2 transition-all",
              isCameraOn ? "border-primary text-primary bg-primary/20 shadow-[0_0_15px_rgba(0,168,225,0.4)]" : "border-muted text-muted-foreground bg-muted/10"
            )}
          >
            {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
        </div>

        <Button 
          onClick={() => setIsRecording(!isRecording)}
          className={cn(
            "px-10 py-7 rounded-2xl font-black text-lg transition-all duration-500 shadow-lg",
            isRecording 
              ? "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/40 animate-pulse" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/40"
          )}
        >
          {isRecording ? (
            <>
              <Square className="h-6 w-6 mr-3 fill-current" />
              PARAR GRAVAÇÃO
            </>
          ) : (
            <>
              <div className="h-3 w-3 rounded-full bg-red-500 mr-3 animate-ping" />
              INICIAR GRAVAÇÃO
            </>
          )}
        </Button>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-tighter">Pitch Sync</span>
          </div>
          <span className="text-xl font-black text-white tabular-nums">0.00s</span>
        </div>
      </div>
    </div>
  );
}