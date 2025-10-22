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
    <Card className="p-6 animate-slide-up border-primary/20 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" style={{ backgroundSize: "200% 100%" }} />
      <div className="space-y-3 relative z-10">
        <Label htmlFor="language" className="text-base font-semibold flex items-center gap-2">
          <span>Document Language</span>
          <div className="h-1 flex-1 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full max-w-[100px]" />
        </Label>
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
          Select the primary language of your documents for optimal OCR accuracy
        </p>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger id="language" className="w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] border-primary/20">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code} className="hover:bg-primary/10 transition-colors duration-200">
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
