
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
    <section 
      className="relative bg-gradient-to-br from-swap-lightBlue to-white py-20 md:py-32 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0.9)), url(${heroImage})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="text-swap-blue block">Student Housing Swap</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with verified university students across Europe for safe, affordable accommodation exchanges during your study abroad semester.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleStartHousingSwap} size="lg" className="text-lg px-8 py-6">
              Start Your Housing Swap
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/how-it-works">
                How It Works
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-swap-lightBlue p-3 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-swap-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">10,000+ Students</h3>
            <p className="text-gray-600">Verified university students from across Europe ready to swap accommodations</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-swap-lightBlue p-3 rounded-full w-fit mx-auto mb-4">
              <MapPin className="h-8 w-8 text-swap-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">50+ Cities</h3>
            <p className="text-gray-600">Major university cities and study abroad destinations throughout Europe</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-swap-lightBlue p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-swap-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">100% Verified</h3>
            <p className="text-gray-600">All students verified through official university email addresses</p>
          </div>
        </div>
      </div>
    </section>
  );
}
