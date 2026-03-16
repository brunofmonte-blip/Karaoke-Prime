import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, Mail, Lock, User, ArrowRight, Sparkles, Trophy, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // Começa na tela de Cadastro
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Lógica de Login
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/academy'); // Vai direto pra Academy após logar
      } else {
        // Lógica de Cadastro
        if (!name.trim()) throw new Error('Por favor, insira seu nome completo.');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Atualiza o perfil com o nome do usuário
        await updateProfile(userCredential.user, { displayName: name });
        navigate('/academy'); // Vai direto pra Academy após cadastrar
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está cadastrado.');
      else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
      else if (err.code === 'auth/invalid-credential') setError('E-mail ou senha incorretos.');
      else setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/academy');
    } catch (err: any) {
      console.error(err);
      setError('Erro ao fazer login com o Google.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex font-sans text-white overflow-hidden relative">
      
      {/* BACKGROUND DA TELA DIVIDIDA */}
      <div className="absolute inset-0 lg:w-1/2 hidden lg:block z-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440502-3827419814b6?auto=format&fit=crop&q=80" 
          alt="Singer on stage" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black" />
      </div>

      <div className="w-full flex z-10">
        
        {/* LADO ESQUERDO: COPY E PERSUASÃO (Aparece apenas em telas maiores) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 xl:p-24">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Mic2 size={32} />
            </div>
            <h1 className="text-5xl xl:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none">
              KARAOKE <span className="text-cyan-400">PRIME</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-md">
              A maior arena vocal do mundo. Transforme sua paixão em performance com o poder da Inteligência Artificial.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-widest">Avaliação Vocal por IA</h3>
                <p className="text-sm text-gray-500 font-medium">Cante e receba gráficos em tempo real de afinação, sustentação e precisão.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <PlayCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-widest">Treinamento Masterclass</h3>
                <p className="text-sm text-gray-500 font-medium">Acesso imediato à Academy com exercícios práticos usados pelos maiores vocalistas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-widest">Ranking Global</h3>
                <p className="text-sm text-gray-500 font-medium">Batalhe por pontuações, suba de nível e construa sua legião de fãs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-black/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
          {/* Fundo móvel para telas pequenas */}
          <div className="absolute inset-0 lg:hidden z-0">
            <img 
              src="https://images.unsplash.com/photo-1516280440502-3827419814b6?auto=format&fit=crop&q=80" 
              alt="Background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/80" />
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
                {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta VIP'}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {isLogin ? 'Faça login para continuar sua jornada.' : 'O palco está pronto para você.'}
              </p>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              
              {/* Botão do Google */}
              <Button 
                onClick={handleGoogleAuth}
                variant="outline" 
                className="w-full h-14 rounded-xl border-white/20 bg-white hover:bg-gray-200 text-black font-black uppercase text-xs tracking-widest mb-6 flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar com Google
              </Button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">OU USE SEU E-MAIL</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest p-3 rounded-lg mb-6 text-center">
                  {error}
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input 
                      required
                      type="text" 
                      placeholder="Nome Completo" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-14 bg-black border-white/10 pl-12 text-white focus-visible:ring-cyan-400 focus-visible:border-cyan-400 rounded-xl"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input 
                    required
                    type="email" 
                    placeholder="Seu melhor e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-black border-white/10 pl-12 text-white focus-visible:ring-cyan-400 focus-visible:border-cyan-400 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input 
                    required
                    type="password" 
                    placeholder="Sua senha secreta" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-black border-white/10 pl-12 text-white focus-visible:ring-cyan-400 focus-visible:border-cyan-400 rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase text-sm tracking-widest mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                  {loading ? 'Processando...' : isLogin ? 'Acessar Arena' : 'Garantir Meu Acesso'} 
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {isLogin ? "Ainda não tem conta? " : "Já faz parte da Arena? "}
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                    className="text-cyan-400 font-black uppercase tracking-widest hover:underline"
                  >
                    {isLogin ? "Cadastre-se" : "Faça Login"}
                  </button>
                </p>
              </div>

            </div>
            
            <button onClick={() => navigate('/')} className="w-full mt-6 text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
              Voltar para a Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}