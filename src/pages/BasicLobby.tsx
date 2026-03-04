import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, Camera, Ban, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BasicLobby = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // LIMPEZA ABSOLUTA AO SAIR
  const forceStop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setSelectedVideo(null);
  };

  useEffect(() => {
    return () => forceStop();
  }, []);

  const handleSearch = async (e: any) => {
    if (e.key === 'Enter') {
      const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${query + " karaoke"}&type=video&key=SUA_CHAVE_AQUI`);
      const data = await resp.json();
      setResults(data.items || []);
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      setCameraActive(true);
      setTimeout(() => {
        if (webcamRef.current) webcamRef.current.srcObject = s;
      }, 200);
    } catch (e) { alert("Erro de Hardware"); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {!selectedVideo ? (
        <div className="max-w-4xl mx-auto pt-10 text-center">
          <button onClick={() => navigate('/')} className="mb-4 flex items-center gap-2 text-zinc-500 hover:text-white uppercase text-xs">
            <ArrowLeft size={14} /> Home
          </button>
          <h1 className="text-5xl font-black text-primary italic mb-10">LOBBY KARAOKÊ</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="p-6 border border-primary/30 rounded-2xl bg-zinc-900/50 flex flex-col items-center">
              <Globe className="text-primary mb-2" />
              <span className="font-bold text-xs uppercase">Online</span>
            </div>
            <div className="p-6 border border-white/10 rounded-2xl opacity-30 flex flex-col items-center">
              <Download className="text-zinc-500 mb-2" />
              <span className="font-bold text-xs uppercase">Offline</span>
            </div>
            <div onClick={() => navigate('/duel')} className="p-6 border border-white/10 rounded-2xl bg-zinc-900/50 cursor-pointer flex flex-col items-center">
              <Users className="text-white mb-2" />
              <span className="font-bold text-xs uppercase">Duelo</span>
            </div>
          </div>

          <Input 
            placeholder="Qual música?" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={handleSearch} 
            className="h-16 bg-zinc-900 border-zinc-800 rounded-xl"
          />

          <div className="mt-8 space-y-4">
            {results.map((v) => (
              <div key={v.id.videoId} onClick={() => setSelectedVideo(v.id.videoId)} className="p-4 bg-zinc-900 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-zinc-800">
                <img src={v.snippet.thumbnails.default.url} className="w-24 rounded-lg" />
                <span className="font-bold text-left">{v.snippet.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4">
          <div className="flex gap-8 items-center">
            <div className="w-[640px] aspect-video bg-zinc-950 rounded-3xl overflow-hidden border border-white/10">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} frameBorder="0" allow="autoplay"></iframe>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-64 h-64 rounded-full bg-zinc-900 border-2 border-primary overflow-hidden relative">
                {!cameraActive ? (
                  <button onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold">
                    <Camera className="text-primary mb-1" /> ATIVAR CÂMERA
                  </button>
                ) : (
                  <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                )}
              </div>
              <Button onClick={forceStop} className="w-full bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive hover:text-white uppercase font-black">
                <Ban size={16} className="mr-2"/> Sair e Limpar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;