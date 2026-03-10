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
      }
      navigate('/'); 
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-black flex flex-col items-center justify-center p-4 z-[100] overflow-hidden">
      <div className="z-20 w-full max-w-sm bg-[#050505] border border-cyan-400/20 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl relative">
        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center mb-6 bg-cyan-400/5">
          <Mic className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-10">
          KARAOKE <span className="text-cyan-400">PRIME</span>
        </h1>
        <Button onClick={handleGoogleLogin} disabled={isLoading} className="w-full h-14 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ENTRAR COM O GOOGLE"}
        </Button>
      </div>
    </div>
  );
};

export default Login;