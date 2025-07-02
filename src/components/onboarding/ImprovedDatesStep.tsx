import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { OnboardingData } from "./OnboardingFlow";

interface ImprovedDatesStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const ImprovedDatesStep: React.FC<ImprovedDatesStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}) => {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const update: Partial<OnboardingData> = {
      [field]: value
    };
    onUpdate(update);
  };

  const canProceed = data.startDate && data.endDate;

  const calculateDuration = () => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      
      if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` and ${days} day${days > 1 ? 's' : ''}` : ''}`;
      }
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CalendarDays className="h-16 w-16 text-swap-blue mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          When would you like to swap?
        </h3>
        <p className="text-gray-600 text-lg">
          Select your exchange dates to find perfect matches
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-swap-blue" />
            Exchange Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={data.startDate || ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-12 border-gray-300 focus:border-swap-blue"
                required
              />
              <p className="text-sm text-gray-500">When do you want to start your exchange?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-base font-medium">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={data.endDate || ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                min={data.startDate || new Date().toISOString().split('T')[0]}
                className="h-12 border-gray-300 focus:border-swap-blue"
                required
              />
              <p className="text-sm text-gray-500">When do you plan to return?</p>
            </div>
          </div>

          {canProceed && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 font-medium">Exchange Duration</p>
              </div>
              <p className="text-blue-700 text-lg font-semibold">
                {calculateDuration()}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Perfect! We'll help you find students with matching timeframes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-6 max-w-2xl mx-auto">
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

export default ImprovedDatesStep;