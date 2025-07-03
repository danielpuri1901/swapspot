
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function CtaSection() {
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
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Star className="h-8 w-8 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-semibold text-lg">Join Thousands of Students</span>
          <Star className="h-8 w-8 text-yellow-400 ml-2" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          Ready to Start Your
          <span className="block text-yellow-400">Housing Swap Adventure?</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
          Join thousands of students already finding their perfect exchange accommodations. 
          Get verified access to connect with students across Europe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            onClick={handleStartHousingSwap} 
            size="lg" 
            className="text-xl px-12 py-8 bg-white text-blue-700 hover:bg-blue-50 shadow-2xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            Start Your Housing Swap
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center space-x-8 text-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10,000+</div>
            <div className="text-sm">Active Students</div>
          </div>
          <div className="w-px h-8 bg-blue-400"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-sm">European Cities</div>
          </div>
          <div className="w-px h-8 bg-blue-400"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm">Verified</div>
          </div>
        </div>
      </div>
    </section>
  );
}
