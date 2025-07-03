
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleVerification = async () => {
      console.log("Starting email verification process");
      console.log("URL params:", Object.fromEntries(searchParams.entries()));
      
      // Get the verification parameters from the URL
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      
      console.log("Verification params:", { token_hash: !!token_hash, type });
      
      if (!token_hash || !type) {
        console.error("Missing token_hash or type in URL");
        setVerificationStatus("error");
        toast.error("Invalid verification link", {
          description: "The link appears to be missing required parameters."
        });
        return;
      }
      
      try {
        // Verify the OTP (one-time password) token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
          options: {
            redirectTo: window.location.origin // Ensure we redirect to our domain
          }
        });
        
        if (error) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
          toast.error("Verification failed", {
            description: error.message
          });
        } else {
          console.log("Email verification successful:", data);
          setUser(data.user);
          setVerificationStatus("success");
          
          // Auto-redirect after successful verification
          toast.success("Email verified successfully!", {
            description: "Let's complete your profile setup"
          });
          
          // Give user a moment to see the success message before redirecting
          setTimeout(() => {
            navigate("/onboarding");
          }, 3000);
        }
      } catch (err) {
        console.error("Error during verification:", err);
        setVerificationStatus("error");
        toast.error("Verification process failed", {
          description: "Please try signing up again or contact support."
        });
      }
    };
    
    // Call verification handler
    handleVerification();
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          {verificationStatus === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 text-swap-blue animate-spin mx-auto" />
              <h1 className="text-2xl font-bold">Verifying your email...</h1>
              <p className="text-gray-600">This will only take a moment.</p>
            </div>
          )}
          
          {verificationStatus === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold text-green-700">Email Verified!</h1>
              <p className="text-gray-600">
                Your email has been successfully verified. Let's complete your profile setup to see your first matches!
              </p>
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link to="/onboarding">Complete Profile Setup</Link>
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  Redirecting to profile setup in a few seconds...
                </p>
              </div>
            </div>
          )}
          
          {verificationStatus === "error" && (
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold text-red-700">Verification Failed</h1>
              <p className="text-gray-600">
                We couldn't verify your email address. The verification link may be expired or invalid.
              </p>
              <div className="pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Try Again</Link>
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  If you continue to have issues, please <Link to="/support" className="text-swap-blue hover:underline">contact support</Link>
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

export default VerifyEmail;
