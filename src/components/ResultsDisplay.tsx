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
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>Processing Results</span>
          <CheckCircle2 className="w-5 h-5 text-success" />
        </h3>
        <Button onClick={handleDownloadJSON} variant="outline" size="sm" className="transition-all duration-200">
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>

      <div className="space-y-6">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="p-4 bg-muted/50 transition-all duration-200 hover:bg-muted/70 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm mb-2">{result.filename}</h4>
                  <Badge variant="secondary">{result.language}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(result.fullText)}
                  className="transition-all duration-200"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Detected Regions ({result.boxes.length})</span>
                  <div className="h-0.5 flex-1 bg-primary/30 rounded-full" />
                </h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.boxes.map((box, boxIndex) => (
                    <div 
                      key={boxIndex} 
                      className="p-3 bg-background rounded-md text-sm border border-border hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {box.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {(box.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{box.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Full Extracted Text</span>
                  <div className="h-0.5 flex-1 bg-primary/30 rounded-full" />
                </h5>
                <div className="p-4 bg-background rounded-md border border-border">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {result.fullText}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
