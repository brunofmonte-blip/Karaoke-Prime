"use client";

import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Square, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function KaraokeRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // IF NO ID IS SENT, FALLBACK TO A GENERIC KARAOKE BACKGROUND, NEVER MOANA.
  const videoId = searchParams.get('v') || 'oVbXpK_BRbw';

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/basic')}
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
            onClick={() => setIsMicOn(!isMicOn)}
            className={cn(
              "h-14 w-14 rounded-2xl border-2 transition-all",
              isMicOn ? "border-primary text-primary bg-primary/10" : "border-destructive text-destructive bg-destructive/10"
            )}
          >
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={cn(
              "h-14 w-14 rounded-2xl border-2 transition-all",
              isCameraOn ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground bg-muted/10"
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