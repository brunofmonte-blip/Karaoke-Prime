"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic2, Chrome, Mail, Lock, ArrowRight, 
  ShieldCheck, Sparkles, User, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { auth as firebaseAuth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      toast.success("Bem-vindo ao Karaoke Prime!");
      navigate('/');
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error("Falha na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real scenario, authentication logic goes here
    toast.success(isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
    navigate('/basic');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Branding & Value Prop */}
        <div className="hidden lg:flex flex-col space-y-8 p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30">
              <Mic2 className="h-8 w-8 text-primary neon-blue-glow" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight">
              Sua jornada para o <br />
              <span className="text-accent neon-gold-glow">Estrelato Global</span> <br />
              começa aqui.
            </h2>
            <p className="text-xl text-gray-400 max-w-md">
              Acesse o Academy, participe de audições mundiais e transforme sua voz com nossa IA proprietária.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-2xl glass-pillar border border-white/10">
              <Sparkles className="h-6 w-6 text-primary mb-2" />
              <h4 className="font-bold text-white">Vocal AI</h4>
              <p className="text-xs text-gray-500">Diagnóstico em tempo real.</p>
            </div>
            <div className="p-4 rounded-2xl glass-pillar border border-white/10">
              <ShieldCheck className="h-6 w-6 text-green-400 mb-2" />
              <h4 className="font-bold text-white">Segurança</h4>
              <p className="text-xs text-gray-500">Dados 100% criptografados.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <Card className="glass-pillar border-2 border-primary/30 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center">
            <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter">
              {isLogin ? 'Entrar na Conta' : 'Criar Nova Conta'}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin ? 'Bem-vindo de volta, artista!' : 'Junte-se à elite vocal do mundo.'}
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-10 space-y-6">
            {/* Social Logins */}
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
                Continuar com Google
              </Button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-[#0a0a0a] px-4 text-gray-500 font-bold">Ou use seu e-mail</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input 
                      placeholder="Seu nome artístico" 
                      className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary text-white"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    type="email"
                    placeholder="seu@email.com" 
                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary text-white"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black rounded-2xl shadow-lg shadow-primary/20 text-lg group mt-4"
              >
                {isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="text-center pt-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-primary transition-colors font-medium"
              >
                {isLogin ? 'Não tem uma conta? Registre-se' : 'Já possui uma conta? Entre aqui'}
              </button>
            </div>

            {/* Security Footer */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" />
              Conexão Segura SSL 256-bit
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}