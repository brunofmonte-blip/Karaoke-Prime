import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Play, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // GAMIFICATION STATES
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");

  // MEMORY REF FOR MIC VOLUME (Prevents re-render loops)
  const micVolumeRef = useRef(0);

  // EFFECT 1: REAL MICROPHONE LISTENER
  useEffect(() => {
    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaStreamAudioSourceNode;
    let animationId: number;

    if (isPlaying) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 256;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            // Update the REF, not state. Does not trigger re-renders.
            micVolumeRef.current = sum / dataArray.length; 
            animationId = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        })
        .catch((err) => console.error("Mic access denied:", err));
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [isPlaying]);

  // EFFECT 2: SCORING ENGINE (Reads from Ref)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let clearFeedback: NodeJS.Timeout;
    let introDelay: NodeJS.Timeout;

    if (isPlaying) {
      // Wait 12 seconds for the instrumental intro to finish
      introDelay = setTimeout(() => {
        interval = setInterval(() => {
          // Check the ref current value silently
          if (micVolumeRef.current > 10) {
            const accuracy = Math.random();
            if (accuracy > 0.7) {
              setScore(s => s + 100);
              setCombo(c => c + 1);
              setFeedback("PERFECT!");
            } else if (accuracy > 0.4) {
              setScore(s => s + 50);
              setCombo(0);
              setFeedback("GOOD!");
            } else {
              setCombo(0);
              setFeedback("MISS");
            }
            clearTimeout(clearFeedback);
            clearFeedback = setTimeout(() => setFeedback(""), 800);
          } else {
            // Silence detected
            setFeedback("");
          }
        }, 2000); // Check every 2 seconds
      }, 12000); // 12-second delay
    }
    return () => {
      clearInterval(interval);
      clearTimeout(clearFeedback);
      clearTimeout(introDelay);
    };
  }, [isPlaying]); // Removed micVolume dependency to fix the loop

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 w-fit" 
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
          </Button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-md">Asa Branca (Ao Vivo)</h1>
            <p className="text-sm text-gray-300">Luiz Gonzaga</p>
          </div>
        </div>

        {/* SCORE HUD */}
        {isPlaying && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-top-5 pointer-events-none">
            <div className="bg-black/80 border border-cyan-500/50 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Pontuação</span>
                <span className="text-3xl font-black text-white font-mono leading-none">{score.toLocaleString()}</span>
              </div>
            </div>
            
            {combo > 1 && (
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
                <Flame className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white tracking-widest">{combo}x COMBO</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FEEDBACK HUD */}
      {feedback && isPlaying && (
        <div className="absolute top-36 right-10 z-50 pointer-events-none animate-in slide-in-from-right-5 fade-in duration-200">
          <span className={`text-4xl md:text-5xl font-black italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]
            ${feedback === "PERFECT!" ? "text-cyan-400" : feedback === "GOOD!" ? "text-yellow-400" : "text-red-500"}
          `}>
            {feedback}
          </span>
        </div>
      )}

      {/* START SCREEN OVERLAY */}
      {!isPlaying && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse border border-cyan-500/50">
            <Mic className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-8 tracking-wider">Pronto para o palco?</h2>
          <Button 
            onClick={() => setIsPlaying(true)} 
            className="text-2xl px-12 py-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-transform hover:scale-105"
          >
            <Play className="mr-2 fill-black w-8 h-8" /> INICIAR SHOW
          </Button>
        </div>
      )}

      {/* YOUTUBE IFRAME */}
      <div className="absolute inset-0 z-10 pt-20 pb-20 bg-black flex items-center justify-center pointer-events-none">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/HO8AZPOrJqQ?autoplay=${isPlaying ? 1 : 0}&start=5&controls=0&modestbranding=1&rel=0`} 
          title="Karaoke Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full max-w-6xl h-full object-contain"
        ></iframe>
      </div>

      {/* BOTTOM MIC STATUS */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-gray-900/90 px-8 py-3 rounded-full border border-gray-700 backdrop-blur-md shadow-lg">
          <Mic className={`w-5 h-5 ${isPlaying ? "text-green-500 animate-pulse" : "text-gray-500"}`} />
          <span className="text-sm font-mono tracking-widest text-gray-300">
            {isPlaying ? "ANÁLISE NEURAL DE VOZ ATIVA..." : "AGUARDANDO MICROFONE..."}
          </span>
        </div>
      </div>
    </div>
  );
}