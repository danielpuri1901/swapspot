import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AcademicCalendarPickerProps {
  onDateSelect: (startDate: Date | undefined, endDate: Date | undefined) => void;
  className?: string;
}

const semesterPresets = [
  {
    name: "Fall 2024",
    startDate: new Date(2024, 8, 1), // September 1, 2024
    endDate: new Date(2024, 11, 20), // December 20, 2024
  },
  {
    name: "Spring 2025",
    startDate: new Date(2025, 0, 15), // January 15, 2025
    endDate: new Date(2025, 4, 15), // May 15, 2025
  },
  {
    name: "Summer 2025",
    startDate: new Date(2025, 5, 1), // June 1, 2025
    endDate: new Date(2025, 7, 31), // August 31, 2025
  },
  {
    name: "Fall 2025",
    startDate: new Date(2025, 8, 1), // September 1, 2025
    endDate: new Date(2025, 11, 20), // December 20, 2025
  },
];

export default function AcademicCalendarPicker({ onDateSelect, className }: AcademicCalendarPickerProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: typeof semesterPresets[0]) => {
    setStartDate(preset.startDate);
    setEndDate(preset.endDate);
    setActivePreset(preset.name);
    onDateSelect(preset.startDate, preset.endDate);
  };

  const handleManualDateSelect = (date: Date | undefined, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
      setActivePreset(null);
      if (date && endDate && date > endDate) {
        setEndDate(undefined);
        onDateSelect(date, undefined);
      } else {
        onDateSelect(date, endDate);
      }
    } else {
      setEndDate(date);
      setActivePreset(null);
      onDateSelect(startDate, date);
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
    } else if (startDate) {
      return `From ${format(startDate, "MMM d, yyyy")}`;
    } else if (endDate) {
      return `Until ${format(endDate, "MMM d, yyyy")}`;
    }
    return "Select dates";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Semester Presets */}
      <div>
        <label className="block text-sm font-medium mb-2">Quick Select Semester</label>
        <div className="flex flex-wrap gap-2">
          {semesterPresets.map((preset) => (
            <Button
              key={preset.name}
              variant={activePreset === preset.name ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetSelect(preset)}
              className="flex items-center gap-1"
            >
              <CalendarRange className="h-3 w-3" />
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Or Choose Custom Dates</label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleManualDateSelect(date, true)}
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleManualDateSelect(date, false)}
                    className="pointer-events-auto"
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </div>
              </div>
              <Button 
                onClick={() => setIsOpen(false)} 
                className="w-full mt-4"
                disabled={!startDate && !endDate}
              >
                Apply Dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Dates Display */}
      {(startDate || endDate) && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {formatDateRange()}
          </Badge>
          {activePreset && (
            <Badge variant="outline">
              {activePreset}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
