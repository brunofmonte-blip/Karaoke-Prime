import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Library', icon: Library, path: '/library' },
  { name: 'Search', icon: Search, path: '/search' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const BottomNavigationBar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card/90 backdrop-blur-lg border-t border-border/50 md:hidden">
      <div className="flex justify-around h-full items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-xs transition-colors duration-300 p-2 rounded-lg",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive && "icon-neon-glow" // Apply glow to active icon
                  )} 
                />
                {/* Neon Blue Active Indicator */}
                {isActive && (
                  <div className="absolute inset-0 -m-1 rounded-full bg-primary/30 filter blur-sm opacity-50 animate-pulse"></div>
                )}
              </div>
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;