import { Link } from "react-router-dom";
import { Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground hover:neon-blue-glow">
    {children}
  </Link>
);

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo: Karaoke Prime (Amazon Music Style) */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <span className="text-xl font-extrabold tracking-wider text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Karaoke 
              </span>
              <div className="relative ml-1">
                <span className="text-xl font-black tracking-wider text-primary neon-blue-glow">
                  Prime
                </span>
                {/* Amazon Smile Arrow positioned under Prime was removed */}
              </div>
            </div>
            <span className="text-xs text-muted-foreground ml-1 mt-1">
              <Mic2 className="inline h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/academy">Academy</NavLink>
          <NavLink to="/talent">Next Talent</NavLink>
          <NavLink to="/backstage">Backstage</NavLink>
          <NavLink to="/success">Amazon Success</NavLink>
        </nav>

        {/* User/Auth Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" className={cn(
            "border-primary text-primary hover:bg-primary/10",
            "rounded-full px-4 py-2 transition-all duration-300 border-2 hover:border-primary/80"
          )}>
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;