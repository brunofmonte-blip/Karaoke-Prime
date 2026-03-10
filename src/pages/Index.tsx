import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, GraduationCap, Star, LayoutDashboard, Sparkles, Trophy, Globe, Medal, User 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-16 font-sans text-white">
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-6xl font-black italic tracking-tighter mb-4">
          KARAOKE <span className="text-primary">PRIME</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-10">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer p-6 bg-zinc-900 border-primary/50 hover:bg-primary/20 transition-all">
            <Music className="text-primary mb-4" />
            <h3 className="font-black uppercase italic">Basic</h3>
          </Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer p-6 bg-zinc-900 border-primary/50 hover:bg-primary/20 transition-all">
            <GraduationCap className="text-primary mb-4" />
            <h3 className="font-black uppercase italic">Academy</h3>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index; 