import { Link, useNavigate } from "react-router-dom";
import { Mic2, LogOut, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/integrations/supabase/auth";
import { useLoginModal } from "@/hooks/use-login-modal";
import { supabase } from "@/integrations/supabase/client";
import { auth as firebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground hover:neon-blue-glow">
    {children}
  </Link>
);

const Header = () => {
  const { user, authType } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (authType === 'firebase') {
        await signOut(firebaseAuth);
      } else {
        await supabase.auth.signOut();
      }
      toast.success("Successfully signed out. See you soon!", { duration: 3000 });
      navigate('/');
    } catch (error: any) {
      toast.error("Failed to sign out.");
    }
  };

  const getUserDisplay = () => {
    if (!user) return null;
    
    const avatarUrl = (user as any).photoURL || (user as any).user_metadata?.avatar_url;
    const name = (user as any).displayName || (user as any).user_metadata?.full_name || (user as any).email?.split('@')[0] || "User";
    
    return { avatarUrl, name };
  };

  const userInfo = getUserDisplay();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
              </div>
            </div>
            <span className="text-xs text-muted-foreground ml-1 mt-1">
              <Mic2 className="inline h-3 w-3" />
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/">Basic</NavLink>
          <NavLink to="/academy">Academy</NavLink>
          <NavLink to="/talent">Next Talent</NavLink>
          <NavLink to="/backstage">Backstage</NavLink>
          <NavLink to="/next-success">Next Success</NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center text-xs text-green-400 font-medium space-x-1 px-2 py-1 rounded-full bg-green-900/30 border border-green-700/50">
            <ShieldCheck className="h-3 w-3" />
            <span>Security Verified</span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarImage src={userInfo?.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {userInfo?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium text-foreground truncate max-w-[100px]">
                  {userInfo?.name}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className={cn(
                  "border-destructive text-destructive hover:bg-destructive/10",
                  "rounded-full px-4 py-2 transition-all duration-300 border-2 hover:border-destructive/80 h-9"
                )}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className={cn(
                "border-primary text-primary hover:bg-primary/10",
                "rounded-full px-4 py-2 transition-all duration-300 border-2 hover:border-primary/80"
              )}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;