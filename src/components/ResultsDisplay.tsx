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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Processing Results</h3>
        <Button onClick={handleDownloadJSON} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>

      <div className="space-y-6">
        {results.map((result, index) => (
          <Card key={index} className="p-4 bg-muted/50">
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
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Detected Regions ({result.boxes.length})</h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.boxes.map((box, boxIndex) => (
                    <div 
                      key={boxIndex} 
                      className="p-3 bg-background rounded-md text-sm border"
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
                <h5 className="text-sm font-medium">Full Extracted Text</h5>
                <div className="p-4 bg-background rounded-md border">
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
