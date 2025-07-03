import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Calendar, Users, Star } from "lucide-react";
import { OnboardingData } from "./OnboardingFlow";
import SwapCompatibilityIndicator from "../SwapCompatibilityIndicator";
import { saveOnboardingData } from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";
import { formatUserDataForSheet } from "@/services/googleSheetsService";
import { supabase } from "@/lib/supabase";

interface MatchesStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const MatchesStep: React.FC<MatchesStepProps> = ({
  data,
  onPrevious,
  canGoPrevious
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock matches based on user's data
  const mockMatches = [
    {
      id: 1,
      title: "Cozy Studio in City Center",
      location: "Amsterdam, Netherlands",
      university: "University of Amsterdam",
      dates: { start: "2025-09-01", end: "2025-12-15" },
      compatibility: 95,
      rating: 4.8,
      reviews: 12,
      images: ["/placeholder.svg"]
    },
    {
      id: 2,
      title: "Shared Apartment Near Campus",
      location: "Berlin, Germany",
      university: "Technical University of Berlin",
      dates: { start: "2025-08-15", end: "2025-12-20" },
      compatibility: 87,
      rating: 4.6,
      reviews: 8,
      images: ["/placeholder.svg"]
    },
    {
      id: 3,
      title: "Modern Room with Great Views",
      location: "Paris, France",
      university: "Sorbonne University",
      dates: { start: "2025-09-05", end: "2025-01-10" },
      compatibility: 82,
      rating: 4.9,
      reviews: 15,
      images: ["/placeholder.svg"]
    }
  ];

  const handleFinishOnboarding = async () => {
    try {
      // Save onboarding data to localStorage for backup
      const submissionId = saveOnboardingData(data);
      
      // Send all data to your centralized Google Sheet
      try {
        const userData = formatUserDataForSheet(data);
        
        const { error } = await supabase.functions.invoke('google-sheets', {
          body: userData
        });
        
        if (error) {
          console.error('Error sending to Google Sheets:', error);
          toast({
            title: "Warning",
            description: "Profile saved locally but couldn't sync to central database. We'll retry automatically.",
            variant: "destructive",
          });
        } else {
          console.log('Successfully sent data to centralized Google Sheet');
          toast({
            title: "Profile Submitted Successfully!",
            description: "Your information has been sent to our team for review. We'll contact you with perfect exchange opportunities!",
          });
        }
      } catch (sheetsError) {
        console.error('Error with Google Sheets integration:', sheetsError);
        toast({
          title: "Profile Saved",
          description: "Your preferences are saved locally. We'll sync to our database shortly.",
        });
      }
      
      // Set completion status
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      navigate('/browse');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error",
        description: "There was an issue saving your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="bg-green-100 p-3 rounded-full">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Your First Matches!</h3>
        <p className="text-gray-600">Based on your preferences, here are some great swap opportunities</p>
      </div>

      <div className="space-y-4">
        {mockMatches.map((match) => (
          <Card key={match.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={match.images[0]}
                  alt={match.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{match.title}</h4>
                    <SwapCompatibilityIndicator 
                      compatibility={match.compatibility}
                      variant="compact"
                    />
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {match.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {match.university}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {match.dates.start} - {match.dates.end}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {match.rating} ({match.reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
        <h4 className="font-semibold text-blue-800 mb-2">🎉 Profile Complete!</h4>
        <p className="text-sm text-blue-700 mb-3">
          Your information will be sent directly to our centralized database for manual review. We'll contact you with perfect exchange opportunities!
        </p>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Ready for manual review
        </Badge>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={!canGoPrevious}
        >
          Previous
        </Button>
        <Button 
          onClick={handleFinishOnboarding}
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          Submit My Information
        </Button>
      </div>
    </div>
  );
};

export default MatchesStep;
