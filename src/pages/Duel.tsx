// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Duel.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Swords, Users, Trophy, Star, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Duel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // 💡 MOCK DO BANCO DE DADOS: Lista de usuários para o MVP
  const onlineUsers = [
    { id: 1, name: "Maria Clara", username: "@mariaclara_oficial", level: 12, status: "Online", avatar: "https://i.pravatar.cc/150?u=maria" },
    { id: 2, name: "João Pedro (JP)", username: "@jpcantor", level: 8, status: "Em Batalha", avatar: "https://i.pravatar.cc/150?u=jp" },
    { id: 3, name: "Ana Beatriz", username: "@anab_vocal", level: 15, status: "Online", avatar: "https://i.pravatar.cc/150?u=ana" },
    { id: 4, name: "Lucas Fernandes", username: "@lucas_f", level: 5, status: "Online", avatar: "https://i.pravatar.cc/150?u=lucas" },
    { id: 5, name: "Sofia Silva", username: "@sofi_sings", level: 22, status: "Online", avatar: "https://i.pravatar.cc/150?u=sofia" }
  ];

  // Filtro de busca de usuários
  const filteredUsers = onlineUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChallenge = (user: any) => {
    alert(`Convite de batalha enviado para ${user.name}! Aguardando aceitação...`);
    // No futuro, isso vai conectar via WebSocket/Firebase e redirecionar para o Palco!
  };

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2000" alt="Arena Background" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Palco
        </button>

        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-xs mb-3 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <Swords size={14} /> Arena Global
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight mb-4">
            Batalhas & <span className="text-orange-500 neon-gold-glow">Duetos</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto md:mx-0">
            Busque por amigos ou desafie cantores online. Quem tem a melhor afinação leva o troféu da rodada.
          </p>
        </div>

        {/* BARRA DE BUSCA DE USUÁRIOS */}
        <div className="relative mb-12 max-w-2xl mx-auto md:mx-0">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-500" />
          </div>
          <Input 
            type="text" 
            placeholder="Buscar cantor por nome ou @username..." 
            className="w-full h-16 pl-16 pr-6 bg-zinc-900/80 backdrop-blur-xl border-white/10 focus:border-orange-500 text-white text-lg rounded-full shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE CANTORES */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-white font-black uppercase tracking-widest flex items-center gap-2 mb-6">
              <Users className="text-orange-500" /> Cantores Disponíveis
            </h2>
            
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card key={user.id} className="bg-zinc-950/80 backdrop-blur-xl border-white/5 hover:border-orange-500/30 transition-all duration-300 rounded-[2rem] p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-zinc-800 group-hover:border-orange-500 transition-colors" />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${user.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">{user.name}</h3>
                      <p className="text-gray-500 text-xs font-bold tracking-widest">{user.username}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-yellow-500 font-bold uppercase">Nível {user.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleChallenge(user)}
                    disabled={user.status !== 'Online'}
                    className={`h-12 px-6 rounded-full font-black uppercase tracking-widest text-xs transition-all ${user.status === 'Online' ? 'bg-orange-500 hover:bg-white text-black' : 'bg-zinc-800 text-gray-500'}`}
                  >
                    {user.status === 'Online' ? 'Desafiar' : 'Ocupado'}
                  </Button>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-zinc-950/50 rounded-[2rem] border border-white/5">
                <ShieldAlert className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhum cantor encontrado com "{searchTerm}".</p>
              </div>
            )}
          </div>

          {/* PAINEL LATERAL: SEU RANKING */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-orange-900/20 to-zinc-950 border-orange-500/30 rounded-[2rem] p-6 sticky top-28">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-orange-500 flex items-center justify-center mb-4 relative overflow-hidden">
                   {/* Aqui no futuro entrará a foto do usuário do Google */}
                   <img src="https://i.pravatar.cc/150?u=você" alt="Você" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">Seu Perfil</h3>
                <p className="text-orange-500 font-bold tracking-widest text-xs mb-6 uppercase">Iniciante</p>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/50 rounded-2xl p-4 border border-white/5">
                    <Trophy className="w-6 h-6 text-yellow-500 mb-2 mx-auto" />
                    <p className="text-2xl font-black text-white">0</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Vitórias</p>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-4 border border-white/5">
                    <Swords className="w-6 h-6 text-orange-500 mb-2 mx-auto" />
                    <p className="text-2xl font-black text-white">0</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Batalhas</p>
                  </div>
                </div>
                
                <Button className="w-full h-14 rounded-full bg-white hover:bg-orange-500 text-black font-black uppercase tracking-widest text-xs transition-all">
                  Ver Histórico Completo
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Duel;