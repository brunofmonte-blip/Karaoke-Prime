// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR NO ARQUIVO src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Apontando para o arquivo que acabamos de limpar no Passo 1!
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

      navigate('/');
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Houve um erro ao tentar fazer login com o Google. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-black to-black z-0 opacity-50" />
      
      <div className="z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_80px_rgba(0,168,225,0.15)]">
        <div className="w-20 h-20 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
          <Mic2 className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
          Karaoke <span className="text-primary neon-blue-glow">Prime</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10">
          A maior arena vocal do mundo
        </p>

        <Button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          className="w-full h-16 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
              Entrar com o Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Login; 