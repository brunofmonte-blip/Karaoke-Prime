// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Academy.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  
  // 💡 Lendo a memória do navegador para saber se está logado
  const isLoggedIn = localStorage.getItem('@KaraokePrime:loggedIn') === 'true';

  const levels = [
    { id: 1, title: 'Steady Breath', desc: 'Dominando a respiração diafragmática para notas longas.', locked: false },
    { id: 2, title: 'Pitch Calibration', desc: 'Introdução para atingir as notas alvo com precisão.', locked: true },
    { id: 3, title: 'Rhythm Basics', desc: 'Mantendo o tempo e sincronizando os vocais.', locked: true },
    { id: 4, title: 'Vocal Resonance', desc: 'Explorando a ressonância de peito e cabeça.', locked: true },
    { id: