"use client";

import React, { useState } from 'react';
import { Sparkles, Music, Mic2, Save, Play, Send, BrainCircuit, Layers, Disc, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NextSuccess = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Descreva sua ideia primeiro!");
      return;
    }
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedLyrics(
        `[Verso 1]\nCaminhando sob as luzes da cidade\nBuscando um sonho, uma nova realidade\nO microfone na mão, o coração a pulsar\nEu sei que o meu momento vai chegar...\n\n[Refrão]\nSou Karaoke Prime, sou a voz do amanhã\nBrilhando mais forte que o sol da manhã\nDo palco local ao topo do mundo\nEu sinto esse ritmo em cada segundo!`
      );
      setIsGenerating(false);
      toast.success("Música gerada com sucesso pelo motor neural!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            NEXT <span className="text-accent neon-gold-glow">SUCCESS</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            O espaço do compositor. Transforme suas ideias em hits de estúdio usando nossa IA proprietária.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="glass-pillar border-2 border-accent/30">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5" />
                  Brainstorming Neural
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sobre o que é a música?</label>
                  <Textarea 
                    placeholder="Ex: Uma balada rock sobre superação e as luzes de São Paulo..."
                    className="bg-black/50 border-white/10 min-h-[150px] rounded-xl focus:border-accent"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gênero</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white">
                      <option>Pop</option>
                      <option>Rock</option>
                      <option>Sertanejo</option>
                      <option>Jazz</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mood</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white">
                      <option>Energético</option>
                      <option>Melancólico</option>
                      <option>Inspirador</option>
                      <option>Romântico</option>
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-accent hover:bg-accent/90 text-black font-black py-6 rounded-xl shadow-lg shadow-accent/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      COMPONDO...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      GERAR HIT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <Layers className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Tracks</p>
                <p className="text-lg font-bold text-white">12</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <Disc className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">BPM</p>
                <p className="text-lg font-bold text-white">128</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <Mic2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Vocal FX</p>
                <p className="text-lg font-bold text-white">Ativo</p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <Card className="glass-pillar border-2 border-primary/30 flex flex-col">
            <CardHeader className="border-b border-white/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Studio Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Save className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 flex flex-col">
              {generatedLyrics ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                    {generatedLyrics}
                  </div>
                  <div className="mt-auto space-y-4">
                    <div className="h-12 bg-primary/10 rounded-xl border border-primary/30 flex items-center px-4 gap-4">
                      <Play className="h-5 w-5 text-primary fill-primary" />
                      <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 shadow-[0_0_10px_rgba(0,168,225,0.8)]" />
                      </div>
                      <span className="text-xs font-mono text-primary">01:24 / 03:45</span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold rounded-xl">
                      EXPORTAR PARA O PALCO
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-30">
                  <Music className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Aguardando sua inspiração...</p>
                  <p className="text-sm">Descreva sua música à esquerda para começar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NextSuccess;