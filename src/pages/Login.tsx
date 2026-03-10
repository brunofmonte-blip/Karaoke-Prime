import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
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
      alert("Erro ao acessar. Verifique se o pop-up não foi bloqueado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-black flex flex-col items-center justify-center p-4 z-[100] font-sans overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=2000&q=80" 
        alt="Stage Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale-[50%] z-0" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-10" />

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors uppercase text-[10px] font-black tracking-[0.2em] z-30"
      >
        <ArrowLeft size={16} /> Voltar para Arena
      </button>
      
      <div className="z-20 w-full max-w-sm bg-[#050505] border border-cyan-400/20 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_60px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-500 relative">
        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-cyan-400/5">
          <Mic className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
          KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">PRIME</span>
        </h1>
        
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[8px] mb-10 opacity-70">
          A MAIOR ARENA VOCAL DO MUNDO
        </p>

        <div className="w-full flex flex-col gap-3">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full h-14 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                ENTRAR COM O GOOGLE
              </>
            )}
          </Button>

          <Button 
            onClick={() => alert("Login por E-mail em desenvolvimento")} 
            className="w-full h-14 rounded-full bg-transparent border border-white/5 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-4 h-4" />
            ENTRAR COM E-MAIL
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 z-20">
         <p className="text-[8px] text-gray-600 font-black tracking-[0.5em] uppercase">Security Verified & Encrypted</p>
      </div>
    </div>
  );
};

export default Login;