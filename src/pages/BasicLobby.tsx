import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, RotateCcw, Ban, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);

  // 🔴 ADICIONE SUA CHAVE API AQUI
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items) setResults(data.items);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closePerformance = () => {
    setSelectedVideo(null);
    setShowScore(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      
      {/* 1. LOBBY PRINCIPAL (Só renderiza se não houver vídeo selecionado) */}
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 text-center animate-in fade-in duration-700">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase text-[10px] mx-auto transition-colors"
          >
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          
          <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-10 italic uppercase tracking-tighter">
            Lobby de Karaokê
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* ONLINE */}
            <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                Cante com o catálogo completo do YouTube<br/>em tempo real.
              </p>
            </div>

            {/* OFFLINE */}
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center relative cursor-not-allowed">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <Download className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic">OFFLINE</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-medium">
                Músicas baixadas para cantar<br/>sem internet (Premium).
              </p>
            </div>

            {/* DUETO */}
            <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 transition-all flex flex-col items-center shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">
                Convide um amigo ou desafie cantores<br/>ao redor do mundo.
              </p>
            </div>
          </div>

          {/* BARRA DE BUSCA */}
          <div className="max-w-4xl mx-auto relative mb-16 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Qual música vamos cantar hoje? (Pressione Enter)" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={handleSearch} 
              className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold shadow-2xl" 
            />
          </div>

          {/* RESULTADOS */}
          {results.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom-5 duration-700">
              {results.map((video) => (
                <div 
                  key={video.id.videoId} 
                  onClick={() => setSelectedVideo(video.id.videoId)} 
                  className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 cursor-pointer group hover:border-primary/50 transition-all shadow-xl"
                >
                  <div className="relative w-56 h-32 overflow-hidden rounded-2xl">
                    <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="thumb" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="text-primary h-14 w-14" />
                    </div>
                  </div>
                  <div className="flex-1 text-left truncate">
                    <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate">🎤 {video.snippet.title}</h4>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SAL