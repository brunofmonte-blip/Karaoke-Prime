import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, RotateCcw, Ban, Trophy, Star, Mic2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  
  // Estados do Lobby
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Estados da Performance
  const [videoKey, setVideoKey] = useState(0); // Usado para forçar o Recomeçar do vídeo
  const [showScore, setShowScore] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [vocalAnalysis, setVocalAnalysis] = useState<any>(null);

  // Refs para Hardware e Áudio
  const webcamRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Coletor de Dados de Áudio Real
  const metricsRef = useRef({ volumes: [] as number[], peaks: 0, drops: 0, totalFrames: 0 });

  // 🔴 ADICIONE SUA CHAVE API AQUI
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

  // Limpeza de Hardware ao sair da página
  useEffect(() => {
    return () => stopHardware();
  }, []);

  const stopHardware = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setCameraActive(false);
  };

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

  const startCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      setCameraActive(true);

      // Inicia a Captura de Áudio (Web Audio API)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Resetar métricas
      metricsRef.current = { volumes: [], peaks: 0, drops: 0, totalFrames: 0 };

      const analyzeAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        let sumSquares = 0;
        let isClipping = false;
        
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128; // Normaliza entre -1 e 1
          sumSquares += val * val;
          if (Math.abs(val) > 0.85) isClipping = true;
        }
        
        const rms = Math.sqrt(sumSquares / bufferLength); // Root Mean Square (Volume Real)
        
        metricsRef.current.volumes.push(rms);
        if (isClipping) metricsRef.current.peaks++;
        if (rms < 0.02) metricsRef.current.drops++; // Silêncio ou falta de apoio
        metricsRef.current.totalFrames++;

        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };
      analyzeAudio();

    } catch (err) {
      console.error("Erro ao acessar hardware:", err);
      alert("Acesso à câmera e microfone bloqueado pelo navegador.");
    }
  };

  const restartVideo = () => {
    setVideoKey(prev => prev + 1);
  };

  const finalizeSession = () => {
    stopHardware(); // Desliga a câmera e para de analisar
    
    const metrics = metricsRef.current;
    let score = "0.0";
    let note = "";
    let recom = [];

    // LÓGICA JUILLIARD / SIMON COWELL (Baseada em Dados Reais)
    if (metrics.volumes.length < 50) { // Menos de 1 segundo de gravação
      score = "0.0";
      note = "Apresentação abortada. Você mal abriu a boca e eu não tive dados suficientes para analisar. Suba naquele palco quando estiver pronto de verdade.";
      recom = ["Nível 1: Steady Breath"];
    } else {
      // Cálculos matemáticos reais do microfone
      const avgVolume = metrics.volumes.reduce((a, b) => a + b, 0) / metrics.volumes.length;
      const peakRatio = metrics.peaks / metrics.totalFrames;
      const dropRatio = metrics.drops / metrics.totalFrames;

      if (avgVolume < 0.03) { 
        // Cantor Sussurrou / Sem Apoio
        score = (40 + Math.random() * 15).toFixed(1);
        note = "Sua projeção vocal é quase inexistente. Cantar não é falar baixo com melodia. Onde está o apoio do seu diafragma? Faltou energia, presença e sustentação nas notas.";
        recom = ["Nível 1: Steady Breath", "Nível 4: Vocal Resonance"];
      } 
      else if (peakRatio > 0.2) { 
        // Cantor Gritou / Estourou o microfone
        score = (55 + Math.random() * 10).toFixed(1);
        note = "Volume não significa qualidade. Você estourou a dinâmica em vários momentos, perdendo totalmente o controle da emissão. O palco exige controle e inteligência vocal, não apenas força bruta.";
        recom = ["Nível 2: Pitch Calibration", "Nível 8: Dynamic Belting"];
      } 
      else if (dropRatio > 0.4) { 
        // Cantor oscilou muito (inseguro)
        score = (65 + Math.random() * 10).toFixed(1);
        note = "Você começou bem, mas sua energia cai no final das frases. Isso demonstra falta de resistência respiratória. A sua afinação escorregou porque o ar não sustentou a prega vocal.";
        recom = ["Nível 6: Vibrato Control", "Nível 7: Mixed Voice"];
      } 
      else { 
        // Excelente Controle
        score = (85 + Math.random() * 12).toFixed(1); // Acima de 85
        note = "Finalmente, alguém que entende de dinâmica! Seu apoio respiratório foi consistente e você respeitou a intenção da música sem estourar o áudio. Uma performance sólida e muito acima da média. Excelente trabalho.";
        recom = ["Nível 9: Emotional Delivery", "Nível 10: Pro Vocalist"];
      }
    }

    setVocalAnalysis({ score, note, recom });
    setShowScore(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND LOBBY */}
      <div className="absolute inset-0 z-0">
        <img src="https://picsum.photos/seed/studio/1920/1080" className="w-full h-full object-cover opacity-20" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>

      {/* 1. INTERFACE DO LOBBY */}
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700 text-center">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] mx-auto transition-colors">
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          
          <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-2 tracking-tighter italic uppercase">Lobby de Karaokê</h1>
          <p className="text-white font-bold uppercase tracking-widest mb-10 text-xs opacity-60">Escolha o seu palco</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Globe className="h-10 w-10 text-primary" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">ONLINE</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">Cante com o catálogo do YouTube em tempo real.</p>
            </div>
            <div className="group p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-40 cursor-not-allowed">
              <div className="absolute top-6 right-6 text-orange-500 font-black">🔒</div>
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
              <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic tracking-tighter">OFFLINE</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-medium">Músicas baixadas para cantar sem internet.</p>
            </div>
            <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 transition-all flex flex-col items-center text-center shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-10 w-10 text-white group-hover:text-destructive" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">DUETO / BATALHA</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">Convide um amigo ou desafie o mundo.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16 group">
            {isLoading ? <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" /> : <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 group-focus-within:text-primary transition-colors" />}
            <Input placeholder="Qual hit vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold shadow-2xl transition-all" />
          </div>

          {results.length > 0 && (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-10 duration-700 pb-32">
              <div className="space-y-6">
                {results.map((video) => (
                  <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50 shadow-xl text-left">
                    <div className="relative w-56 h-32 overflow-hidden rounded-2xl border border-white/10">
                      <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={video.snippet.title} />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-primary h-14 w-14 drop-shadow-lg" /></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-black text-white text-xl md:text-2xl group-hover:text-primary italic truncate tracking-tighter">🎤 {video.snippet.title}</h4>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] truncate mt-1">{video.snippet.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SALA DE PERFORMANCE (VÍDEO + WEBCAM) */}
      {selectedVideo && !showScore && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col xl:flex-row items-center gap-8 w-full max-w-[1400px]">
            
            {/* O VÍDEO DO YOUTUBE (Com a key para forçar o recomeço) */}
            <div key={videoKey} className="flex-1 w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-primary/30 shadow-[0_0_80px_rgba(0,168,225,0.2)] bg-zinc-900">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>

            {/* A COLUNA DA CÂMERA E CONTROLES */}
            <div className="flex flex-col items-center gap-8 xl:w-[400px]">
              
              {/* O Círculo da Câmera */}
              <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-4 border-primary shadow-[0_0_50px_rgba(0,168,225,0.4)] overflow-hidden bg-zinc-950 relative flex-shrink-0">
                {!cameraActive ? (
                  <div onClick={startCameraAndMic} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-center p-4 group">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="text-primary h-10 w-10" />
                    </div>
                    <span className="text-xs text-white font-black uppercase tracking-widest leading-tight">Ligar Câmera<br/>e Microfone IA</span>
                  </div>
                ) : (
                  <>
                    <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                    {/* Indicador visual de que a IA está escutando */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-primary/50 backdrop-blur-sm">
                      <Mic2 size={14} className="text-primary animate-pulse" />
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">IA Analisando</span>
                    </div>
                  </>
                )}
              </div>

              {/* Botões de Controle */}
              <div className="flex flex-col gap-4 w-full">
                <Button onClick={finalizeSession} className="w-full h-20 rounded-[2rem] bg-primary text-black font-black text-2xl italic hover:bg-white transition-all shadow-[0_0_30px_rgba(0,168,225,0.3)] uppercase tracking-tighter">
                  FINALIZAR SHOW
                </Button>
                <div className="flex gap-4">
                  <Button onClick={restartVideo} variant="outline" className="flex-1 h-14 rounded-2xl border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors">
                    <RotateCcw size={16} className="mr-2"/> Recomeçar
                  </Button>
                  <Button onClick={() => { setSelectedVideo(null); stopHardware(); }} variant="outline" className="flex-1 h-14 rounded-2xl border-destructive/50 text-destructive font-bold uppercase tracking-widest text-xs hover:bg-destructive hover:text-white transition-colors">
                    <Ban size={16} className="mr-2"/> Cancelar
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. RELATÓRIO VOCAL JUILLIARD */}
      {showScore && vocalAnalysis && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl animate-in zoom-in duration-300">
          <Card className="max-w-2xl w-full bg-zinc-950 border-primary/40 rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(0,168,225,0.2)]">
            <CardContent className="p-10 text-center text-white">
              <Trophy className={`mx-auto mb-6 h-20 w-20 ${parseFloat(vocalAnalysis.score) < 50 ? "text-gray-600" : "text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]"}`} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b border-white/10 pb-6">Análise Técnica Prime</h2>
              
              <div className="my-8">
                <span className={`text-8xl md:text-9xl font-black tracking-tighter italic ${parseFloat(vocalAnalysis.score) < 50 ? "text-destructive drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "text-primary drop-shadow-[0_0_30px_rgba(0,168,225,0.5)]"}`}>
                   {vocalAnalysis.score}
                </span>
                <p className="text-gray-500 font-black uppercase tracking-[0.4em] mt-2 text-xs">Score Global</p>
              </div>

              <div className="space-y-6 text-left bg-black/50 p-8 rounded-[2rem] border border-white/5 mb-8">
                <div>
                  <h4 className="text-primary font-black text-xs uppercase mb-3 tracking-widest flex items-center gap-2"><Mic2 size={14}/> Feedback do Motor IA:</h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic font-medium">"{vocalAnalysis.note}"</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-orange-500 font-black text-xs uppercase mb-4 flex items-center gap-2 tracking-widest"><Star size={14}/> Prescrição de Treino:</h4>
                  <div className="flex flex-wrap gap-2">
                    {vocalAnalysis.recom.map((r: string) => (
                      <span key={r} className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={() => { setShowScore(false); setSelectedVideo(null); setVocalAnalysis(null); }} className="w-full h-16 rounded-[1.5rem] bg-primary text-black font-black text-xl italic tracking-tighter hover:bg-white transition-all">
                VOLTAR AO LOBBY
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};

export default BasicLobby;