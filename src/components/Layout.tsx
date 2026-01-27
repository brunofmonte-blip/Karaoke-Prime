import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigationBar from './BottomNavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pb-16 md:pb-0"> {/* Added padding bottom for mobile nav */}
        {children}
      </main>
      <Footer />
      <BottomNavigationBar />
    </div>
  );
};

export default Layout;