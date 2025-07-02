
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguagesSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label: string;
}

const languages = [
  "Arabic", "Bengali", "Chinese (Mandarin)", "Chinese (Cantonese)", "Croatian", "Czech", "Danish", "Dutch", "English",
  "Finnish", "French", "German", "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese",
  "Korean", "Malay", "Norwegian", "Polish", "Portuguese", "Romanian", "Russian", "Serbian", "Spanish", "Swedish",
  "Thai", "Turkish", "Ukrainian", "Vietnamese", "Afrikaans", "Albanian", "Armenian", "Azerbaijani", "Basque",
  "Belarusian", "Bosnian", "Bulgarian", "Catalan", "Estonian", "Filipino", "Georgian", "Gujarati", "Icelandic",
  "Irish", "Kazakh", "Latvian", "Lithuanian", "Macedonian", "Maltese", "Mongolian", "Nepali", "Persian", "Punjabi",
  "Slovak", "Slovenian", "Swahili", "Tamil", "Telugu", "Urdu", "Welsh", "Yiddish"
];

const LanguagesSelect: React.FC<LanguagesSelectProps> = ({
  value,
  onChange,
  placeholder = "Select languages",
  label
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (language: string) => {
    if (value.includes(language)) {
      onChange(value.filter(item => item !== language));
    } else {
      onChange([...value, language]);
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    onChange(value.filter(item => item !== languageToRemove));
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
                value.map((language) => (
                  <Badge key={language} variant="secondary" className="text-xs">
                    {language}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          removeLanguage(language);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => removeLanguage(language)}
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
            <CommandInput placeholder="Search languages..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((language) => (
                  <CommandItem
                    key={language}
                    value={language}
                    onSelect={() => handleSelect(language)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(language) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {language}
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

export default LanguagesSelect;
