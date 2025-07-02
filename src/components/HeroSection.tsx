
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, MapPin, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import heroImage from "@/assets/hero-students.jpg";

export default function HeroSection() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartHousingSwap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      // If user is logged in, redirect to already registered page
      navigate('/already-registered');
    } else {
      // If not logged in, go to onboarding
      navigate('/onboarding');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-background via-muted/30 to-background py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            Find Your Perfect
            <span className="text-swap-blue block bg-gradient-to-r from-swap-blue to-swap-darkBlue bg-clip-text text-transparent">
              Student Housing Swap
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Connect with verified university students across Europe for safe, affordable accommodation exchanges during your study abroad semester.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleStartHousingSwap} 
              size="lg" 
              className="text-lg px-10 py-6 bg-swap-blue hover:bg-swap-darkBlue text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Start Your Housing Swap
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              asChild 
              size="lg" 
              className="text-lg px-10 py-6 text-muted-foreground hover:text-foreground border-border/50 hover:bg-muted/50 transition-all duration-300"
            >
              <Link to="/how-it-works">
                How It Works
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-br from-swap-blue/10 to-swap-lightBlue/20 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Users className="h-10 w-10 text-swap-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">10,000+ Students</h3>
            <p className="text-muted-foreground leading-relaxed">Verified university students from across Europe ready to swap accommodations</p>
          </div>
          
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-br from-swap-blue/10 to-swap-lightBlue/20 p-4 rounded-2xl w-fit mx-auto mb-6">
              <MapPin className="h-10 w-10 text-swap-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">50+ Cities</h3>
            <p className="text-muted-foreground leading-relaxed">Major university cities and study abroad destinations throughout Europe</p>
          </div>
          
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-br from-swap-blue/10 to-swap-lightBlue/20 p-4 rounded-2xl w-fit mx-auto mb-6">
              <Shield className="h-10 w-10 text-swap-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">100% Verified</h3>
            <p className="text-muted-foreground leading-relaxed">All students verified through official university email addresses</p>
          </div>
        </div>
      </div>
    </section>
  );
}
