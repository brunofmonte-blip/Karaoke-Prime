// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Integração com o Firebase
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // 🔐 FORÇANDO A PERSISTÊNCIA: Garante que o Header te reconheça após o login
      await setPersistence(auth, browserLocalPersistence);
      
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

      navigate('/'); 
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Houve um erro ao tentar fazer login. Verifique os Domínios Autorizados no Firebase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=2000&q=80" 
        alt="Stage Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale-[50%] z-0" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black z-10" />

      <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest z-30">
        <ArrowLeft size={16} /> Voltar
      </button>
      
      <div className="z-20 w-full max-w-sm bg-[#0a0a0a] border-[1px] border-cyan-400/30 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-in zoom-in-95 duration-500 relative">
        <div className="w-20 h-20 rounded-full border-[2px] border-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-cyan-400/5">
          <Mic className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
          KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">PRIME</span>
        </h1>
        
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px] mb-10">
          A MAIOR ARENA VOCAL DO MUNDO
        </p>

        <div className="w-full flex flex-col gap-3">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-[#141414] border border-white/5 hover:border-cyan-400 text-white font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-4 h-4" />
                ENTRAR COM O GOOGLE
              </>
            )}
          </Button>

          <Button 
            onClick={() => alert("Login por E-mail em desenvolvimento")} 
            className="w-full h-12 rounded-full bg-[#141414] border border-white/5 hover:border-cyan-400 text-white font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Mail className="w-4 h-4 text-gray-400" />
            ENTRAR COM E-MAIL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login; 