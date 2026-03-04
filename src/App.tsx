import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import BasicLobby from "./pages/BasicLobby";
import Academy from "./pages/Academy";
import Duel from "./pages/Duel";

const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <h1 className="text-2xl font-bold text-white uppercase tracking-widest border border-white/20 p-8 rounded-2xl bg-white/5">
      Página {name} em Recuperação 🚧
    </h1>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        {/* As 4 rotas que arrumamos */}
        <Route path="/" element={<Index />} />
        <Route path="/basic" element={<BasicLobby />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/duel" element={<Duel />} />
        
        {/* Todo o resto cai na tela de segurança para não explodir o site */}
        <Route path="*" element={<Placeholder name="Indisponível no momento" />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;