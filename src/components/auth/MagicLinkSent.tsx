
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface MagicLinkSentProps {
  email: string;
}

const MagicLinkSent = ({ email }: MagicLinkSentProps) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`
        }
      });

      if (error) {
        toast.error("Failed to resend email", {
          description: error.message
        });
      } else {
        toast.success("Verification email sent!", {
          description: "Please check your inbox for the new verification link"
        });
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Failed to resend email", {
        description: "Please try again later"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center space-y-6 p-6 border border-blue-100 rounded-lg bg-blue-50">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
          <MailCheck className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-medium text-blue-800">Verification Email Sent!</h2>
        <p className="text-gray-600">
          We've sent a verification link to <span className="font-medium">{email}</span>.
        </p>
        <p className="text-gray-600">
          Please check your email inbox (including spam folder) and click the verification link to complete your registration.
        </p>
        <div className="pt-4 space-y-3">
          <Button 
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline" 
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkSent;
