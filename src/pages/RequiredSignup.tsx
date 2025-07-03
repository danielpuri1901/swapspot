
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaywallSubscription from "@/components/PaywallSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

const RequiredSignup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/required-signup`
        }
      });
      
      if (error) {
        console.error('Error signing up:', error);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {user ? (
          // Show paywall for authenticated users
          <PaywallSubscription />
        ) : (
          // Show sign-up prompt for non-authenticated users
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border-blue-200 bg-white shadow-lg">
                <CardContent className="p-12">
                  <Mail className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Create Your SwapSpot Account
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Join thousands of verified students finding their perfect exchange accommodations across Europe.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-800 mb-3">What you'll get:</h3>
                    <ul className="text-left text-blue-700 space-y-2">
                      <li>✓ Access to 10,000+ verified student profiles</li>
                      <li>✓ Direct messaging with potential exchange partners</li>
                      <li>✓ Advanced matching based on your preferences</li>
                      <li>✓ University verification and safety checks</li>
                      <li>✓ 24/7 customer support</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleSignUp}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  >
                    Sign Up with Google
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-sm text-gray-500 mt-4">
                    Already have an account? You'll be redirected to choose your plan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RequiredSignup;
