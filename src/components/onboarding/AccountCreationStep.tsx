import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { UserPlus, User, Mail, Lock, CheckCircle } from "lucide-react";
import { OnboardingData } from "./OnboardingFlow";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { addUserToGoogleSheet, formatUserDataForSheet } from "@/services/googleSheetsService";
import { uploadAccommodationPhotos, uploadVerificationDocument } from "@/services/storageService";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState("");

  const uploadUserFiles = async (userId: string) => {
    const uploadPromises = [];
    
    // Upload accommodation photos if they exist
    if (data.apartmentPhotos && data.apartmentPhotos.length > 0) {
      console.log('Uploading accommodation photos...');
      uploadPromises.push(
        uploadAccommodationPhotos(data.apartmentPhotos, userId)
          .then(results => {
            console.log('Accommodation photos uploaded:', results);
            return { type: 'accommodation', results };
          })
          .catch(error => {
            console.error('Failed to upload accommodation photos:', error);
            return { type: 'accommodation', error };
          })
      );
    }

    // Upload verification document if it exists
    if (data.verificationFile) {
      console.log('Uploading verification document...');
      uploadPromises.push(
        uploadVerificationDocument(data.verificationFile, userId)
          .then(result => {
            console.log('Verification document uploaded:', result);
            return { type: 'verification', result };
          })
          .catch(error => {
            console.error('Failed to upload verification document:', error);
            return { type: 'verification', error };
          })
      );
    }

    // Wait for all uploads to complete
    if (uploadPromises.length > 0) {
      const uploadResults = await Promise.all(uploadPromises);
      console.log('All file uploads completed:', uploadResults);
      
      // Check for any upload failures
      const failures = uploadResults.filter(result => result.error);
      if (failures.length > 0) {
        console.warn('Some files failed to upload:', failures);
        toast.error("Some files couldn't be uploaded", {
          description: "Your account was created, but you may need to re-upload some files later."
        });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        setError("Google sign-up failed: " + error.message);
        toast.error("Google sign-up failed", {
          description: error.message
        });
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
      setError("An unexpected error occurred with Google sign-up");
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
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
        
        // Upload files to storage
        try {
          await uploadUserFiles(authData.user.id);
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          // Continue with account creation even if file uploads fail
        }
        
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
          description: "You're now signed in and ready to use SwapSpot. Files are being uploaded to your profile."
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

        // Upload files to storage
        try {
          await uploadUserFiles(user.id);
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          // Continue with profile save even if file uploads fail
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
            You're already signed in. We'll update your profile with the information you've provided and upload your files.
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
            {isLoading ? "Saving and uploading files..." : "Save Profile & Upload Files"}
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
          <span className="block mt-2 font-medium">Note: Email verification is only required if you want to join chat groups.</span>
        </p>
      </div>

      {/* Primary Google Sign-Up Button - Most Prominent */}
      <div className="space-y-4">
        <Button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className="w-full h-14 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-lg font-semibold shadow-lg"
        >
          {isGoogleLoading ? (
            <span className="flex items-center">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              Creating account with Google...
            </span>
          ) : (
            <>
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        {/* Or separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or</span>
          </div>
        </div>

        {/* Toggle for email form */}
        {!showEmailForm ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowEmailForm(true)}
            className="w-full h-12 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Sign up with email instead
          </Button>
        ) : (
          <div className="space-y-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Create account with email</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
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

              <Button 
                onClick={handleCreateAccount}
                disabled={isLoading || !email || !password || !fullName || password !== confirmPassword}
                className="w-full h-12 bg-swap-blue hover:bg-swap-blue/90 text-white font-medium"
              >
                {isLoading ? "Creating Account & Uploading Files..." : "Create Account"}
              </Button>
            </div>
          </div>
        )}
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
          disabled={!canGoPrevious || isLoading || isGoogleLoading}
          className="flex-1 h-12"
        >
          Previous
        </Button>
        <div className="flex-1" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
};

export default AccountCreationStep;
