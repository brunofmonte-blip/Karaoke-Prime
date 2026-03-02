import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Search, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { searchYouTube } from '@/services/youtubeService';
import { toast } from 'sonner';

const Duel = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const items = await searchYouTube(searchTerm + ' karaoke');
      setResults(items || []);
    } catch (error) {
      toast.error("Erro na busca do YouTube.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch("popular");
  }, [performSearch]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-4 rounded-2xl bg-destructive/20 border-2 border-destructive mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Sword className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Duel <span className="text-destructive neon-red-glow">Arena</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">Busque uma música e desafie a IA</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input 
            placeholder="Buscar música para o duelo..." 
            className="pl-12 h-16 text-lg rounded-2xl bg-card/50 border-destructive/30 focus:border-destructive transition-all text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
          />
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-destructive animate-spin" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((song) => {
            const videoId = song.id?.videoId;
            if (!videoId) return null;
            
            return (
              <Card key={videoId} className="group overflow-hidden border-2 border-white/5 bg-card/30 hover:border-destructive/50 transition-all duration-500 rounded-2xl flex flex-col">
                <div 
                  className="h-40 bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url(${song.snippet?.thumbnails?.high?.url || song.snippet?.thumbnails?.default?.url})` }}
                  onClick={() => navigate('/duel-room?id=' + videoId)}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <PlayCircle className="h-12 w-12 text-destructive" />
                  </div>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-1" dangerouslySetInnerHTML={{ __html: song.snippet?.title || "Música" }} />
                    <p className="text-xs text-gray-500 mb-4">{song.snippet?.channelTitle || "YouTube"}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/duel-room?id=' + videoId)}
                    className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl shadow-lg shadow-destructive/20 cursor-pointer"
                  >
                    <Sword className="h-4 w-4 mr-2" />
                    DUELAR AGORA
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Duel;