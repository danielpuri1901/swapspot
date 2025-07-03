
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, User, Mail, Lock, CheckCircle } from "lucide-react";
import { OnboardingData } from "./OnboardingFlow";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { addUserToGoogleSheet, formatUserDataForSheet } from "@/services/googleSheetsService";

interface AccountCreationStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onAccountCreated: () => void;
  isAuthenticated: boolean;
}

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
  data,
  onUpdate,
  onPrevious,
  canGoPrevious,
  onAccountCreated,
  isAuthenticated,
}) => {
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState(data.confirmPassword || "");
  const [fullName, setFullName] = useState(data.fullName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (!email || !password || !fullName) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Create account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          setError("An account with this email already exists. Please try logging in instead.");
        } else {
          setError(authError.message);
        }
        return;
      }

      if (authData.user) {
        console.log("User created successfully:", authData.user.id);
        
        // Wait a moment for the auth state to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Prepare complete onboarding data with account info
        const completeData = {
          ...data,
          email,
          fullName,
          password, // Include for Google Sheets
        };

        // Save to profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            email: email,
            full_name: fullName,
            university: data.university,
            exchange_university: data.exchangeUniversity,
            program: data.program,
            start_date: data.startDate,
            end_date: data.endDate,
            current_location: data.currentLocation,
            current_address: data.currentAddress,
            budget: data.budget,
            preferred_destinations: data.preferredDestinations || [],
            apartment_description: data.apartmentDescription,
            verification_method: data.verificationMethod || 'email',
            university_email: data.universityEmail,
            additional_info: data.additionalInfo,
            has_uploaded_proof: data.hasUploadedProof || false,
            gdpr_consent: data.gdprConsent || false,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (profileError) {
          console.error("Error saving to profiles:", profileError);
          toast.error("Profile saved with some issues", {
            description: "Account created but some profile data may need to be updated later."
          });
        } else {
          console.log("Profile saved successfully");
        }

        // Send data to Google Sheets
        try {
          const formattedData = formatUserDataForSheet(completeData);
          console.log('Sending complete data to Google Sheets:', formattedData);
          await addUserToGoogleSheet(formattedData);
          console.log('Data successfully sent to Google Sheets');
        } catch (sheetsError) {
          console.error("Error sending to Google Sheets:", sheetsError);
          // Don't fail the whole process if Google Sheets fails
        }

        toast.success("Account created successfully!", {
          description: "Your profile has been saved and you can now access all features."
        });
        
        onAccountCreated();
      }
    } catch (error) {
      console.error("Account creation error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Authentication error - please log in again");
          return;
        }

        // Save to profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: user.email || data.email,
            full_name: data.fullName,
            university: data.university,
            exchange_university: data.exchangeUniversity,
            program: data.program,
            start_date: data.startDate,
            end_date: data.endDate,
            current_location: data.currentLocation,
            current_address: data.currentAddress,
            budget: data.budget,
            preferred_destinations: data.preferredDestinations || [],
            apartment_description: data.apartmentDescription,
            verification_method: data.verificationMethod || 'email',
            university_email: data.universityEmail,
            additional_info: data.additionalInfo,
            has_uploaded_proof: data.hasUploadedProof || false,
            gdpr_consent: data.gdprConsent || false,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (profileError) {
          console.error("Error saving profile:", profileError);
          toast.error("Failed to save profile data");
          return;
        }

        // Send to Google Sheets
        try {
          const completeData = { ...data, email: user.email || data.email };
          const formattedData = formatUserDataForSheet(completeData);
          await addUserToGoogleSheet(formattedData);
        } catch (sheetsError) {
          console.error("Error sending to Google Sheets:", sheetsError);
        }

        toast.success("Profile updated successfully!");
        onAccountCreated();
      } catch (error) {
        console.error("Error in saveProfile:", error);
        toast.error("Failed to save profile data");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Complete!
          </h3>
          <p className="text-gray-600 text-lg">
            Your onboarding data is ready to be saved to your profile
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">✅ All Set!</h4>
          <p className="text-sm text-green-700">
            You're already logged in. We'll update your profile with the information you've provided.
          </p>
        </div>

        <div className="flex gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={onPrevious} 
            disabled={!canGoPrevious || isLoading}
            className="flex-1 h-12"
          >
            Previous
          </Button>
          <Button 
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <UserPlus className="h-16 w-16 text-swap-blue mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h3>
        <p className="text-gray-600 text-lg">
          Save your preferences and access your profile
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-2">🎉 Almost Done!</h4>
        <p className="text-sm text-blue-700">
          Create your account to save all your preferences and start connecting with other students.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-swap-blue" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 border-gray-300 focus:border-swap-blue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
            <Mail className="h-4 w-4 text-swap-blue" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-300 focus:border-swap-blue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-swap-blue" />
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-300 focus:border-swap-blue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-base font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-swap-blue" />
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 border-gray-300 focus:border-swap-blue"
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={!canGoPrevious || isLoading}
          className="flex-1 h-12"
        >
          Previous
        </Button>
        <Button 
          onClick={handleCreateAccount}
          disabled={isLoading || !email || !password || !fullName || password !== confirmPassword}
          className="flex-1 h-12 bg-swap-blue hover:bg-swap-blue/90 text-white font-medium"
        >
          {isLoading ? "Creating Account..." : "Create Account & Save"}
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationStep;
