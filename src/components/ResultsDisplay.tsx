import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  text: string;
  confidence: number;
}

interface ResultsDisplayProps {
  results: {
    filename: string;
    language: string;
    boxes: BoundingBox[];
    fullText: string;
  }[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ocr-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 animate-bounce-in border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="animate-pulse-glow">Processing Results</span>
            <CheckCircle2 className="w-5 h-5 text-success animate-bounce-in" />
          </h3>
          <Button onClick={handleDownloadJSON} variant="outline" size="sm" className="transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] border-primary/20">
            <Download className="w-4 h-4 mr-2 animate-float" />
            Download JSON
          </Button>
        </div>

        <div className="space-y-6">
          {results.map((result, index) => (
            <Card 
              key={index} 
              className="p-4 bg-muted/50 animate-slide-up hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 hover:scale-[1.02] border border-transparent hover:border-primary/20 group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" style={{ backgroundSize: "200% 100%" }} />
              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="animate-fade-in">
                    <h4 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors duration-300">{result.filename}</h4>
                    <Badge variant="secondary" className="animate-scale-in border border-primary/20">{result.language}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyText(result.fullText)}
                    className="transition-all duration-300 hover:scale-125 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-success animate-bounce-in" />
                    ) : (
                      <Copy className="w-4 h-4 group-hover:text-primary" />
                    )}
                  </Button>
                </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Detected Regions ({result.boxes.length})</span>
                  <div className="h-1 flex-1 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
                </h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.boxes.map((box, boxIndex) => (
                    <div 
                      key={boxIndex} 
                      className="p-3 bg-background rounded-md text-sm border border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in group"
                      style={{ animationDelay: `${boxIndex * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-primary/20 group-hover:bg-primary/10 transition-colors duration-300">
                          {box.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                          {(box.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">{box.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Full Extracted Text</span>
                  <div className="h-1 flex-1 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
                </h5>
                <div className="p-4 bg-background rounded-md border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {result.fullText}
                  </p>
                </div>
              </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
