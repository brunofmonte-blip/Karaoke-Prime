import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigationBar from './BottomNavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* O Header traz o topo do seu site de volta */}
      <Header />
      
      {/* O 'children' é onde as páginas (Home, Lobby, Duelo) vão aparecer */}
      <main className="flex-grow w-full relative">
        {children}
      </main>
      
      {/* O Footer e a Barra de Navegação trazem a base do site de volta */}
      <Footer />
      <BottomNavigationBar />
    </div>
  );
};

export default Layout;