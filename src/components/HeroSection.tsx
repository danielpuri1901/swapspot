
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, MapPin, Shield, Sparkles } from "lucide-react";
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
      navigate('/already-registered');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <section 
      className="relative min-h-screen bg-gray-100 py-20 md:py-32 flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-blue-400/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-10 h-10 bg-blue-300/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-8 h-8 bg-blue-200/20 rounded-full animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="text-center mb-16">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-16 shadow-2xl border border-white/30 max-w-5xl mx-auto relative">
            {/* Blue star icon */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 p-4 rounded-full shadow-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Find Your Perfect
              <span className="text-blue-600 block mt-2">
                Student Housing Swap
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
              Connect with verified university students across Europe for safe, affordable accommodation exchanges during your study abroad semester.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleStartHousingSwap} 
                size="lg" 
                className="text-lg px-12 py-8 shadow-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transform hover:scale-105 transition-all duration-300 rounded-full"
              >
                Start Your Housing Swap
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg" 
                className="text-lg px-12 py-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transform hover:scale-105 transition-all duration-300 rounded-full"
              >
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-blue-600 p-3 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">10,000+ Students</h3>
            <p className="text-gray-600 text-sm">Verified across Europe</p>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-blue-600 p-3 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">50+ Cities</h3>
            <p className="text-gray-600 text-sm">Major university destinations</p>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-blue-600 p-3 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">100% Verified</h3>
            <p className="text-gray-600 text-sm">University email verified</p>
          </div>
        </div>
      </div>
    </section>
  );
}
