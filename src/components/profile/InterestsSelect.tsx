
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterestsSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label: string;
}

const interests = [
  "Art", "Basketball", "Books", "Cooking", "Dancing", "Drawing", "Fashion", "Fitness", "Football", "Gaming",
  "Guitar", "Hiking", "History", "Languages", "Movies", "Music", "Nature", "Painting", "Photography", "Piano",
  "Reading", "Running", "Singing", "Soccer", "Sports", "Swimming", "Technology", "Tennis", "Theater", "Travel",
  "Volunteering", "Writing", "Yoga", "Architecture", "Astronomy", "Backpacking", "Baking", "Baseball", "Board Games",
  "Camping", "Cycling", "Design", "Economics", "Film", "Gardening", "Health", "Innovation", "Journalism",
  "Karate", "Literature", "Meditation", "Nutrition", "Outdoors", "Philosophy", "Psychology", "Rock Climbing",
  "Sculpture", "Surfing", "Tennis", "Urban Exploration", "Video Games", "Wine Tasting", "Zumba"
];

const InterestsSelect: React.FC<InterestsSelectProps> = ({
  value,
  onChange,
  placeholder = "Select interests",
  label
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter(item => item !== interest));
    } else {
      onChange([...value, interest]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    onChange(value.filter(item => item !== interestToRemove));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 px-3 text-left font-normal"
          >
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          removeInterest(interest);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => removeInterest(interest)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search interests..." />
            <CommandList>
              <CommandEmpty>No interest found.</CommandEmpty>
              <CommandGroup>
                {interests.map((interest) => (
                  <CommandItem
                    key={interest}
                    value={interest}
                    onSelect={() => handleSelect(interest)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(interest) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {interest}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InterestsSelect;
