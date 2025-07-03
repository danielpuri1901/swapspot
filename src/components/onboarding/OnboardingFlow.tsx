import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import UniversityStep from "./UniversityStep";
import DatesStep from "./DatesStep";
import EnhancedPreferencesStep from "./EnhancedPreferencesStep";
import ProofOfEnrollmentStep from "./ProofOfEnrollmentStep";
import AccountCreationStep from "./AccountCreationStep";
import CompletionStep from "./CompletionStep";
import { loadUserProfile } from "@/services/emailService";
import { supabase } from "@/lib/supabase";

export interface OnboardingData {
  fullName?: string;
  email?: string;
  university?: string;
  exchangeUniversity?: string;
  program?: string;
  startDate?: string;
  endDate?: string;
  preferences?: {
    cleanliness?: number;
    noiseLevel?: number;
    socialBattery?: number;
  };
  photos?: File[];
  proofOfEnrollment?: File;
  verificationStatus?: "pending" | "verified" | "rejected";
  matches?: string[];
  // Additional properties for verification
  verificationMethod?: 'email' | 'id';
  verificationFile?: File;
  universityEmail?: string;
  additionalInfo?: string;
  hasUploadedProof?: boolean;
  // Properties for preferences step
  currentLocation?: string;
  currentAddress?: string;
  monthlyRent?: string;
  budget?: string;
  preferredDestinations?: string[];
  apartmentDescription?: string;
  gdprConsent?: boolean;
  apartmentPhotos?: File[];
  amenities?: string[];
  // New consent field
  matchingConsent?: boolean;
  // Account creation fields
  password?: string;
  confirmPassword?: string;
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [canGoNext, setCanGoNext] = useState(true);
  const [canGoPrevious, setCanGoPrevious] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated and has completed onboarding
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        // Check if user has already completed onboarding
        try {
          const profile = await loadUserProfile();
          if (profile && profile.full_name && profile.university) {
            // User has already completed onboarding, redirect to already registered page
            navigate("/already-registered");
            return;
          }
          if (profile) {
            const profileData: OnboardingData = {
              fullName: profile.full_name || '',
              email: profile.email || '',
              university: profile.university || '',
              exchangeUniversity: profile.exchange_university || '',
              program: profile.program || '',
              startDate: profile.start_date || '',
              endDate: profile.end_date || '',
              currentLocation: profile.current_location || '',
              currentAddress: profile.current_address || '',
              budget: profile.budget || '',
              preferredDestinations: profile.preferred_destinations || [],
              apartmentDescription: profile.apartment_description || '',
              verificationMethod: profile.verification_method || 'email',
              universityEmail: profile.university_email || '',
              additionalInfo: profile.additional_info || '',
              hasUploadedProof: profile.has_uploaded_proof || false,
              gdprConsent: profile.gdpr_consent || false
            };
            setData(profileData);
          }
        } catch (error) {
          console.error("Error loading existing profile:", error);
        }
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    checkAuth();
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepUpdate = useCallback((newData: Partial<OnboardingData>) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  const handleAccountCreated = () => {
    // Move to completion step instead of redirecting
    setCurrentStep(5);
  };

  const handleComplete = () => {
    // Set completion status and redirect to profile page
    localStorage.setItem('onboardingComplete', 'true');
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swap-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UniversityStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        );
      case 1:
        return (
          <DatesStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        );
      case 2:
        return (
          <EnhancedPreferencesStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        );
      case 3:
        return (
          <ProofOfEnrollmentStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        );
      case 4:
        return (
          <AccountCreationStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onAccountCreated={handleAccountCreated}
            isAuthenticated={isAuthenticated}
          />
        );
      case 5:
        return (
          <CompletionStep
            data={data}
            onUpdate={handleStepUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b shadow-sm">
        <div className="container py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-swap-blue">
            <div className="relative">
              <ArrowRightLeft 
                className="h-8 w-8 text-swap-blue animate-pulse hover:animate-spin transition-all duration-300" 
              />
            </div>
            SwapSpot
          </Link>
        </div>
      </div>

      {/* Main Onboarding Content */}
      <div className="py-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
