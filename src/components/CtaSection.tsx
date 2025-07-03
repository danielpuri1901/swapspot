
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      // If user is logged in, redirect to already registered page
      navigate('/already-registered');
    } else {
      // If not logged in, go to onboarding
      navigate('/onboarding');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-swap-blue to-swap-darkBlue">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Housing Swap?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands of students already finding their perfect exchange accommodations. 
          Get verified access to connect with students across Europe.
        </p>
        <Button onClick={handleStartHousingSwap} size="lg" className="text-lg px-8 py-6 bg-white text-swap-blue hover:bg-gray-100">
          Start Your Housing Swap
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}
