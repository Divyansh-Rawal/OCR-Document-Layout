import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "ben", name: "Bengali", native: "বাংলা" },
  { code: "hin", name: "Hindi", native: "हिन्दी" },
  { code: "mar", name: "Marathi", native: "मराठी" },
  { code: "guj", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kan", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "tel", name: "Telugu", native: "తెలుగు" },
  { code: "tam", name: "Tamil", native: "தமிழ்" },
  { code: "eng", name: "English", native: "English" },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Label htmlFor="language" className="text-base font-semibold">
          Document Language
        </Label>
        <p className="text-sm text-muted-foreground">
          Select the primary language of your documents for optimal OCR accuracy
        </p>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground text-sm">({lang.native})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
