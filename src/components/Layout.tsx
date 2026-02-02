import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavigationBar from './BottomNavigationBar';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Tagline: React.FC = () => (
  <div className="text-center py-10">
    <h2 className={cn(
      "text-4xl md:text-6xl font-extrabold uppercase tracking-widest",
      "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
    )}>
      CANTE. EVOLUA. CONQUISTAR O 
      <span className="relative inline-block ml-4 text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        MUNDO.
      </span>
    </h2>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pb-16 md:pb-0"> {/* Added padding bottom for mobile nav */}
        {children}
      </main>
      <Tagline />
      <Footer />
      <BottomNavigationBar />
    </div>
  );
};

export default Layout;