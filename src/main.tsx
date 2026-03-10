import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// 📍 REMOVIDO: import './index.css' (pois o arquivo não existe)

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Falha ao encontrar o elemento root");

createRoot(rootElement).render(<App />);