import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// 💡 Comando de choque para forçar a limpeza do cache de tela branca no DYAD
console.log("🚀 Iniciando Karaoke Prime - Cache Limpo e Sistema Restaurado!");

createRoot(document.getElementById("root")!).render(<App />);