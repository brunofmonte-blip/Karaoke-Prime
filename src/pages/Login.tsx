import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles, Mic2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) {
      alert("⚠️ Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // 💡 A MÁGICA: Salvando o "Token" no navegador do usuário
      localStorage.setItem('@KaraokePrime:loggedIn', 'true');
      alert(isRegistering ? "✅ Cadastro realizado com sucesso! Bem-vindo ao Prime." : "✅ Login efetuado com sucesso!");
      
      // Forçamos o reload da página para o Header e a Academy lerem o novo Token
      window.location.href = '/academy'; 
    }, 1500);
  };

  const handleGoogle = () => {
    alert("Integração com Google Auth será ativada no Backend em breve!");
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4 font-sans overflow-hidden">
      <img src="https://picsum.photos/seed/loginbg/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80 z-0" />
      
      <button onClick={() => navigate(-1)} className="absolute top-24 left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs z-50 transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 mt-16">
        
        {/* Lado Esquerdo */}
        <div className="space-y-8 hidden md:block">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white mb-4">
            <Mic2 size={16} className="text-primary" /> <span className="font-black italic tracking-tighter">KARAOKE <span className="text-primary">PRIME</span></span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            Sua jornada para o <span className="text-orange-500 neon-gold-glow italic">Estrelato</span> começa aqui.
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
            Acesse o Academy, participe de audições mundiais e transforme sua voz com nossa IA proprietária.
          </p>
          <div className="flex gap-6 pt-6">
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex-1">
              <Sparkles className="text-primary h-8 w-8 mb-2" />
              <h4 className="font-black text-white text-sm">Vocal AI</h4>
              <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Diagnóstico em tempo real.</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex-1">
              <ShieldCheck className="text-green-500 h-8 w-8 mb-2" />
              <h4 className="font-black text-white text-sm">Segurança</h4>
              <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Dados criptografados.</p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <Card className="bg-zinc-950/80 backdrop-blur-xl border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-500 to-primary"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              {isRegistering ? 'Criar Conta' : 'Entrar na Conta'}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              {isRegistering ? 'Junte-se à elite vocal global.' : 'Bem-vindo de volta, artista!'}
            </p>
          </div>

          <Button type="button" onClick={handleGoogle} variant="outline" className="w-full h-14 rounded-2xl border-white/20 bg-white text-black hover:bg-gray-200 font-black mb-8 transition-colors flex items-center justify-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5 w-5" /> Continuar com Google
          </Button>

          <div className="flex items-center gap-4 mb-8 opacity-50">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-[10px] uppercase font-black tracking-widest text-white">ou use seu e-mail</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5 mb-10">
            {isRegistering && (
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nome de Artista</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: VocalQueen" className="h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary px-4" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary px-4" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary px-4" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-2xl bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all mt-4">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isRegistering ? 'CADASTRAR AGORA' : 'ENTRAR AGORA')}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 font-medium">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <span onClick={() => setIsRegistering(!isRegistering)} className="text-white font-bold cursor-pointer hover:text-primary transition-colors underline underline-offset-4">
              {isRegistering ? 'Faça Login' : 'Registre-se'}
            </span>
          </p>