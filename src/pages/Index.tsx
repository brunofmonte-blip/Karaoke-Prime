import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard,
Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User as LucideUser
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
<div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden antialiased">

);
};

export default Index;