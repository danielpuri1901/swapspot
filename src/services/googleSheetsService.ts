
import { supabase } from "@/lib/supabase";

interface UserData {
  email: string;
  fullName: string;
  password?: string;
  currentUniversity: string;
  exchangeUniversity: string;
  program: string;
  exchangeStart: string;
  exchangeEnd: string;
  currentAccommodationCity: string;
  address: string;
  monthlyRent: string;
  accommodationDescription: string;
  accommodationPhotos: string;
  amenities: string[];
  universityEmail: string;
  studentUpload: string;
  additionalVerificationInfo: string;
  createdAt: string;
  gdprConsent: boolean;
  matchingConsent: boolean;
  budget: string;
  preferredDestinations: string[];
  verificationMethod: string;
}

// This function sends data to your centralized Google Sheet via Supabase Edge Function
export const addUserToGoogleSheet = async (userData: UserData) => {
  try {
    console.log('Calling Supabase Edge Function: google-sheets');
    console.log('User data being sent:', userData);

    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: userData
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw error;
    }

    console.log('Google Sheets function response:', data);
    return data;
  } catch (error) {
    console.error('Error calling google-sheets Edge Function:', error);
    throw error;
  }
};

export const formatUserDataForSheet = (onboardingData: any): UserData => {
  // Format photo URLs if they exist
  let photoInfo = 'No photos';
  if (onboardingData.photoUrls && onboardingData.photoUrls.length > 0) {
    photoInfo = onboardingData.photoUrls.join(', ');
  } else if (onboardingData.apartmentPhotos?.length > 0) {
    photoInfo = `${onboardingData.apartmentPhotos.length} photos uploaded (local)`;
  }

  // Handle verification information with N/A fallbacks
  const universityEmail = onboardingData.universityEmail || 'N/A';
  const studentUpload = onboardingData.verificationFile ? 
    `File uploaded: ${onboardingData.verificationFile.name}` : 'N/A';
  const additionalVerificationInfo = onboardingData.additionalInfo || 'N/A';

  return {
    email: onboardingData.email || '',
    fullName: onboardingData.fullName || '',
    password: onboardingData.password || 'N/A',
    currentUniversity: onboardingData.university || '',
    exchangeUniversity: onboardingData.exchangeUniversity || '',
    program: onboardingData.program || '',
    exchangeStart: onboardingData.startDate || '',
    exchangeEnd: onboardingData.endDate || '',
    currentAccommodationCity: onboardingData.currentLocation || '',
    address: onboardingData.currentAddress || '',
    monthlyRent: onboardingData.monthlyRent || '',
    accommodationDescription: onboardingData.apartmentDescription || '',
    accommodationPhotos: photoInfo,
    amenities: onboardingData.amenities || [],
    universityEmail: universityEmail,
    studentUpload: studentUpload,
    additionalVerificationInfo: additionalVerificationInfo,
    createdAt: new Date().toISOString(),
    gdprConsent: onboardingData.gdprConsent || false,
    matchingConsent: onboardingData.matchingConsent || false,
    budget: onboardingData.budget || '',
    preferredDestinations: onboardingData.preferredDestinations || [],
    verificationMethod: onboardingData.verificationMethod || 'email',
  };
};
