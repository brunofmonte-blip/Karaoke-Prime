import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚨 CORREÇÃO: Mic2 e GraduationCap adicionados na importação abaixo!
import { PlayCircle, TrendingUp, Music, Globe2, Trophy, Clock, Star, Flame, Hash, User, ChevronRight, Mic2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// ============================================================================
// DADOS SEMENTE (FAKE DATA PARA DAR VIDA AO MVP)
// ============================================================================

const regionalHits = {
  BR: [
    { title: "Evidências", artist: "Chitãozinho & Xororó", plays: "1.2M" },
    { title: "Na Sua Estante", artist: "Rita Lee", plays: "850K" },
    { title: "Deixa Acontecer", artist: "NX Zero", plays: "720K" }
  ],
  US: [
    { title: "Bohemian Rhapsody", artist: "Queen", plays: "3.4M" },
    { title: "Shallow", artist: "Lady Gaga", plays: "2.1M" },
    { title: "I Will Always Love You", artist: "Whitney Houston", plays: "1.9M" }
  ],
  UK: [
    { title: "Someone Like You", artist: "Adele", plays: "2.8M" },
    { title: "Wonderwall", artist: "Oasis", plays: "2.2M" },
    { title: "Don't Look Back In Anger", artist: "Oasis", plays: "1.5M" }
  ],
  JP: [
    { title: "Gurenge (Demon Slayer)", artist: "LiSA", plays: "4.1M" },
    { title: "Pretender", artist: "Official HIGE DANdism", plays: "2.9M" },
    { title: "Lemon", artist: "Kenshi Yonezu", plays: "2.5M" }
  ]
};

const fakeTrendActivity = [
  { user: "@VocalStar_BR", song: "Como Nossos Pais - Elis Regina", time: "Agora mesmo", score: "98%" },
  { user: "@John_Belt", song: "Listen - Beyoncé", time: "Há 2 min", score: "92%" },
  { user: "@Yumi_Tokyo", song: "First Love - Utada Hikaru", time: "Há 5 min", score: "99%" },
  { user: "@MariaClara_V", song: "Chandelier - Beyoncé", time: "Há 12 min", score: "95%" }
];

const recentlyAdded = [
  { title: "Flowers (Acoustic)", artist: "Miley Cyrus", badge: "NOVO" },
  { title: "Vampire", artist: "Olivia Rodrigo", badge: "ALTA QUALIDADE" },
  { title: "Kill Bill", artist: "SZA", badge: "POPULAR" },
  { title: "Erro Gostoso", artist: "Simone Mendes", badge: "NOVO" }
];

const fakeRanking = [
  { rank: 1, user: "Yumi_Tokyo", score: 15420, tier: "Diamante" },
  { rank: 2, user: "MariaClara_V", score: 14890, tier: "Platina" },
  { rank: 3, user: "John_Belt", score: 13200, tier: "Platina" },
  { rank: 4, user: "VocalStar_BR", score: 12500, tier: "Ouro" },
  // O USUÁRIO REAL AQUI
  { rank: 142, user: "Você", score: 1250, tier: "Iniciante", isCurrentUser: true } 
];

const trendTags = ["#BeltChallenge", "#SertanejoPrime", "#SopranoVibes", "#RockDrive", "#Acustico"];

export default function Index() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<'BR' | 'US' | 'UK' | 'JP'>('BR');

  return (
    <div className="min-h-screen bg-black font-sans text-white pb-24 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-black to-black z-10" />
          <img src="https://images.unsplash.com/photo-1516280440502-6c2438eabe2b?auto=format&fit=crop&q=80" alt="Stage" className="w-full h-full object-cover opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-6">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">O Palco Global está Aberto</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            Cante. Evolua. <br/><span className="text-cyan-400">Conquiste o Mundo.</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            A primeira plataforma com Inteligência Artificial Julliard-Standard. Treine na Academy, cante seus hits favoritos e suba no ranking global.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => navigate('/basic')} className="h-14 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 w-full sm:w-auto">
              <Mic2 className="mr-2 h-5 w-5" /> Cantar Agora
            </Button>
            <Button onClick={() => navigate('/academy')} variant="outline" className="h-14 px-8 rounded-full border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-sm w-full sm:w-auto transition-all">
              <GraduationCap className="mr-2 h-5 w-5" /> Entrar na Academy
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24 relative z-10">
        
        {/* GRID DE CONTEÚDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA (Músicas e Tags) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* SEÇÃO A: MÚSICAS MAIS CANTADAS (REGIONAL) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Globe2 className="text-cyan-400 h-6 w-6" />
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Hits Globais</h2>
                </div>
                <div className="flex gap-2 bg-zinc-900 p-1 rounded-full border border-white/5">
                  {(['BR', 'US', 'UK', 'JP'] as const).map(region => (
                    <button 
                      key={region}
                      onClick={() => setActiveRegion(region)}
                      className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${activeRegion === region ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {regionalHits[activeRegion].map((hit, idx) => (
                  <Card key={idx} onClick={() => navigate('/basic')} className="bg-zinc-950/80 border-white/10 p-5 rounded-[2rem] hover:border-cyan-500/50 transition-all cursor-pointer group hover:-translate-y-1">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500 transition-colors">
                      <Music className="h-4 w-4 text-cyan-400 group-hover:text-black" />
                    </div>
                    <h3 className="font-black italic uppercase leading-tight mb-1 text-white">{hit.title}</h3>
                    <p className="text-xs text-gray-500 font-bold mb-4">{hit.artist}</p>
                    <p className="text-[10px] text-cyan-400/70 font-black uppercase tracking-widest">{hit.plays} reproduções</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* SEÇÃO C: ADICIONADOS RECENTEMENTE */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-cyan-400 h-6 w-6" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Recentemente Adicionados</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentlyAdded.map((item, idx) => (
                  <div key={idx} onClick={() => navigate('/basic')} className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:bg-zinc-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center">
                        <PlayCircle className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white leading-tight">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.artist}</p>
                      </div>
                    </div>
                    <span className="text-[8px] bg-white/10 px-2 py-1 rounded text-gray-300 font-black uppercase tracking-widest">{item.badge}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEÇÃO D: TREND TAGS */}
            <section>
              <div className="flex flex-wrap gap-3">
                {trendTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-black border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 cursor-pointer transition-colors">
                    <Hash size={12} /> {tag}
                  </span>
                ))}
              </div>
            </section>

          </div>

          {/* COLUNA DIREITA (Atividade e Ranking) */}
          <div className="space-y-8">
            
            {/* SEÇÃO B: TREND TOPICS / ATIVIDADE AO VIVO */}
            <Card className="bg-zinc-950 border-white/10 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black italic uppercase tracking-tighter text-lg text-white">Cantando Agora</h3>
              </div>
              <div className="space-y-4">
                {fakeTrendActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <User size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-cyan-400">{activity.user}</span>
                        <span className="text-[8px] text-gray-600 uppercase font-black">{activity.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-1 mb-1">Cantou <strong className="text-white">{activity.song}</strong></p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-orange-500" />
                        <span className="text-[10px] text-orange-500 font-black">{activity.score} Precisão</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* SEÇÃO E: RANKING GLOBAL (Semente) */}
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-cyan-500/20 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-cyan-400 h-5 w-5" />
                <h3 className="font-black italic uppercase tracking-tighter text-lg text-white">Top Prime</h3>
              </div>
              
              <div className="space-y-2">
                {fakeRanking.map((rank, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${rank.isCurrentUser ? 'bg-cyan-500/10 border-cyan-500/50 scale-105' : 'bg-black/50 border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm w-4 ${rank.rank <= 3 ? 'text-cyan-400' : 'text-gray-600'}`}>{rank.rank}</span>
                      <div>
                        <p className={`text-xs font-bold ${rank.isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>{rank.user}</p>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500">{rank.tier}</p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-white">{rank.score.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4 text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-cyan-400">
                Ver Ranking Completo <ChevronRight size={12} className="ml-1" />
              </Button>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}