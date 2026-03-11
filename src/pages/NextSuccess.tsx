import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NextSuccess = () => {
const navigate = useNavigate();

return (
<div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden pt-16">
<div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-black to-black z-0" />
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none z-0" />

);
};

export default NextSuccess; 