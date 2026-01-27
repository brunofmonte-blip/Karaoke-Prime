import { Link } from "react-router-dom";
import { Mic2, ArrowRight } from "lucide-react";
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
        {/* Logo: Karaoke Prime with Amazon Smile/Gold Accent */}
        <Link to="/" className="flex items-center space-x-2">
          <ArrowRight className="h-6 w-6 text-accent fill-accent rotate-90 icon-neon-glow" />
          <span className="text-xl font-extrabold tracking-wider text-primary neon-blue-glow">
            Karaoke <span className="text-accent neon-gold-glow">Prime</span>
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            <Mic2 className="inline h-3 w-3" />
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/academy">Academy</NavLink>
          <NavLink to="/talent">Next Talent</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
          <NavLink to="/backstage">Backstage</NavLink>
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