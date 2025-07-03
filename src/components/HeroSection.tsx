
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
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32 bg-cover bg-center flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(37, 99, 235, 0.05) 100%), url(${heroImage})`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-400 rounded-full opacity-25 animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="text-center mb-20">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-16 shadow-2xl border border-white/30 max-w-5xl mx-auto relative">
            {/* Sparkle icon */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent block mt-2">
                Student Housing Swap
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
              Connect with verified university students across Europe for safe, affordable accommodation exchanges during your study abroad semester.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleStartHousingSwap} 
                size="lg" 
                className="text-lg px-10 py-7 shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
              >
                Start Your Housing Swap
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                asChild 
                size="lg" 
                className="text-lg px-10 py-7 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-200"
              >
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
              <Users className="h-10 w-10 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">10,000+ Students</h3>
            <p className="text-gray-700 text-lg leading-relaxed">Verified university students from across Europe ready to swap accommodations</p>
          </div>
          
          <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
              <MapPin className="h-10 w-10 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">50+ Cities</h3>
            <p className="text-gray-700 text-lg leading-relaxed">Major university cities and study abroad destinations throughout Europe</p>
          </div>
          
          <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">100% Verified</h3>
            <p className="text-gray-700 text-lg leading-relaxed">All students verified through official university email addresses</p>
          </div>
        </div>
      </div>
    </section>
  );
}
