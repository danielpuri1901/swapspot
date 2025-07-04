
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface EmailVerificationPromptProps {
  onVerificationSent: () => void;
  userEmail?: string;
}

const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({
  onVerificationSent,
  userEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerification = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail || '',
        options: {
          emailRedirectTo: `${window.location.origin}/community`
        }
      });

      if (error) {
        toast.error("Failed to send verification email", {
          description: error.message
        });
      } else {
        toast.success("Verification email sent!", {
          description: "Please check your inbox and click the verification link."
        });
        onVerificationSent();
      }
    } catch (error) {
      console.error("Verification email error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Email Verification Required</CardTitle>
        <CardDescription>
          To join chat groups and communicate with other students, please verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Why verify your email?</p>
            <p className="mt-1">Email verification helps us maintain a safe community and prevents spam in chat groups.</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSendVerification}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Verification Email"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          You can still browse profiles and use other features without verification.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationPrompt;
