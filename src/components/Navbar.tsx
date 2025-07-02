
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu, ArrowRightLeft, User, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always go to home page (/) regardless of auth status
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You've been logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className={cn(
      "sticky top-0 z-50 transition-all duration-300 ease-in-out",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm" 
        : "bg-white border-b-transparent"
    )}>
      <div className="container flex items-center justify-between py-4">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 font-bold text-2xl text-swap-blue hover:text-swap-darkBlue transition-colors duration-200">
          <div className="relative">
            <ArrowRightLeft 
              className="h-7 w-7 text-swap-blue hover:text-swap-darkBlue transition-all duration-300 hover:scale-110" 
            />
          </div>
          SwapSpot
        </Link>

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] border-border/50 bg-white/95 backdrop-blur-md">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/community" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">Community</Link>
              </DropdownMenuItem>
              {user ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-foreground/80 hover:text-foreground">
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="#" onClick={handleLoginClick} className="text-foreground/80 hover:text-foreground">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="#" onClick={handleSignupClick} className="text-foreground/80 hover:text-foreground">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/how-it-works" className={cn(navigationMenuTriggerStyle(), "text-foreground/80 hover:text-foreground transition-colors")}>
                      How it Works
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/help-tips" className={cn(navigationMenuTriggerStyle(), "text-foreground/80 hover:text-foreground transition-colors")}>
                      Help & Tips
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/community" className={cn(navigationMenuTriggerStyle(), "text-foreground/80 hover:text-foreground transition-colors")}>
                      Community
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <Link to="/about" className={cn(navigationMenuTriggerStyle(), "text-foreground/80 hover:text-foreground transition-colors")}>
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {!isLoading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all">
                      <User className="h-4 w-4" />
                      {user.email?.split('@')[0] || 'Profile'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] border-border/50 bg-white/95 backdrop-blur-md">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" asChild className="text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all">
                    <Link to="#" onClick={handleLoginClick}>Login</Link>
                  </Button>
                  <Button asChild className="bg-swap-blue hover:bg-swap-darkBlue text-white shadow-md hover:shadow-lg transition-all">
                    <Link to="#" onClick={handleSignupClick}>Get Started</Link>
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
