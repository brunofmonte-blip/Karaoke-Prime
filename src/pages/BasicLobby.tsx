import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, Camera, Ban } from 'lucide-react';
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

  // Limpeza absoluta de hardware ao sair ou desmontar
  const handleForceExit = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setSelectedVideo(null);
  };

  useEffect(() => {
    return () => handleForceExit();
  }, []);

  const handleSearch = async (e: any) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      try {
        const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query + " karaoke")}&type=video&key=SUA_CHAVE_AQUI`);
        const data = await resp.json();
        setResults(data.items || []);
      } catch (err) { console.error("Erro na busca"); }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setCameraActive(true);
      
      // Delay necessário para o Electron processar o stream no PC
      setTimeout(() => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.play();
        }
      }, 500);
    } catch (e) { alert("Hardware ocupado ou sem permissão."); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans flex flex-col items-center">
      {!selectedVideo ? (
        <div className="w-full max-w-4xl pt-10 text-center animate-in fade-in duration-500">
          <button onClick={() => navigate('/')} className="mb-10 flex items-center gap-2 text-zinc-500 hover:text-white uppercase text-[10px] mx-auto transition-colors">
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          
          <h1 className="text-5xl font-black text-primary italic mb-12 tracking-tighter shadow-sm">LOBBY DE KARAOKÊ</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-8 rounded-[2rem] border border-primary/40 bg-zinc-900/50 flex flex-col items-center shadow-md">
              <Globe className="mb-3 text-primary" size={32} />
              <span className="font-black italic uppercase">Online</span>
            </div>
            <div className="p-8 rounded-[2rem] border border-white/5 bg-zinc-900/50 opacity-20 flex flex-col items-center">
              <Download className="mb-3 text-zinc-500" size={32} />
              <span className="font-black italic uppercase">Offline</span>
            </div>
            <div onClick={() => navigate('/duel')} className="p-8 rounded-[2rem] border border-white/10 bg-zinc-900/50 cursor-pointer hover:bg-white/5 flex flex-col items-center transition-all shadow-md">
              <Users className="mb-3 text-white" size={32} />
              <span className="font-black italic uppercase text-white">Duelo</span>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <Input 
              placeholder="Pesquisar hit..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={handleSearch} 
              className="h-16 pl-12 bg-zinc-900 border-zinc-800 rounded-2xl focus:border-primary text-white"
            />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto pb-20">
            {results.map((v) => (
              <div key={v.id.videoId} onClick={() => setSelectedVideo(v.id.videoId)} className="p-4 bg-zinc-900 rounded-xl flex items-center gap-6 cursor-pointer hover:bg-zinc-800 border border-transparent hover:border-primary transition-all">
                <img src={v.snippet.thumbnails.default.url} className="w-24 rounded-lg" alt="thumb" />
                <span className="font-bold text-left">{v.snippet.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black flex flex-col lg:flex-row items-center justify-center p-8 gap-12 z-[100] animate-in zoom-in duration-300">
          <div className="flex-1 w-full aspect-video bg-zinc-950 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1`} 
              frameBorder="0" 
              allow="autoplay; encrypted-media" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="flex flex-col items-center gap-10">
            <div className="w-72 h-72 rounded-full border-2 border-primary bg-zinc-900 overflow-hidden relative shadow-[0_0_40px_rgba(0,168,225,0.2)]">
              {!cameraActive ? (
                <button onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-black hover:bg-zinc-800 transition-colors">
                  <Camera className="text-primary mb-2" size={32} /> ATIVAR CÂMERA
                </button>
              ) : (
                <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
            </div>
            
            <Button onClick={handleForceExit} className="bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive hover:text-white font-black uppercase text-xs flex items-center gap-2 px-8 py-4 rounded-full transition-all">
              <Ban size={16} /> Cancelar e Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;