import React from 'react';

// Se você tiver componentes de Header ou Footer, pode importá-los aqui no futuro.
// import Header from './Header';
// import BottomNavigationBar from './BottomNavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Header /> */}
      <main className="flex-grow w-full relative">
        {children}
      </main>
      {/* <BottomNavigationBar /> */}
    </div>
  );
};

export default Layout; 