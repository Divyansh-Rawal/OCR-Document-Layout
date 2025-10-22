import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ProcessingStage = 
  | "upload"
  | "tilt-correction"
  | "layout-detection"
  | "ocr"
  | "cleaning"
  | "complete";

interface ProcessingStagesProps {
  currentStage: ProcessingStage;
  isProcessing: boolean;
}

const stages = [
  { id: "upload", label: "Document Upload", description: "Upload your documents" },
  { id: "tilt-correction", label: "Tilt Correction", description: "Correcting document orientation" },
  { id: "layout-detection", label: "Layout Detection", description: "Detecting text regions with YOLO" },
  { id: "ocr", label: "OCR Processing", description: "Extracting text from regions" },
  { id: "cleaning", label: "Text Cleaning", description: "Applying language-specific corrections" },
  { id: "complete", label: "Complete", description: "Processing finished" },
];

export const ProcessingStages = ({ currentStage, isProcessing }: ProcessingStagesProps) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  const getStageStatus = (index: number) => {
    if (index < currentIndex) return "complete";
    if (index === currentIndex) return isProcessing ? "processing" : "current";
    return "pending";
  };

  return (
    <Card className="p-6 animate-bounce-in border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="animate-pulse-glow">Processing Pipeline</span>
          <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
        </h3>
        <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          return (
            <div 
              key={stage.id} 
              className={`flex items-start gap-4 transition-all duration-500 ${
                status === "processing" || status === "current" ? "animate-slide-up" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                {status === "complete" ? (
                  <CheckCircle2 className="w-6 h-6 text-success animate-bounce-in drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                ) : status === "processing" ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                ) : status === "current" ? (
                  <Circle className="w-6 h-6 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground transition-colors duration-300" />
                )}
                {index < stages.length - 1 && (
                  <div 
                    className={`w-0.5 h-12 mt-2 transition-all duration-500 ${
                      status === "complete" ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8 group">
                <h4 className={`font-medium transition-all duration-300 ${
                  status === "complete" || status === "processing" || status === "current"
                    ? "text-foreground group-hover:translate-x-2" 
                    : "text-muted-foreground"
                }`}>
                  {stage.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 transition-all duration-300 group-hover:text-foreground/80">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </Card>
  );
};
