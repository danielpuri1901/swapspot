
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Starting auth callback process");
      console.log("URL params:", Object.fromEntries(searchParams.entries()));
      
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      
      // Handle error cases first
      if (error) {
        console.error("Auth callback error:", error, errorDescription);
        setStatus("error");
        toast.error("Verification failed", {
          description: errorDescription || "Please try again"
        });
        return;
      }
      
      if (!code) {
        console.error("No code parameter found in URL");
        setStatus("error");
        toast.error("Invalid verification link", {
          description: "The verification link is missing required parameters."
        });
        return;
      }
      
      try {
        console.log("Exchanging code for session...");
        
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error("Code exchange error:", error);
          setStatus("error");
          toast.error("Verification failed", {
            description: error.message
          });
          return;
        }
        
        if (data.session && data.user) {
          console.log("Session established successfully:", data.user.id);
          setStatus("success");
          
          toast.success("Email verified successfully!", {
            description: "Welcome to SwapSpot! Redirecting to community..."
          });
          
          // Give user a moment to see the success message before redirecting
          setTimeout(() => {
            navigate("/community", { replace: true });
          }, 2000);
        } else {
          console.error("No session or user data received");
          setStatus("error");
          toast.error("Verification incomplete", {
            description: "Please try the verification process again."
          });
        }
      } catch (err) {
        console.error("Error during auth callback:", err);
        setStatus("error");
        toast.error("Authentication failed", {
          description: "Please try signing in again or contact support."
        });
      }
    };
    
    handleAuthCallback();
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 text-swap-blue animate-spin mx-auto" />
              <h1 className="text-2xl font-bold">Verifying your email...</h1>
              <p className="text-gray-600">Please wait while we complete your verification.</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold text-green-700">Email Verified!</h1>
              <p className="text-gray-600">
                Your email has been successfully verified. You're now logged in and will be redirected to the community.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to community in a moment...
              </p>
            </div>
          )}
          
          {status === "error" && (
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold text-red-700">Verification Failed</h1>
              <p className="text-gray-600">
                We couldn't verify your email address. The verification link may be expired or invalid.
              </p>
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-swap-blue text-white py-2 px-4 rounded hover:bg-swap-blue/90 transition-colors"
                >
                  Try Again
                </button>
                <p className="text-sm text-gray-500">
                  If you continue to have issues, please contact support
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthCallback;
