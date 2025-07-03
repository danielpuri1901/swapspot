
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Home, Euro, Camera, Check } from "lucide-react";
import { OnboardingData } from "./OnboardingFlow";
import AmenitiesSelector from "./AmenitiesSelector";
import CitySelect from "./CitySelect";

interface EnhancedPreferencesStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const EnhancedPreferencesStep: React.FC<EnhancedPreferencesStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(data.amenities || []);
  const [apartmentPhotos, setApartmentPhotos] = useState<File[]>(data.apartmentPhotos || []);

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setSelectedAmenities(amenities);
    onUpdate({ amenities });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedPhotos = [...apartmentPhotos, ...newFiles];
      setApartmentPhotos(updatedPhotos);
      onUpdate({ apartmentPhotos: updatedPhotos });
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = apartmentPhotos.filter((_, i) => i !== index);
    setApartmentPhotos(updatedPhotos);
    onUpdate({ apartmentPhotos: updatedPhotos });
  };

  const canProceed = data.currentLocation && data.currentAddress && data.budget && data.gdprConsent;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Home className="h-16 w-16 text-swap-blue mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Tell us about your place
        </h3>
        <p className="text-gray-600 text-lg">
          Help us find the perfect match for your accommodation
        </p>
      </div>

      <div className="space-y-8">
        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-swap-blue" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CitySelect
              value={data.currentLocation || ''}
              onChange={(value) => handleInputChange('currentLocation', value)}
              placeholder="Select your current city"
              label="Current City"
            />
            
            <div className="space-y-2">
              <Label htmlFor="currentAddress">Full Address</Label>
              <Input
                id="currentAddress"
                placeholder="Street address, postal code"
                value={data.currentAddress || ''}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                className="h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-swap-blue" />
              Budget Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <Select value={data.budget || ''} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your monthly budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300-500">€300 - €500</SelectItem>
                  <SelectItem value="500-700">€500 - €700</SelectItem>
                  <SelectItem value="700-900">€700 - €900</SelectItem>
                  <SelectItem value="900-1200">€900 - €1,200</SelectItem>
                  <SelectItem value="1200-1500">€1,200 - €1,500</SelectItem>
                  <SelectItem value="1500+">€1,500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-swap-blue" />
              Your Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apartmentDescription">Describe your place</Label>
              <Textarea
                id="apartmentDescription"
                placeholder="Tell potential swappers about your accommodation..."
                value={data.apartmentDescription || ''}
                onChange={(e) => handleInputChange('apartmentDescription', e.target.value)}
                rows={4}
              />
            </div>

            <AmenitiesSelector
              title="Available Amenities"
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={handleAmenitiesChange}
            />

            <div className="space-y-2">
              <Label htmlFor="photos" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos of your place
              </Label>
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="h-12"
              />
              {apartmentPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {apartmentPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Apartment ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Single Consent Box */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdprConsent"
                  checked={data.gdprConsent || false}
                  onCheckedChange={(checked) => handleInputChange('gdprConsent', checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="gdprConsent" className="text-sm font-medium">
                    I agree to the processing of my personal data and want to receive notifications about potential matches *
                  </Label>
                  <p className="text-xs text-gray-600">
                    We'll use your information to help you find suitable accommodation swaps and send you match notifications
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress indicator */}
      {canProceed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Looking good! Ready to move to the next step.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={!canGoPrevious}
          className="flex-1 h-12"
        >
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed || !canGoNext}
          className="flex-1 h-12 bg-swap-blue hover:bg-swap-blue/90 text-white font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default EnhancedPreferencesStep;
