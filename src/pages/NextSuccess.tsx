import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function Backstage() {
const navigate = useNavigate();

return (
<div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden pt-16 font-sans text-white">
<img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80" alt="Backstage bg" className="absolute inset-0 w-full h-full object-cover opacity-20" />
<div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

  <div className="z-10 text-center flex flex-col items-center">
    <div className="h-20 w-20 rounded-full border border-white/20 flex items-center justify-center mb-6 bg-black/50 backdrop-blur-sm">
      <LayoutDashboard className="h-10 w-10 text-gray-400" />
    </div>
    
    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-2">NEXT SUCCESS</h1>
    <p className="text-gray-300 font-medium text-lg mb-12">Dashboard premium bloqueado.</p>

    <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-3 text-sm font-bold">
      <ArrowLeft size={18} /> Voltar para o Início
    </button>
  </div>
</div>
);
}