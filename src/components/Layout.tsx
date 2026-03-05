import React from 'react';

// 🛑 AS IMPORTAÇÕES FORAM COMENTADAS PARA ISOLAR O ERRO
// Se o erro estiver nestes arquivos, a tela vai voltar a aparecer sem eles.
// import Header from './Header';
// import Footer from './Footer';
// import BottomNavigationBar from './BottomNavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-grow w-full relative">
        {/* Aqui é onde o seu Index.tsx vai ser injetado */}
        {children}
      </main>
    </div>
  );
};

export default Layout; 