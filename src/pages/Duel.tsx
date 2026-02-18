import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Play, Pause, RotateCcw, Camera, Users, Trophy, Swords, Music } from "lucide-react";

const Duel = () => {
  const navigate = useNavigate();
  
  // Config States
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [opponentName, setOpponentName] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("HO8AZPOrJqQ"); // Default: Asa Branca
  const [songTitle, setSongTitle] = useState("Asa Branca - Luiz Gonzaga");
  const [gameMode, setGameMode] = useState<'competitivo' | 'dueto'>('competitivo');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Arena States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const micVolumeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- MEDIA ENGINE (CAMERA & MIC) ---
  useEffect(() => {
    if (isConfiguring) return;

    let animationFrameId: number;
    const startMediaEngine = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: cameraEnabled 
        });
        streamRef.current = stream;
        if (cameraEnabled && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContextRef.current.createAnalyser();
        const microphone = audioContextRef.current.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          micVolumeRef.current = average;
          animationFrameId = requestAnimationFrame(checkVolume);
        };
        checkVolume();
        setIsPlaying(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setFeedback("Erro: Microfone/Câmera bloqueados!");
      }
    };
    
    startMediaEngine();
    
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isConfiguring, cameraEnabled]);

  // --- GAME LOGIC ENGINES ---
  useEffect(() => {
    if (isConfiguring || !isPlaying || isPaused || isFinished) return;
    let scoreInterval: NodeJS.Timeout;
    let aiInterval: NodeJS.Timeout;

    const startDelay = setTimeout(() => {
        scoreInterval = setInterval(() => {
            if (micVolumeRef.current > 2) {
                const points = Math.floor(micVolumeRef.current * 3) + Math.floor(Math.random() * 50);
                setUserScore(prev => prev + points);
                
                const goodFeedbacks = ["Boa!", "Isso aí!", "No tom!", "Excelente!", "Segura a nota!"];
                setFeedback(goodFeedbacks[Math.floor(Math.random() * goodFeedbacks.length)]);
            } else {
                const missFeedbacks = ["Quase!", "Atenção à nota!", "Respira fundo!", "Concentra!", "Vamos lá!"];
                setFeedback(missFeedbacks[Math.floor(Math.random() * missFeedbacks.length)]);
            }
            setTimeout(() => setFeedback(""), 1500);
        }, 2000);
        
        aiInterval = setInterval(() => {
            setAiScore(prev => prev + Math.floor(Math.random() * 50) + 70);
        }, 2000);
    }, 15000);
    
    return () => {
        clearTimeout(startDelay);
        if (scoreInterval) clearInterval(scoreInterval);
        if (aiInterval) clearInterval(aiInterval);
    };
  }, [isConfiguring, isPlaying, isPaused, isFinished]);

  const handleStartStage = () => {
    if (!opponentName) {
      setFeedback("Defina o nome do oponente!");
      setTimeout(() => setFeedback(""), 2000);
      return;
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsConfiguring(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
  };
  
  const handleResume = () => {
    setIsPaused(false);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
  };

  const getDuetFeedbackMessage = (score: number) => {
    if (score <= 500) return "Ei Dupla, o que aconteceu? O microfone estava desligado ou foi desespero mesmo? Tem que melhorar muito!";
    if (score <= 1000) return "Olha... a amizade de vocês é linda, mas a afinação tirou férias. Bora treinar na Academy urgentemente!";
    if (score <= 2000) return "Pelo menos vocês têm atitude! Faltou só acertar o tom, a letra e o ritmo. Que tal mais um ensaio antes da turnê?";
    if (score <= 3000) return "Foi... uma experiência artística diferente! Os vizinhos devem estar confusos, mas a gente aplaude a coragem.";
    if (score <= 4000) return "Já dá para cantar no chuveiro em dupla! Estão no caminho, mas o palco principal ainda precisa esperar um pouquinho.";
    if (score <= 5000) return "Ok, ok, estamos aquecendo! Algumas notas fugiram, mas a sintonia de vocês está começando a aparecer.";
    if (score <= 6000) return "Nada mal! Vocês não vão passar fome fazendo serenata, mas ainda não dá pra largar o emprego atual.";
    if (score <= 7000) return "Aí sim! Já podem se inscrever no show de talentos do bairro. Estão pegando o jeito da coisa!";
    if (score <= 8000) return "Bela performance! Se ensaiarem só mais um pouquinho, já podem começar a cobrar ingresso pros amigos.";
    if (score <= 9000) return "Que dupla! Entregaram carisma, afinação e show! O produtor musical do app já tá de olho em vocês.";
    if (score <= 10000) return "Uau! Vocês têm certeza de que não formam uma dupla famosa disfarçada usando nosso app?";
    if (score <= 11000) return "Espetáculo! A plateia virtual está de pé aplaudindo. Química perfeita e vozes incríveis!";
    if (score <= 12000) return "Alô, gravadoras? Temos um fenômeno aqui! Vocês nasceram para cantar juntos. Que show absoluto!";
    if (score <= 14999) return "Lendários! Vocês quebraram o termômetro do talento. Chitãozinho e Xororó que se cuidem!";
    return "Dupla, sensacional! Vocês estão prontos para o sucesso mundial! O Grammy já é de vocês!";
  };

  if (isFinished) {
    if (gameMode === 'dueto') {
      return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-transparent">
            <img 
                src="https://images.unsplash.com/photo-1516450360452-631a4530d335?q=80&w=2000&auto=format&fit=crop" 
                alt="Show da Dupla" 
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
            />
            <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-sm"></div>
            <div className="relative z-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 px-4">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 italic tracking-widest uppercase drop-shadow-2xl">
                    SHOW DA DUPLA!
                </h1>
                <div className="bg-black/50 border border-purple-500/30 p-10 rounded-3xl backdrop-blur-md mb-8 max-w-2xl w-full shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                    <p className="text-gray-300 text-lg md:text-xl mb-6 font-medium tracking-wide">
                      {getDuetFeedbackMessage(userScore + aiScore)}
                    </p>
                    <h3 className="text-gray-500 tracking-widest text-sm mb-2 uppercase font-bold">Pontuação Total</h3>
                    <p className="text-6xl md:text-8xl font-black text-white drop-shadow-lg">{userScore + aiScore}</p>
                </div>
                <div className="flex gap-4">
                    <Button className="px-8 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-lg transition-transform hover:scale-105" onClick={() => navigate("/academy")}>Ir para a Academy</Button>
                    <Button variant="outline" className="px-8 py-6 bg-transparent border-gray-600 text-white hover:bg-white/10 font-bold rounded-xl text-lg transition-transform hover:scale-105" onClick={() => { setFeedback(""); setIsFinished(false); setIsConfiguring(true); setUserScore(0); setAiScore(0); }}>VOLTAR AO PALCO</Button>
                </div>
            </div>
        </div>
      );
    }
    
    const isVictory = userScore > aiScore;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-sans">
            <img src={isVictory ? "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop" : "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2000&auto=format&fit=crop"} alt="Result Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" />
            <div className={`absolute inset-0 z-10 backdrop-blur-sm ${isVictory ? 'bg-blue-900/60' : 'bg-red-900/60'}`}></div>
            <div className="relative z-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 px-4">
                <h1 className={`text-5xl md:text-7xl font-black text-transparent bg-clip-text mb-8 italic tracking-widest uppercase drop-shadow-2xl ${isVictory ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
                    {isVictory ? "PARABÉNS PELO SHOW!" : "HOJE O SHOW NÃO FOI BOM!!!"}
                </h1>
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="bg-black/50 border border-cyan-500/30 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <h3 className="text-cyan-400 tracking-widest text-sm mb-2 uppercase font-bold">Sua Pontuação</h3>
                        <p className="text-5xl md:text-6xl font-black text-white">{userScore}</p>
                    </div>
                    <div className="flex items-center justify-center"><span className="text-4xl font-black text-white italic opacity-50">VS</span></div>
                    <div className="bg-black/50 border border-purple-500/30 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                        <h3 className="text-purple-400 tracking-widest text-sm mb-2 uppercase font-bold">Pontuação {opponentName || 'Oponente'}</h3>
                        <p className="text-5xl md:text-6xl font-black text-white">{aiScore}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button className={`px-8 py-6 text-black font-bold rounded-xl text-lg transition-transform hover:scale-105 ${isVictory ? 'bg-cyan-500 hover:bg-cyan-400' : 'bg-red-500 hover:bg-red-400'}`} onClick={() => navigate("/academy")}>{isVictory ? 'Continuar Evoluindo' : 'Treinar na Academy'}</Button>
                    <Button variant="outline" className="px-8 py-6 bg-transparent border-gray-600 text-white hover:bg-white/10 font-bold rounded-xl text-lg transition-transform hover:scale-105" onClick={() => { setFeedback(""); setIsFinished(false); setIsConfiguring(true); setUserScore(0); setAiScore(0); }}>Tentar Novamente</Button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-40 p-4 md:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex flex-col items-start pointer-events-auto mt-16 md:mt-24 ml-2 md:ml-4">
                <div className="flex items-center gap-3 mb-2 bg-black/40 backdrop-blur-md p-2 pr-4 rounded-full border border-cyan-500/30">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <Mic className="text-black w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold uppercase tracking-wider text-sm md:text-base">Você</h2>
                        <div className="flex items-center gap-1">
                            <span className="text-cyan-400 text-xs font-bold animate-pulse">AO VIVO</span>
                        </div>
                    </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] tabular-nums animate-in slide-in-from-left">{userScore}</p>
                {feedback && <p className={`text-sm md:text-base font-bold mt-2 animate-bounce ${feedback.includes('!') && !feedback.includes('Quase') ? 'text-green-400' : 'text-yellow-400'}`}>{feedback}</p>}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col items-center">
                {gameMode === 'competitivo' ? (
                    <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse tracking-tighter">VS</h1>
                ) : (
                    <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                         <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">DUETO</h1>
                    </div>
                )}
               
                <div className="flex gap-2 mt-4 pointer-events-auto">
                     <Button variant="outline" size="sm" className="bg-black/40 backdrop-blur-md border-gray-600 text-white hover:bg-white/10" onClick={handlePause} disabled={isPaused}>
                        <Pause className="w-4 h-4 mr-1" /> Pausar
                    </Button>
                    <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]" onClick={() => setIsFinished(true)}>
                        Finalizar o Show
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end pointer-events-auto mt-16 md:mt-24 mr-2 md:mr-4">
                 <div className="flex items-center gap-3 mb-2 bg-black/40 backdrop-blur-md p-2 pl-4 rounded-full border border-purple-500/30 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <Users className="text-white w-5 h-5" />
                    </div>
                    <div className="text-right">
                        <h2 className="text-white font-bold uppercase tracking-wider text-sm md:text-base">{opponentName || 'Oponente IA'}</h2>
                        <span className="text-purple-400 text-xs font-bold">BOSS</span>
                    </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] tabular-nums animate-in slide-in-from-right text-right">{aiScore}</p>
            </div>
        </header>
        {isPaused && (
            <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 duration-200">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-widest drop-shadow-lg uppercase">Show Pausado</h2>
              <div className="flex gap-6 mt-8">
                <Button onClick={handleResume} className="px-8 py-10 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 flex flex-col items-center gap-3 h-auto">
                  <Play className="w-8 h-8 fill-black" /> <span className="text-lg tracking-wider">CONTINUAR</span>
                </Button>
                <Button onClick={() => { setFeedback(""); setIsPaused(false); setIsConfiguring(true); setUserScore(0); setAiScore(0); }} className="px-8 py-10 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-3xl border border-gray-700 shadow-xl transition-transform hover:scale-105 flex flex-col items-center gap-3 h-auto">
                  <RotateCcw className="w-8 h-8 text-gray-300" /> <span className="text-lg tracking-wider text-gray-300">REINICIAR</span>
                </Button>
              </div>
            </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center z-10 pt-24 pb-24 md:pt-32 md:pb-10 pointer-events-none">
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.7)] border border-white/10 relative bg-black">
                 <iframe 
                    ref={iframeRef}
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0`}
                    title="Karaoke Duel Video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    className="w-full h-full object-cover pointer-events-auto"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none"></div>
            </div>
        </div>
         {cameraEnabled && (
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-cyan-500 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.6)] z-30 bg-black animate-in zoom-in">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            </div>
         )}
        {/* OPPONENT VISUAL (Center Right) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-purple-500 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.6)] z-40 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-500">
            {/* Purple Overlay */}
            <div className="absolute inset-0 bg-purple-900/40 z-10"></div>
            
            {/* Avatar Icon */}
            <Users className="w-16 h-16 md:w-20 md:h-20 text-purple-300 z-20 opacity-90" />
            
            {/* AI Audio Equalizer Effect */}
            <div className="absolute bottom-4 left-0 right-0 h-1/3 flex items-end justify-center gap-[2px] md:gap-1 px-4 z-20 opacity-80">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-2 md:w-3 bg-purple-400 animate-pulse" 
                        style={{ 
                            height: `${Math.random() * 100}%`, 
                            animationDelay: `${i * 0.15}s`, 
                            animationDuration: '0.6s' 
                        }}>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Duel;