// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Integração com o Firebase
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          level: 1,
          status: 'Online',
          createdAt: new Date()
        });
      } else {
        await setDoc(userRef, { status: 'Online' }, { merge: true });
      }

      // Após o login, manda de volta para o início
      navigate('/'); 
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Houve um erro ao tentar fazer login. Verifique as permissões do Firebase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* 🖼️ IMAGEM DE FUNDO: O Palco com Microfone */}
      <img 
        src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=2000&q=80" 
        alt="Stage Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale-[30%] z-0" 
      />
      
      {/* Gradiente escuro para dar leitura */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />

      {/* Botão de Voltar para navegação amigável */}
      <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest z-30">
        <ArrowLeft size={16} /> Voltar
      </button>
      
      {/* 🔮 O CARD CENTRAL (Estilo Premium igual ao da Academy) */}
      <div className="z-20 w-full max-w-md bg-zinc-950/90 backdrop-blur-xl border-[2px] border-primary/50 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_60px_rgba(0,168,225,0.2)] animate-in zoom-in-95 duration-500">
        
        <div className="w-24 h-24 rounded-full border-[3px] border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,168,225,0.2)] bg-primary/5">
          <Mic2 className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
          Karaoke <span className="text-primary drop-shadow-[0_0_10px_rgba(0,168,225,0.8)]">Prime</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
          A maior arena vocal do mundo
        </p>

        {/* 🔘 BOTÕES DE LOGIN PADRONIZADOS */}
        <div className="w-full flex flex-col gap-4">
          
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full h-14 rounded-full bg-zinc-900 border border-white/10 hover:border-primary text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,168,225,0.1)] hover:shadow-[0_0_25px_rgba(0,168,225,0.4)]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                Entrar com o Google
              </>
            )}
          </Button>

          <Button 
            onClick={() => alert("Login com Facebook em desenvolvimento")} 
            className="w-full h-14 rounded-full bg-zinc-900 border border-white/10 hover:border-primary text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_25px_rgba(0,168,225,0.4)]"
          >
            <img src="https://authjs.dev/img/providers/facebook.svg" alt="Facebook" className="w-5 h-5" />
            Entrar com o Facebook
          </Button>

          <Button 
            onClick={() => alert("Login por E-mail em desenvolvimento")} 
            className="w-full h-14 rounded-full bg-zinc-900 border border-white/10 hover:border-primary text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_25px_rgba(0,168,225,0.4)]"
          >
            <Mail className="w-5 h-5 text-gray-400" />
            Entrar com E-mail
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Login;