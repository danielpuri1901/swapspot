
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AccommodationModes from "@/components/AccommodationModes";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Index page loaded - version:", new Date().toISOString());
    
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase connection error:", error);
          // Don't set error state for auth issues, just log and continue
          console.log("Continuing without authentication");
        } else {
          console.log("Supabase connection successful:", data.session ? "User is logged in" : "No active session");
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error("Error checking user session:", err);
        // Don't block the app for auth errors
        console.log("Continuing without authentication");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id || "no user");
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swap-blue mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Loading SwapSpot...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AccommodationModes />
        <HowItWorks />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
